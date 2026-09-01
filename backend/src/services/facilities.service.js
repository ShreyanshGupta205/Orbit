import { query } from "../config/db.js";

/**
 * Fetch all facilities with PostGIS Point GeoJSON
 */
export async function getAllFacilities(filters = {}) {
  let whereClause = "WHERE 1=1";
  const params = [];

  if (filters.districtId) {
    params.push(filters.districtId);
    whereClause += ` AND f.district_id = $${params.length}`;
  }

  if (filters.type) {
    params.push(filters.type);
    whereClause += ` AND f.type = $${params.length}`;
  }

  if (filters.status) {
    params.push(filters.status);
    whereClause += ` AND f.operating_status = $${params.length}`;
  }

  const sql = `
    SELECT 
      f.id,
      f.name,
      f.type,
      f.district_id,
      d.name AS district_name,
      f.priority,
      f.population_served,
      f.operating_status,
      ST_AsGeoJSON(f.geometry)::json AS geometry
    FROM facilities f
    LEFT JOIN districts d ON d.id = f.district_id
    ${whereClause}
    ORDER BY f.id ASC;
  `;

  const result = await query(sql, params);
  return result.rows;
}

/**
 * Fetch facilities inside a district polygon using database function nera_facilities_in_district
 */
export async function getFacilitiesInDistrict(districtId) {
  const sql = `
    SELECT 
      f.id,
      f.type,
      f.name,
      f.district_id,
      f.priority,
      f.population_served,
      f.operating_status,
      ST_AsGeoJSON(f.geometry)::json AS geometry
    FROM nera_facilities_in_district($1) f;
  `;
  const result = await query(sql, [districtId]);
  return result.rows;
}

/**
 * Fetch roads within radius of a facility using database function nera_roads_near_facility
 */
export async function getRoadsNearFacility(facilityId, radiusMeters = 500) {
  const sql = `
    SELECT 
      road_segment_id,
      road_name,
      distance_m,
      type,
      length_km,
      ST_AsGeoJSON(geometry)::json AS geometry
    FROM nera_roads_near_facility($1, $2);
  `;
  const result = await query(sql, [facilityId, radiusMeters]);
  return result.rows;
}

export default {
  getAllFacilities,
  getFacilitiesInDistrict,
  getRoadsNearFacility
};
