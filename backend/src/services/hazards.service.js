import { query } from "../config/db.js";

/**
 * Fetch all flood and landslide hazard zones
 */
export async function getAllHazardZones(type = null) {
  let sql = `
    SELECT 
      id,
      name,
      hazard_type,
      severity,
      ST_AsGeoJSON(geometry)::json AS geometry,
      source
    FROM hazard_zones
  `;
  const params = [];
  if (type) {
    sql += " WHERE hazard_type = $1";
    params.push(type);
  }
  sql += " ORDER BY id ASC;";

  const result = await query(sql, params);
  return result.rows;
}

export default {
  getAllHazardZones
};
