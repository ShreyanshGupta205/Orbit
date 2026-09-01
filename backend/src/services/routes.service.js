import { query } from "../config/db.js";

/**
 * Fetch all defined routes with GeoJSON line strings
 */
export async function getAllRoutes() {
  const sql = `
    SELECT 
      id,
      name,
      road_segment_ids,
      ST_AsGeoJSON(geometry)::json AS geometry,
      created_at
    FROM routes
    ORDER BY id ASC;
  `;
  const result = await query(sql);
  return result.rows;
}

/**
 * Calculate dynamic risk-aware shortest path between road nodes using database function nera_shortest_path_with_cost
 */
export async function calculateShortestPath(sourceNodeId, targetNodeId, riskWeight = 1.0, excludeRoadId = null) {
  const sql = `
    SELECT 
      seq,
      node_id,
      node_name,
      road_segment_id,
      edge_cost,
      agg_cost,
      ST_AsGeoJSON(geometry)::json AS geometry
    FROM nera_shortest_path_with_cost($1, $2, $3, $4);
  `;
  const result = await query(sql, [sourceNodeId, targetNodeId, riskWeight, excludeRoadId]);
  return result.rows;
}

/**
 * Fetch all road nodes (graph vertices)
 */
export async function getRoadNodes() {
  const sql = `
    SELECT 
      id,
      name,
      district_id,
      ST_AsGeoJSON(geometry)::json AS geometry
    FROM road_nodes
    ORDER BY id ASC;
  `;
  const result = await query(sql);
  return result.rows;
}

export default {
  getAllRoutes,
  calculateShortestPath,
  getRoadNodes
};
