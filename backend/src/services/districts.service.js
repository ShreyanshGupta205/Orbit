import { query } from "../config/db.js";

/**
 * Fetch all districts with GeoJSON boundary geometry
 */
export async function getAllDistricts() {
  const sql = `
    SELECT 
      id,
      name,
      state,
      hq_name,
      ST_AsGeoJSON(boundary)::json AS boundary,
      created_at
    FROM districts
    ORDER BY name ASC;
  `;
  const result = await query(sql);
  return result.rows;
}

/**
 * Fetch single district by ID
 */
export async function getDistrictById(id) {
  const sql = `
    SELECT 
      id,
      name,
      state,
      hq_name,
      ST_AsGeoJSON(boundary)::json AS boundary,
      created_at
    FROM districts
    WHERE id = $1;
  `;
  const result = await query(sql, [id]);
  return result.rows[0] || null;
}

export default {
  getAllDistricts,
  getDistrictById
};
