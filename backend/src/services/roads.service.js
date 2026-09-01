import { query } from "../config/db.js";

/**
 * Fetch all road segments with live risk scores and GeoJSON geometry
 */
export async function getAllRoads(filters = {}) {
  let whereClause = "WHERE 1=1";
  const params = [];

  if (filters.districtId) {
    params.push(filters.districtId);
    whereClause += ` AND r.district_id = $${params.length}`;
  }

  if (filters.type) {
    params.push(filters.type);
    whereClause += ` AND r.type = $${params.length}`;
  }

  const sql = `
    SELECT 
      r.id,
      r.name,
      r.district_id,
      d.name AS district_name,
      r.type,
      r.length_km,
      r.baseline_speed_kmh,
      r.surface_quality,
      r.source_node_id,
      r.target_node_id,
      r.last_updated,
      ST_AsGeoJSON(r.geometry)::json AS geometry,
      COALESCE(lr.total_risk, 0) AS total_risk,
      COALESCE(lr.flood_risk, 0) AS flood_risk,
      COALESCE(lr.landslide_risk, 0) AS landslide_risk,
      COALESCE(lr.road_condition_score, 0) AS road_condition_score,
      lr.timestamp AS risk_updated_at
    FROM road_segments r
    LEFT JOIN districts d ON d.id = r.district_id
    LEFT JOIN v_latest_risk lr ON lr.road_segment_id = r.id
    ${whereClause}
    ORDER BY r.id ASC;
  `;

  const result = await query(sql, params);
  return result.rows;
}

/**
 * Fetch high risk road segments using database function nera_high_risk_road_segments
 */
export async function getHighRiskRoads(floodThreshold = 0.6, landslideThreshold = 0.6) {
  const sql = `
    SELECT 
      road_segment_id,
      road_name,
      flood_risk,
      landslide_risk,
      total_risk,
      in_flood_zone,
      in_landslide_zone,
      ST_AsGeoJSON(geometry)::json AS geometry
    FROM nera_high_risk_road_segments($1, $2);
  `;
  const result = await query(sql, [floodThreshold, landslideThreshold]);
  return result.rows;
}

/**
 * Fetch road segment by ID
 */
export async function getRoadById(id) {
  const sql = `
    SELECT 
      r.id,
      r.name,
      r.district_id,
      d.name AS district_name,
      r.type,
      r.length_km,
      r.baseline_speed_kmh,
      r.surface_quality,
      r.source_node_id,
      r.target_node_id,
      r.last_updated,
      ST_AsGeoJSON(r.geometry)::json AS geometry,
      COALESCE(lr.total_risk, 0) AS total_risk,
      COALESCE(lr.flood_risk, 0) AS flood_risk,
      COALESCE(lr.landslide_risk, 0) AS landslide_risk,
      COALESCE(lr.road_condition_score, 0) AS road_condition_score
    FROM road_segments r
    LEFT JOIN districts d ON d.id = r.district_id
    LEFT JOIN v_latest_risk lr ON lr.road_segment_id = r.id
    WHERE r.id = $1;
  `;
  const result = await query(sql, [id]);
  return result.rows[0] || null;
}

export default {
  getAllRoads,
  getHighRiskRoads,
  getRoadById
};
