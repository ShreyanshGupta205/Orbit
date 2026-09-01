import { query } from "../config/db.js";
import { evalIncidentReported, evalIncidentVerified } from "./alerts.service.js";

/**
 * Helper to format incident rows with geometry JSON
 */
function formatIncident(row) {
  return {
    id: row.id,
    type: row.type,
    severity: row.severity,
    roadSegmentId: row.road_segment_id,
    roadName: row.road_name,
    districtId: row.district_id,
    districtName: row.district_name,
    reportedBy: row.reported_by,
    reportedAt: row.reported_at,
    description: row.description,
    photoUrl: row.photo_url,
    verified: row.verified,
    resolutionTime: row.resolution_time,
    resolvedAt: row.resolved_at,
    geometry: row.geometry
  };
}

/**
 * Fetch incidents with optional filters, pagination and free‑text search.
 * options: { filters, page, limit, search }
 */
export async function getAllIncidents({ filters = {}, page = 1, limit = 20, search = "" } = {}) {
  // enforce max limit of 100 as per user decision
  const safeLimit = Math.min(limit, 100);
  const offset = (page - 1) * safeLimit;

  let whereClause = "WHERE 1=1";
  const params = [];

  if (filters.districtId) {
    params.push(filters.districtId);
    whereClause += ` AND rs.district_id = $${params.length}`;
  }
  if (filters.severity) {
    params.push(filters.severity);
    whereClause += ` AND i.severity = $${params.length}`;
  }
  if (filters.type) {
    params.push(filters.type);
    whereClause += ` AND i.type = $${params.length}`;
  }
  if (filters.verified !== undefined) {
    params.push(filters.verified);
    whereClause += ` AND i.verified = $${params.length}`;
  }
  if (search) {
    params.push(`%${search}%`);
    whereClause += ` AND i.description ILIKE $${params.length}`;
  }

  const sql = `
    SELECT 
      i.id,
      i.type,
      i.severity,
      i.road_segment_id,
      rs.name AS road_name,
      rs.district_id,
      d.name AS district_name,
      i.reported_by,
      i.reported_at,
      i.description,
      i.photo_url,
      i.verified,
      i.resolution_time,
      i.resolved_at,
      ST_AsGeoJSON(i.geometry)::json AS geometry
    FROM incidents i
    LEFT JOIN road_segments rs ON rs.id = i.road_segment_id
    LEFT JOIN districts d ON d.id = rs.district_id
    ${whereClause}
    ORDER BY i.reported_at DESC
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `;
  params.push(safeLimit, offset);

  const result = await query(sql, params);
  return result.rows.map(formatIncident);
}

/**
 * Retrieve a single incident by its id.
 */
export async function getIncidentById(id) {
  const sql = `
    SELECT 
      i.id,
      i.type,
      i.severity,
      i.road_segment_id,
      rs.name AS road_name,
      rs.district_id,
      d.name AS district_name,
      i.reported_by,
      i.reported_at,
      i.description,
      i.photo_url,
      i.verified,
      i.resolution_time,
      i.resolved_at,
      ST_AsGeoJSON(i.geometry)::json AS geometry
    FROM incidents i
    LEFT JOIN road_segments rs ON rs.id = i.road_segment_id
    LEFT JOIN districts d ON d.id = rs.district_id
    WHERE i.id = $1
  `;
  const result = await query(sql, [id]);
  return result.rows[0] ? formatIncident(result.rows[0]) : null;
}

/**
 * Create a new incident. If roadSegmentId is null, attempt auto‑match to the nearest road
 * segment within 100 m.
 */
export async function createIncident({
  type,
  severity = "medium",
  roadSegmentId = null,
  longitude,
  latitude,
  reportedBy,
  description = "",
  photoUrl = null
}) {
  // Auto‑match road segment if not supplied
  let finalRoadSegmentId = roadSegmentId;
  if (!finalRoadSegmentId) {
    const matchSql = `
      SELECT id FROM road_segments
      WHERE ST_DWithin(geometry, ST_SetSRID(ST_MakePoint($1, $2), 4326), 100)
      ORDER BY ST_Distance(geometry, ST_SetSRID(ST_MakePoint($1, $2), 4326))
      LIMIT 1
    `;
    const matchRes = await query(matchSql, [parseFloat(longitude), parseFloat(latitude)]);
    if (matchRes.rows.length) {
      finalRoadSegmentId = matchRes.rows[0].id;
    }
  }

  const sql = `
    INSERT INTO incidents (
      type,
      severity,
      road_segment_id,
      geometry,
      reported_by,
      description,
      photo_url,
      verified,
      reported_at
    ) VALUES (
      $1,
      $2,
      $3,
      ST_SetSRID(ST_MakePoint($4, $5), 4326),
      $6,
      $7,
      $8,
      FALSE,
      now()
    )
    RETURNING 
      id,
      type,
      severity,
      road_segment_id,
      reported_by,
      reported_at,
      description,
      photo_url,
      verified,
      ST_AsGeoJSON(geometry)::json AS geometry;
  `;

  const params = [
    type,
    severity,
    finalRoadSegmentId,
    parseFloat(longitude),
    parseFloat(latitude),
    reportedBy,
    description,
    photoUrl
  ];

  const result = await query(sql, params);
  const incident = formatIncident(result.rows[0]);

  // Evaluate for automatic real-time alerting
  evalIncidentReported(incident).catch(err => console.error("Alert eval error:", err));

  return incident;
}

/**
 * Update mutable fields of an incident (description, severity).
 */
export async function updateIncident(id, { description, severity }) {
  const fields = [];
  const params = [id];

  if (description !== undefined) {
    params.push(description);
    fields.push(`description = $${params.length}`);
  }
  if (severity !== undefined) {
    params.push(severity);
    fields.push(`severity = $${params.length}`);
  }

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  const sql = `
    UPDATE incidents
    SET ${fields.join(", ")}
    WHERE id = $1
    RETURNING 
      id,
      type,
      severity,
      road_segment_id,
      reported_by,
      reported_at,
      description,
      photo_url,
      verified,
      resolved_at,
      resolution_time,
      ST_AsGeoJSON(geometry)::json AS geometry;
  `;
  const result = await query(sql, params);
  return formatIncident(result.rows[0]);
}

/**
 * Mark an incident as verified.
 */
export async function verifyIncident(id) {
  const sql = `
    UPDATE incidents
    SET verified = TRUE
    WHERE id = $1
    RETURNING 
      id,
      type,
      severity,
      road_segment_id,
      reported_by,
      reported_at,
      description,
      photo_url,
      verified,
      resolved_at,
      resolution_time,
      ST_AsGeoJSON(geometry)::json AS geometry;
  `;
  const result = await query(sql, [id]);
  return result.rows[0] ? formatIncident(result.rows[0]) : null;
}

/**
 * Resolve an incident – set resolved_at and compute resolution_time (seconds).
 */
export async function resolveIncident(id) {
  const sql = `
    UPDATE incidents
    SET 
      resolved_at = now(),
      resolution_time = EXTRACT(EPOCH FROM now() - reported_at)
    WHERE id = $1
    RETURNING 
      id,
      type,
      severity,
      road_segment_id,
      reported_by,
      reported_at,
      description,
      photo_url,
      verified,
      resolved_at,
      resolution_time,
      ST_AsGeoJSON(geometry)::json AS geometry;
  `;
  const result = await query(sql, [id]);
  return result.rows[0] ? formatIncident(result.rows[0]) : null;
}

/**
 * Delete an incident record.
 */
export async function deleteIncident(id) {
  const sql = `
    DELETE FROM incidents
    WHERE id = $1
    RETURNING id;
  `;
  const result = await query(sql, [id]);
  return result.rows[0] ? result.rows[0].id : null;
}

/**
 * Verify an incident within a transaction (incident update + audit insert).
 * Returns:
 *   { incident, alreadyVerified: false } on success
 *   { incident: null, alreadyVerified: true }  when already verified (409)
 *   null when incident does not exist (404)
 *
 * @param {pg.PoolClient} client - transaction client
 * @param {number|string} id - incident id
 * @param {string} actorUserId - Clerk user ID of the verifier
 */
export async function verifyIncidentTx(client, id, actorUserId) {
  // First, lock and read the incident – this prevents TOCTOU race conditions
  const lockSql = `
    SELECT id, verified, severity, road_segment_id
    FROM incidents
    WHERE id = $1
    FOR UPDATE;
  `;
  const lockResult = await client.query(lockSql, [id]);

  // Incident does not exist
  if (!lockResult.rows[0]) return null;

  // Already verified — return sentinel so caller can respond 409
  if (lockResult.rows[0].verified === true) {
    return { incident: null, alreadyVerified: true, roadSegmentId: lockResult.rows[0].road_segment_id, severity: lockResult.rows[0].severity };
  }

  // Safe to verify — only unverified rows reach here
  const verifySql = `
    UPDATE incidents
    SET verified = TRUE
    WHERE id = $1
      AND verified = FALSE
    RETURNING 
      id,
      type,
      severity,
      road_segment_id,
      reported_by,
      reported_at,
      description,
      photo_url,
      verified,
      resolved_at,
      resolution_time,
      ST_AsGeoJSON(geometry)::json AS geometry;
  `;
  const result = await client.query(verifySql, [id]);
  if (!result.rows[0]) {
    // Lost a concurrent race — another transaction verified it between our SELECT and UPDATE
    return { incident: null, alreadyVerified: true, roadSegmentId: lockResult.rows[0].road_segment_id, severity: lockResult.rows[0].severity };
  }

  const { logActionTx } = await import("./audit.service.js");
  await logActionTx(client, {
    actorUserId,
    targetUserId: String(id),
    action: "verify_incident",
    oldValue: { verified: false },
    newValue: { verified: true },
    metadata: {
      type: result.rows[0].type,
      severity: result.rows[0].severity,
      roadSegmentId: result.rows[0].road_segment_id
    }
  });

  const verifiedIncident = formatIncident(result.rows[0]);
  evalIncidentVerified(verifiedIncident).catch(err => console.error("Alert eval error:", err));

  return { incident: verifiedIncident, alreadyVerified: false, roadSegmentId: result.rows[0].road_segment_id, severity: result.rows[0].severity };
}

/**
 * Resolve an incident within a transaction (incident update + audit insert).
 * @param {pg.PoolClient} client - transaction client
 * @param {number|string} id - incident id
 * @param {string} actorUserId - Clerk user ID of the resolver
 */
export async function resolveIncidentTx(client, id, actorUserId) {
  const resolveSql = `
    UPDATE incidents
    SET 
      resolved_at = now(),
      resolution_time = EXTRACT(EPOCH FROM now() - reported_at)
    WHERE id = $1
    RETURNING 
      id,
      type,
      severity,
      road_segment_id,
      reported_by,
      reported_at,
      description,
      photo_url,
      verified,
      resolved_at,
      resolution_time,
      ST_AsGeoJSON(geometry)::json AS geometry;
  `;
  const result = await client.query(resolveSql, [id]);
  if (!result.rows[0]) return null;

  const { logActionTx } = await import("./audit.service.js");
  await logActionTx(client, {
    actorUserId,
    targetUserId: String(id),
    action: "resolve_incident",
    oldValue: { resolvedAt: null },
    newValue: { resolvedAt: result.rows[0].resolved_at, resolutionTime: result.rows[0].resolution_time }
  });

  return formatIncident(result.rows[0]);
}

export default {
  getAllIncidents,
  getIncidentById,
  createIncident,
  updateIncident,
  verifyIncident,
  resolveIncident,
  verifyIncidentTx,
  resolveIncidentTx,
  deleteIncident
};
