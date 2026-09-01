import { query } from "../config/db.js";

/**
 * Reusable PostGIS spatial search across facilities, incidents, roads, and hazard zones.
 */
export async function searchNearby({
  lat,
  lng,
  radiusMeters = 5000,
  categories = ["facilities", "incidents", "roads", "hazards"],
  limit = 30
} = {}) {
  const safeLimit = Math.min(Math.max(limit, 1), 100);
  const parsedLat = parseFloat(lat);
  const parsedLng = parseFloat(lng);
  const parsedRadius = parseFloat(radiusMeters);

  const results = {};

  if (categories.includes("facilities")) {
    const sql = `
      SELECT 
        f.id, f.name, f.type, f.operating_status, f.priority,
        ST_AsGeoJSON(f.geometry)::json AS geometry,
        ROUND(ST_Distance(f.geometry::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography)::numeric, 1) AS distance_meters
      FROM facilities f
      WHERE ST_DWithin(f.geometry::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3)
      ORDER BY distance_meters ASC
      LIMIT $4;
    `;
    const res = await query(sql, [parsedLng, parsedLat, parsedRadius, safeLimit]);
    results.facilities = res.rows;
  }

  if (categories.includes("incidents")) {
    const sql = `
      SELECT 
        i.id, i.type, i.severity, i.description, i.verified, i.reported_at,
        ST_AsGeoJSON(i.geometry)::json AS geometry,
        ROUND(ST_Distance(i.geometry::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography)::numeric, 1) AS distance_meters
      FROM incidents i
      WHERE i.resolved_at IS NULL
        AND ST_DWithin(i.geometry::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3)
      ORDER BY distance_meters ASC
      LIMIT $4;
    `;
    const res = await query(sql, [parsedLng, parsedLat, parsedRadius, safeLimit]);
    results.incidents = res.rows;
  }

  if (categories.includes("roads")) {
    const sql = `
      SELECT 
        r.id, r.name, r.type, r.length_km, r.surface_quality,
        COALESCE(lr.total_risk, 0) AS total_risk,
        ST_AsGeoJSON(r.geometry)::json AS geometry,
        ROUND(ST_Distance(r.geometry::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography)::numeric, 1) AS distance_meters
      FROM road_segments r
      LEFT JOIN v_latest_risk lr ON lr.road_segment_id = r.id
      WHERE ST_DWithin(r.geometry::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3)
      ORDER BY distance_meters ASC
      LIMIT $4;
    `;
    const res = await query(sql, [parsedLng, parsedLat, parsedRadius, safeLimit]);
    results.roads = res.rows;
  }

  if (categories.includes("hazards")) {
    const sql = `
      SELECT 
        h.id, h.hazard_type, h.severity,
        ST_AsGeoJSON(h.geometry)::json AS geometry,
        ROUND(ST_Distance(h.geometry::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography)::numeric, 1) AS distance_meters
      FROM hazard_zones h
      WHERE ST_DWithin(h.geometry::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3)
      ORDER BY distance_meters ASC
      LIMIT $4;
    `;
    const res = await query(sql, [parsedLng, parsedLat, parsedRadius, safeLimit]);
    results.hazards = res.rows;
  }

  return results;
}

/**
 * Spatial Bounding Box (Viewport) Search.
 * Returns only entities intersecting map envelope to save bandwidth.
 */
export async function searchViewport({
  minLat,
  minLng,
  maxLat,
  maxLng,
  categories = ["facilities", "incidents", "roads"],
  limit = 50
} = {}) {
  const safeLimit = Math.min(Math.max(limit, 1), 200);
  const bbox = [parseFloat(minLng), parseFloat(minLat), parseFloat(maxLng), parseFloat(maxLat)];

  const results = {};

  if (categories.includes("facilities")) {
    const sql = `
      SELECT f.id, f.name, f.type, f.operating_status, ST_AsGeoJSON(f.geometry)::json AS geometry
      FROM facilities f
      WHERE ST_Intersects(f.geometry, ST_MakeEnvelope($1, $2, $3, $4, 4326))
      LIMIT $5;
    `;
    const res = await query(sql, [...bbox, safeLimit]);
    results.facilities = res.rows;
  }

  if (categories.includes("incidents")) {
    const sql = `
      SELECT i.id, i.type, i.severity, i.verified, ST_AsGeoJSON(i.geometry)::json AS geometry
      FROM incidents i
      WHERE i.resolved_at IS NULL
        AND ST_Intersects(i.geometry, ST_MakeEnvelope($1, $2, $3, $4, 4326))
      LIMIT $5;
    `;
    const res = await query(sql, [...bbox, safeLimit]);
    results.incidents = res.rows;
  }

  if (categories.includes("roads")) {
    const sql = `
      SELECT r.id, r.name, r.type, COALESCE(lr.total_risk, 0) AS total_risk, ST_AsGeoJSON(r.geometry)::json AS geometry
      FROM road_segments r
      LEFT JOIN v_latest_risk lr ON lr.road_segment_id = r.id
      WHERE ST_Intersects(r.geometry, ST_MakeEnvelope($1, $2, $3, $4, 4326))
      LIMIT $5;
    `;
    const res = await query(sql, [...bbox, safeLimit]);
    results.roads = res.rows;
  }

  return results;
}

export default {
  searchNearby,
  searchViewport
};
