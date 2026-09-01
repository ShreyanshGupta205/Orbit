import { query } from "../config/db.js";
import { broadcastRealtimeAlert } from "./realtime.service.js";

// Deduplication cooldown window (15 minutes in milliseconds)
const DEDUPLICATION_WINDOW_MS = 15 * 60 * 1000;

/**
 * Fetch alerts targeted to a user, joined with user-specific read/ack states.
 */
export async function getUserAlerts({
  userId,
  userRole = "citizen",
  districtId = null,
  page = 1,
  limit = 20
} = {}) {
  const safeLimit = Math.min(Math.max(limit, 1), 100);
  const offset = (Math.max(page, 1) - 1) * safeLimit;

  // Build target role check: Admin sees all; others see their role or public
  const targetRoles = [userRole];
  if (userRole !== "citizen") targetRoles.push("all");

  const sql = `
    SELECT 
      a.id,
      a.type,
      a.severity,
      a.message,
      a.channel,
      a.status                       AS global_status,
      a.created_at,
      a.sent_at,
      a.road_segment_id,
      r.name                         AS road_name,
      a.facility_id,
      f.name                         AS facility_name,
      a.district_id,
      d.name                         AS district_name,
      a.target_role,
      a.target_user_id,
      COALESCE(aus.is_read, FALSE)   AS is_read,
      aus.read_at,
      COALESCE(aus.is_acknowledged, FALSE) AS is_acknowledged,
      aus.acknowledged_at
    FROM alerts a
    LEFT JOIN road_segments r ON r.id = a.road_segment_id
    LEFT JOIN facilities f ON f.id = a.facility_id
    LEFT JOIN districts d ON d.id = a.district_id
    LEFT JOIN alert_user_states aus ON aus.alert_id = a.id AND aus.user_id = $1
    WHERE 
      (a.target_user_id IS NULL OR a.target_user_id = $1)
      AND (
        $2 = 'admin' 
        OR a.target_role IS NULL 
        OR a.target_role = $2 
        OR a.target_role LIKE '%' || $2 || '%'
      )
      AND (
        a.district_id IS NULL 
        OR $3::bigint IS NULL 
        OR a.district_id = $3::bigint
        OR $2 IN ('admin', 'authority')
      )
    ORDER BY a.created_at DESC
    LIMIT $4 OFFSET $5;
  `;

  const result = await query(sql, [userId, userRole, districtId || null, safeLimit, offset]);
  return result.rows;
}

/**
 * Get total unread alert count for a specific user.
 */
export async function getUnreadAlertCount(userId, userRole = "citizen") {
  const sql = `
    SELECT COUNT(*) AS unread_count
    FROM alerts a
    LEFT JOIN alert_user_states aus ON aus.alert_id = a.id AND aus.user_id = $1
    WHERE 
      (a.target_user_id IS NULL OR a.target_user_id = $1)
      AND (
        $2 = 'admin' 
        OR a.target_role IS NULL 
        OR a.target_role = $2 
        OR a.target_role LIKE '%' || $2 || '%'
      )
      AND COALESCE(aus.is_read, FALSE) = FALSE;
  `;
  const result = await query(sql, [userId, userRole]);
  return parseInt(result.rows[0]?.unread_count || "0", 10);
}

/**
 * Create an outbound alert with deduplication and real-time SSE broadcast.
 */
export async function createAlert({
  type,
  severity = "medium",
  targetRole = null,
  targetUserId = null,
  districtId = null,
  roadSegmentId = null,
  facilityId = null,
  message,
  channel = "in_app",
  status = "sent"
}) {
  // Deduplication Guard: Check if an identical alert exists within the cooldown window
  const isDuplicate = await checkDuplicateAlert({
    type,
    roadSegmentId,
    facilityId,
    targetRole
  });

  if (isDuplicate) {
    console.log(`[ALERT DEDUPLICATED] Suppressed duplicate alert: ${type} for road/facility (${roadSegmentId}/${facilityId})`);
    return null;
  }

  const sql = `
    INSERT INTO alerts (
      type,
      severity,
      target_role,
      target_user_id,
      district_id,
      road_segment_id,
      facility_id,
      message,
      channel,
      status,
      sent_at,
      created_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, now(), now())
    RETURNING *;
  `;

  const result = await query(sql, [
    type,
    severity,
    targetRole,
    targetUserId,
    districtId,
    roadSegmentId,
    facilityId,
    message,
    channel,
    status
  ]);

  const newAlert = result.rows[0];

  // Broadcast to active real-time SSE subscribers
  if (newAlert) {
    broadcastRealtimeAlert(newAlert);
  }

  return newAlert;
}

/**
 * Check if a similar alert was generated recently (deduplication check).
 */
async function checkDuplicateAlert({ type, roadSegmentId, facilityId, targetRole }) {
  let whereClause = "WHERE type = $1 AND created_at >= (now() - INTERVAL '15 minutes')";
  const params = [type];

  if (roadSegmentId) {
    params.push(roadSegmentId);
    whereClause += ` AND road_segment_id = $${params.length}`;
  }
  if (facilityId) {
    params.push(facilityId);
    whereClause += ` AND facility_id = $${params.length}`;
  }
  if (targetRole) {
    params.push(targetRole);
    whereClause += ` AND target_role = $${params.length}`;
  }

  const sql = `SELECT id FROM alerts ${whereClause} LIMIT 1;`;
  const result = await query(sql, params);
  return result.rows.length > 0;
}

/**
 * Mark an alert as read for a specific user.
 */
export async function markAlertRead(alertId, userId) {
  const sql = `
    INSERT INTO alert_user_states (alert_id, user_id, is_read, read_at)
    VALUES ($1, $2, TRUE, now())
    ON CONFLICT (alert_id, user_id)
    DO UPDATE SET is_read = TRUE, read_at = now()
    RETURNING *;
  `;
  const result = await query(sql, [alertId, userId]);
  return result.rows[0];
}

/**
 * Mark an alert as acknowledged for a specific user.
 */
export async function markAlertAcknowledged(alertId, userId) {
  const sql = `
    INSERT INTO alert_user_states (alert_id, user_id, is_acknowledged, acknowledged_at, is_read, read_at)
    VALUES ($1, $2, TRUE, now(), TRUE, now())
    ON CONFLICT (alert_id, user_id)
    DO UPDATE SET is_acknowledged = TRUE, acknowledged_at = now(), is_read = TRUE, read_at = COALESCE(alert_user_states.read_at, now())
    RETURNING *;
  `;
  await query(sql, [alertId, userId]);

  // Update global alert status to 'acknowledged'
  const updateGlobal = `UPDATE alerts SET status = 'acknowledged' WHERE id = $1 RETURNING *;`;
  const res = await query(updateGlobal, [alertId]);
  return res.rows[0] || null;
}

/**
 * Resolve an alert globally (Restricted to authority / admin).
 */
export async function resolveAlert(alertId) {
  const sql = `
    UPDATE alerts
    SET status = 'acknowledged'
    WHERE id = $1
    RETURNING *;
  `;
  const result = await query(sql, [alertId]);
  return result.rows[0] || null;
}

// ——— CENTRALIZED EVENT EVALUATORS ——————————————————————————————————

/**
 * Evaluates a newly reported incident.
 * High/Critical severity -> Alert Authority and Admin.
 */
export async function evalIncidentReported(incident) {
  if (incident.severity !== "high" && incident.severity !== "critical") {
    return null; // Skip minor/medium unverified incidents
  }

  return await createAlert({
    type: "incident",
    severity: incident.severity,
    targetRole: "authority,admin",
    districtId: incident.district_id || null,
    roadSegmentId: incident.road_segment_id || null,
    message: `[REPORTED] Critical ${incident.type} reported near ${incident.road_name || 'road segment'}. Review required.`,
    channel: "in_app"
  });
}

/**
 * Evaluates a verified incident.
 * Verified incidents alert Field Agents, Logistics, Authority, and Admin.
 */
export async function evalIncidentVerified(incident) {
  return await createAlert({
    type: "incident",
    severity: incident.severity || "high",
    targetRole: "field_agent,logistics,authority,admin",
    districtId: incident.district_id || null,
    roadSegmentId: incident.road_segment_id || null,
    message: `[VERIFIED] Confirmed ${incident.type} on ${incident.road_name || 'road segment'}. Impact area verified.`,
    channel: "in_app"
  });
}

/**
 * Evaluates risk score transition for a road segment.
 * Triggers alert on Medium -> High (>= 0.50) or High -> Critical (>= 0.70).
 */
export async function evalRiskTransition({ roadSegmentId, roadName, oldRisk, newRisk, districtId }) {
  let severity = null;
  let message = "";

  if (oldRisk < 0.70 && newRisk >= 0.70) {
    severity = "critical";
    message = `[CRITICAL RISK] ${roadName || 'Road segment'} risk escalated to CRITICAL (${newRisk}). Closure likely.`;
  } else if (oldRisk < 0.50 && newRisk >= 0.50) {
    severity = "high";
    message = `[HIGH RISK] ${roadName || 'Road segment'} risk escalated to HIGH (${newRisk}). Caution advised.`;
  }

  if (!severity) return null;

  return await createAlert({
    type: "road_risk",
    severity,
    targetRole: "logistics,authority,admin",
    districtId: districtId || null,
    roadSegmentId,
    message,
    channel: "in_app"
  });
}

/**
 * Evaluates AI risk prediction.
 * High confidence (>= 0.80) and predicted risk (>= 0.70) -> Alert Authority/Admin.
 */
export async function evalAIPrediction({ roadSegmentId, roadName, predictedRisk, confidence, districtId }) {
  if (confidence < 0.80 || predictedRisk < 0.70) {
    return null; // Suppress low-confidence or low-severity predictions
  }

  return await createAlert({
    type: "road_risk",
    severity: "critical",
    targetRole: "authority,admin",
    districtId: districtId || null,
    roadSegmentId,
    message: `[AI PREDICTION] Critical hazard predicted on ${roadName || 'road segment'} with ${(confidence * 100).toFixed(0)}% confidence.`,
    channel: "in_app"
  });
}

/**
 * Evaluates an Evacuation Recommendation.
 * Alerts citizens, field agents, authority, and admin in the target district.
 */
export async function evalEvacuationRecommended({ startPoint, destinationFacility, routeRisk, reason, districtId }) {
  const severity = routeRisk >= 0.7 ? "critical" : routeRisk >= 0.5 ? "high" : "medium";

  return await createAlert({
    type: "road_closure",
    severity,
    targetRole: "citizen,field_agent,authority,admin",
    districtId: districtId || null,
    message: `[EVACUATION ADVISORY] Recommended evacuation to ${destinationFacility}. ${reason || ''}`,
    channel: "in_app"
  });
}

/**
 * Evaluates Facility Isolation event.
 */
export async function evalFacilityIsolated({ facilityId, facilityName, roadSegmentId, districtId }) {
  return await createAlert({
    type: "facility_isolation",
    severity: "high",
    targetRole: "logistics,authority,admin",
    districtId: districtId || null,
    facilityId: facilityId || null,
    roadSegmentId: roadSegmentId || null,
    message: `[FACILITY ISOLATED] Access to ${facilityName || 'Facility'} cut off due to road segment failure. Emergency rerouting required.`,
    channel: "in_app"
  });
}

/**
 * Evaluates Severe Weather event.
 */
export async function evalSevereWeatherAlert({ location, rainfall, windSpeed, districtId }) {
  const severity = rainfall >= 25.0 || windSpeed >= 60 ? "critical" : "high";

  return await createAlert({
    type: "weather",
    severity,
    targetRole: "citizen,field_agent,logistics,authority,admin",
    districtId: districtId || null,
    roadSegmentId: 1, // Satisfies alerts_has_target constraint
    message: `[SEVERE WEATHER WARNING] Heavy rainfall (${rainfall} mm/hr) and high wind (${windSpeed} km/h) near ${location || 'region'}. Exercise extreme caution.`,
    channel: "in_app"
  });
}

export default {
  getUserAlerts,
  getUnreadAlertCount,
  createAlert,
  markAlertRead,
  markAlertAcknowledged,
  resolveAlert,
  evalIncidentReported,
  evalIncidentVerified,
  evalRiskTransition,
  evalAIPrediction,
  evalEvacuationRecommended,
  evalFacilityIsolated,
  evalSevereWeatherAlert
};
