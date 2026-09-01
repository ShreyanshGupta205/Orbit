import { query } from "../config/db.js";

/**
 * Fetch all facility dependencies (resilience graph edges)
 */
export async function getDependencies() {
  const sql = `
    SELECT 
      d.id,
      d.source_facility_id,
      fs.name AS source_facility_name,
      fs.type AS source_facility_type,
      d.target_facility_id,
      ft.name AS target_facility_name,
      ft.type AS target_facility_type,
      d.via_road_segment_id,
      rs.name AS via_road_name,
      d.type,
      d.criticality_weight,
      d.redundancy_level
    FROM dependencies d
    JOIN facilities fs ON fs.id = d.source_facility_id
    JOIN facilities ft ON ft.id = d.target_facility_id
    LEFT JOIN road_segments rs ON rs.id = d.via_road_segment_id
    ORDER BY d.criticality_weight DESC;
  `;
  const result = await query(sql);
  return result.rows;
}

/**
 * Run what-if road failure isolation simulation using database function nera_isolated_facilities_if_road_fails
 */
export async function simulateRoadFailure(failedRoadId, hubFacilityId = null) {
  const sql = `
    SELECT 
      facility_id,
      facility_name,
      facility_type,
      district_id,
      nearest_node_id,
      reachable_before,
      reachable_after,
      is_isolated,
      dependency_count
    FROM nera_isolated_facilities_if_road_fails($1, $2);
  `;
  const result = await query(sql, [failedRoadId, hubFacilityId]);
  return result.rows;
}

/**
 * Calculate expected disruption impact index using database function nera_expected_impact
 */
export async function getExpectedImpact(roadSegmentId, disruptionHours = 6) {
  const sql = `
    SELECT 
      road_segment_id,
      failure_probability,
      isolated_facilities,
      affected_criticality,
      expected_impact
    FROM nera_expected_impact($1, $2);
  `;
  const result = await query(sql, [roadSegmentId, disruptionHours]);
  return result.rows[0] || null;
}

export default {
  getDependencies,
  simulateRoadFailure,
  getExpectedImpact
};
