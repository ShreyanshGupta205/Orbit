import { query } from "../config/db.js";

/**
 * Get risk-prioritized roads with incident counts, hazard exposure, and pagination.
 *
 * Reuses existing v_latest_risk view (total_risk from risk_snapshots) — no new formula.
 *
 * @param {Object} options
 * @param {number} [options.districtId] - Filter by district
 * @param {string} [options.roadType] - Filter by road_class enum
 * @param {number} [options.minRisk] - Minimum total_risk threshold (0-1)
 * @param {string} [options.sort] - Sort field: 'risk' (default), 'incidents', 'name'
 * @param {number} [options.page] - Page number (1-indexed)
 * @param {number} [options.limit] - Items per page (max 100)
 * @param {string} [options.search] - Free-text search on road name
 */
export async function getRiskPrioritizedRoads({
  districtId,
  roadType,
  minRisk,
  sort = "risk",
  page = 1,
  limit = 20,
  search
} = {}) {
  const safeLimit = Math.min(Math.max(limit, 1), 100);
  const offset = (Math.max(page, 1) - 1) * safeLimit;

  let whereClause = "WHERE 1=1";
  const params = [];

  if (districtId) {
    params.push(districtId);
    whereClause += ` AND r.district_id = $${params.length}`;
  }
  if (roadType) {
    params.push(roadType);
    whereClause += ` AND r.type = $${params.length}`;
  }
  if (minRisk !== undefined && minRisk !== null) {
    params.push(parseFloat(minRisk));
    whereClause += ` AND COALESCE(lr.total_risk, 0) >= $${params.length}`;
  }
  if (search) {
    params.push(`%${search}%`);
    whereClause += ` AND r.name ILIKE $${params.length}`;
  }

  // Determine ORDER BY from sort param
  let orderBy;
  switch (sort) {
    case "incidents":
      orderBy = "active_incidents DESC, COALESCE(lr.total_risk, 0) DESC";
      break;
    case "name":
      orderBy = "r.name ASC";
      break;
    case "risk":
    default:
      orderBy = "COALESCE(lr.total_risk, 0) DESC, active_incidents DESC";
      break;
  }

  const sql = `
    SELECT
      r.id,
      r.name,
      r.district_id,
      d.name AS district_name,
      r.type,
      r.length_km,
      r.surface_quality,
      ST_AsGeoJSON(r.geometry)::json AS geometry,
      COALESCE(lr.total_risk, 0)            AS total_risk,
      COALESCE(lr.flood_risk, 0)            AS flood_risk,
      COALESCE(lr.landslide_risk, 0)        AS landslide_risk,
      COALESCE(lr.road_condition_score, 0)  AS road_condition_score,
      COALESCE(lr.rainfall_score, 0)        AS rainfall_score,
      lr."timestamp"                        AS risk_updated_at,
      -- Active verified incident count on this road segment
      COALESCE(ic.cnt, 0)                   AS active_incidents,
      -- Hazard zone exposure
      EXISTS (
        SELECT 1 FROM hazard_zones z
        WHERE z.hazard_type = 'flood'
          AND ST_Intersects(r.geometry, z.geometry)
      )                                     AS in_flood_zone,
      EXISTS (
        SELECT 1 FROM hazard_zones z
        WHERE z.hazard_type = 'landslide'
          AND ST_Intersects(r.geometry, z.geometry)
      )                                     AS in_landslide_zone,
      -- Priority label derived from total_risk (uses existing field, no new formula)
      CASE
        WHEN COALESCE(lr.total_risk, 0) >= 0.70 THEN 'critical'
        WHEN COALESCE(lr.total_risk, 0) >= 0.50 THEN 'high'
        WHEN COALESCE(lr.total_risk, 0) >= 0.30 THEN 'moderate'
        ELSE 'normal'
      END                                   AS priority
    FROM road_segments r
    LEFT JOIN districts d ON d.id = r.district_id
    LEFT JOIN v_latest_risk lr ON lr.road_segment_id = r.id
    LEFT JOIN (
      SELECT road_segment_id, COUNT(*) AS cnt
      FROM incidents
      WHERE verified = TRUE AND resolved_at IS NULL
      GROUP BY road_segment_id
    ) ic ON ic.road_segment_id = r.id
    ${whereClause}
    ORDER BY ${orderBy}, r.id
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `;
  params.push(safeLimit, offset);

  const result = await query(sql, params);
  return result.rows;
}

/**
 * Dashboard summary stats — counts from live data.
 * Uses existing v_latest_risk and incidents tables.
 */
export async function getRiskSummary(districtId = null) {
  const params = [];
  let districtFilter = "";
  let incidentDistrictFilter = "";

  if (districtId) {
    params.push(districtId);
    districtFilter = `AND r.district_id = $${params.length}`;
    incidentDistrictFilter = `AND i.road_segment_id IN (SELECT id FROM road_segments WHERE district_id = $${params.length})`;
  }

  const sql = `
    SELECT
      -- Critical roads: total_risk >= 0.70
      COUNT(*) FILTER (WHERE COALESCE(lr.total_risk, 0) >= 0.70) AS critical_roads,
      -- High risk roads: total_risk >= 0.50
      COUNT(*) FILTER (WHERE COALESCE(lr.total_risk, 0) >= 0.50) AS high_risk_roads,
      -- Moderate roads: total_risk >= 0.30
      COUNT(*) FILTER (WHERE COALESCE(lr.total_risk, 0) >= 0.30 AND COALESCE(lr.total_risk, 0) < 0.50) AS moderate_roads,
      -- Normal roads
      COUNT(*) FILTER (WHERE COALESCE(lr.total_risk, 0) < 0.30) AS normal_roads,
      -- Total roads
      COUNT(*) AS total_roads,
      -- Average risk
      ROUND(AVG(COALESCE(lr.total_risk, 0))::numeric, 3) AS avg_risk,
      -- Max risk
      ROUND(MAX(COALESCE(lr.total_risk, 0))::numeric, 3) AS max_risk
    FROM road_segments r
    LEFT JOIN v_latest_risk lr ON lr.road_segment_id = r.id
    WHERE 1=1 ${districtFilter}
  `;

  const roadResult = await query(sql, params);

  // Incident counts — separate query for clarity
  const incidentSql = `
    SELECT
      COUNT(*) FILTER (WHERE verified = TRUE AND resolved_at IS NULL) AS active_incidents,
      COUNT(*) FILTER (WHERE verified = FALSE) AS unverified_incidents,
      COUNT(*) FILTER (WHERE verified = TRUE AND resolved_at IS NOT NULL) AS resolved_incidents,
      COUNT(*) AS total_incidents
    FROM incidents i
    WHERE 1=1 ${incidentDistrictFilter}
  `;
  const incidentResult = await query(incidentSql, params);

  // Vehicles active — count vehicles not 'offline'
  const vehicleSql = `
    SELECT COUNT(*) AS active_vehicles
    FROM vehicles
    WHERE status != 'offline'
  `;
  const vehicleResult = await query(vehicleSql);

  // Shipments today
  const shipmentSql = `
    SELECT COUNT(*) AS shipments_today
    FROM shipments
    WHERE created_at >= CURRENT_DATE
  `;
  const shipmentResult = await query(shipmentSql);

  const roadStats = roadResult.rows[0] || {};
  const incidentStats = incidentResult.rows[0] || {};
  const vehicleStats = vehicleResult.rows[0] || {};
  const shipmentStats = shipmentResult.rows[0] || {};

  return {
    criticalRoads: parseInt(roadStats.critical_roads || "0", 10),
    highRiskRoads: parseInt(roadStats.high_risk_roads || "0", 10),
    moderateRoads: parseInt(roadStats.moderate_roads || "0", 10),
    normalRoads: parseInt(roadStats.normal_roads || "0", 10),
    totalRoads: parseInt(roadStats.total_roads || "0", 10),
    avgRisk: parseFloat(roadStats.avg_risk || "0"),
    maxRisk: parseFloat(roadStats.max_risk || "0"),
    activeIncidents: parseInt(incidentStats.active_incidents || "0", 10),
    unverifiedIncidents: parseInt(incidentStats.unverified_incidents || "0", 10),
    resolvedIncidents: parseInt(incidentStats.resolved_incidents || "0", 10),
    totalIncidents: parseInt(incidentStats.total_incidents || "0", 10),
    activeVehicles: parseInt(vehicleStats.active_vehicles || "0", 10),
    shipmentsToday: parseInt(shipmentStats.shipments_today || "0", 10)
  };
}

/**
 * Risk aggregated by district.
 */
export async function getRiskByDistrict() {
  const sql = `
    SELECT
      d.id AS district_id,
      d.name AS district_name,
      COUNT(r.id) AS road_count,
      ROUND(AVG(COALESCE(lr.total_risk, 0))::numeric, 3) AS avg_risk,
      ROUND(MAX(COALESCE(lr.total_risk, 0))::numeric, 3) AS max_risk,
      COUNT(*) FILTER (WHERE COALESCE(lr.total_risk, 0) >= 0.70) AS critical_roads,
      COUNT(*) FILTER (WHERE COALESCE(lr.total_risk, 0) >= 0.50) AS high_risk_roads,
      COALESCE(ic.incident_count, 0) AS active_incidents
    FROM districts d
    LEFT JOIN road_segments r ON r.district_id = d.id
    LEFT JOIN v_latest_risk lr ON lr.road_segment_id = r.id
    LEFT JOIN (
      SELECT rs.district_id, COUNT(*) AS incident_count
      FROM incidents i
      JOIN road_segments rs ON rs.id = i.road_segment_id
      WHERE i.verified = TRUE AND i.resolved_at IS NULL
      GROUP BY rs.district_id
    ) ic ON ic.district_id = d.id
    GROUP BY d.id, d.name, ic.incident_count
    ORDER BY max_risk DESC, avg_risk DESC;
  `;
  const result = await query(sql);
  return result.rows;
}

export default {
  getRiskPrioritizedRoads,
  getRiskSummary,
  getRiskByDistrict
};
