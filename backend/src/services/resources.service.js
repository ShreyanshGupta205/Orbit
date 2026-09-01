import { query } from "../config/db.js";

/**
 * Find emergency resources near a location using PostGIS ST_DWithin and rank by safety & status.
 * Reuses existing facilities table — no new tables.
 */
export async function getNearbyResources({
  lat,
  lng,
  radiusMeters = 10000,
  type = null,
  status = null,
  limit = 20
} = {}) {
  const safeLimit = Math.min(Math.max(limit, 1), 100);
  let whereClause = "WHERE ST_DWithin(f.geometry::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3)";
  const params = [parseFloat(lng), parseFloat(lat), parseFloat(radiusMeters)];

  if (type) {
    params.push(type);
    whereClause += ` AND f.type = $${params.length}`;
  }

  if (status) {
    params.push(status);
    whereClause += ` AND f.operating_status = $${params.length}`;
  }

  const sql = `
    SELECT
      f.id,
      f.name,
      f.type,
      f.district_id,
      d.name                                 AS district_name,
      f.priority,
      f.population_served,
      f.operating_status,
      ST_AsGeoJSON(f.geometry)::json         AS geometry,
      ROUND(ST_Distance(
        f.geometry::geography,
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
      )::numeric, 1)                         AS distance_meters,
      -- Surrounding road risk score from v_latest_risk
      COALESCE(lr.total_risk, 0)             AS surrounding_road_risk,
      -- Capacity untracked in current DB schema (null per safety spec)
      NULL                                   AS capacity,
      -- Operational suitability rank
      CASE
        WHEN f.operating_status = 'operational' THEN 1
        WHEN f.operating_status = 'limited' THEN 2
        WHEN f.operating_status = 'disrupted' THEN 3
        ELSE 4
      END                                    AS status_rank
    FROM facilities f
    LEFT JOIN districts d ON d.id = f.district_id
    LEFT JOIN LATERAL (
      SELECT r.id AS road_segment_id, ST_Distance(f.geometry, r.geometry) AS dist
      FROM road_segments r
      ORDER BY f.geometry <-> r.geometry
      LIMIT 1
    ) nr ON TRUE
    LEFT JOIN v_latest_risk lr ON lr.road_segment_id = nr.road_segment_id
    ${whereClause}
    ORDER BY status_rank ASC, surrounding_road_risk ASC, distance_meters ASC
    LIMIT $${params.length + 1};
  `;

  params.push(safeLimit);
  const result = await query(sql, params);
  return result.rows;
}

/**
 * Find top N nearest emergency resources of specific type(s).
 */
export async function getNearestResources({ lat, lng, type = null, limit = 5 } = {}) {
  const safeLimit = Math.min(Math.max(limit, 1), 50);
  let whereClause = "WHERE f.operating_status IN ('operational', 'limited')";
  const params = [parseFloat(lng), parseFloat(lat)];

  if (type) {
    params.push(type);
    whereClause += ` AND f.type = $${params.length}`;
  }

  const sql = `
    SELECT
      f.id,
      f.name,
      f.type,
      f.district_id,
      d.name                                 AS district_name,
      f.priority,
      f.population_served,
      f.operating_status,
      ST_AsGeoJSON(f.geometry)::json         AS geometry,
      ROUND(ST_Distance(
        f.geometry::geography,
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
      )::numeric, 1)                         AS distance_meters,
      COALESCE(lr.total_risk, 0)             AS surrounding_road_risk,
      NULL                                   AS capacity
    FROM facilities f
    LEFT JOIN districts d ON d.id = f.district_id
    LEFT JOIN LATERAL (
      SELECT r.id AS road_segment_id
      FROM road_segments r
      ORDER BY f.geometry <-> r.geometry
      LIMIT 1
    ) nr ON TRUE
    LEFT JOIN v_latest_risk lr ON lr.road_segment_id = nr.road_segment_id
    ${whereClause}
    ORDER BY f.geometry <-> ST_SetSRID(ST_MakePoint($1, $2), 4326)
    LIMIT $${params.length + 1};
  `;

  params.push(safeLimit);
  const result = await query(sql, params);
  return result.rows;
}

export default {
  getNearbyResources,
  getNearestResources
};
