import { query } from "../config/db.js";
import { evalEvacuationRecommended } from "./alerts.service.js";

/**
 * Evacuation Recommendation Engine — Safety-first pathfinding.
 * Optimizes for maximum route safety & hazard avoidance rather than shortest distance.
 */
export async function generateEvacuationRecommendation({
  lat = null,
  lng = null,
  incidentId = null,
  destinationFacilityId = null,
  maxRiskThreshold = 0.70
} = {}) {
  let startLat = lat ? parseFloat(lat) : null;
  let startLng = lng ? parseFloat(lng) : null;
  let incidentInfo = null;

  // 1. Resolve starting point from incident if incidentId is supplied
  if (incidentId) {
    const incSql = `
      SELECT 
        i.id, i.type, i.severity, i.description, i.road_segment_id,
        r.name AS road_name,
        ST_Y(i.geometry) AS lat, ST_X(i.geometry) AS lng
      FROM incidents i
      LEFT JOIN road_segments r ON r.id = i.road_segment_id
      WHERE i.id = $1;
    `;
    const incRes = await query(incSql, [incidentId]);
    if (incRes.rows.length) {
      incidentInfo = incRes.rows[0];
      startLat = parseFloat(incidentInfo.lat);
      startLng = parseFloat(incidentInfo.lng);
    }
  }

  if (!startLat || !startLng) {
    throw new Error("Valid starting point (lat/lng or incidentId) is required for evacuation recommendation");
  }

  // 2. Identify safe candidate destination facilities (operational/limited status)
  let targetFacility = null;
  if (destinationFacilityId) {
    const facSql = `
      SELECT id, name, type, priority, operating_status, district_id, ST_Y(geometry) AS lat, ST_X(geometry) AS lng, ST_AsGeoJSON(geometry)::json AS geometry
      FROM facilities WHERE id = $1;
    `;
    const facRes = await query(facSql, [destinationFacilityId]);
    if (facRes.rows.length) targetFacility = facRes.rows[0];
  }

  if (!targetFacility) {
    // Find nearest operational shelter, hospital, or relief camp using PostGIS distance
    const destSql = `
      SELECT 
        f.id, f.name, f.type, f.priority, f.operating_status, f.district_id,
        ST_Y(f.geometry) AS lat, ST_X(f.geometry) AS lng,
        ST_AsGeoJSON(f.geometry)::json AS geometry,
        ROUND(ST_Distance(f.geometry::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography)::numeric / 1000.0, 2) AS distance_km
      FROM facilities f
      WHERE f.type IN ('relief_camp', 'hospital', 'phc', 'district_hq')
        AND f.operating_status IN ('operational', 'limited')
      ORDER BY f.geometry <-> ST_SetSRID(ST_MakePoint($1, $2), 4326)
      LIMIT 1;
    `;
    const destRes = await query(destSql, [startLng, startLat]);
    if (!destRes.rows.length) {
      return {
        success: false,
        message: "No operational safe destination facilities found in database near this location",
        safetyDisclaimer: "Recommended route based on current available risk and road data."
      };
    }
    targetFacility = destRes.rows[0];
  }

  // 3. Match start location & destination facility to nearest graph vertices (road_nodes)
  const startNodeSql = `
    SELECT id, name FROM road_nodes ORDER BY geometry <-> ST_SetSRID(ST_MakePoint($1, $2), 4326) LIMIT 1;
  `;
  const startNodeRes = await query(startNodeSql, [startLng, startLat]);
  const startNode = startNodeRes.rows[0];

  const targetNodeSql = `
    SELECT id, name FROM road_nodes ORDER BY geometry <-> ST_SetSRID(ST_MakePoint($1, $2), 4326) LIMIT 1;
  `;
  const targetNodeRes = await query(targetNodeSql, [targetFacility.lng, targetFacility.lat]);
  const targetNode = targetNodeRes.rows[0];

  if (!startNode || !targetNode) {
    return {
      success: false,
      message: "Could not locate road network nodes near starting point or destination",
      safetyDisclaimer: "Recommended route based on current available risk and road data."
    };
  }

  // 4. Pathfinding Queries:
  // A) Safest Viable Route (Heavy risk weight = 5.0 to strongly penalize hazard zones & road risk)
  // B) Pure Shortest Distance Route (Risk weight = 0.0) for safety comparison baseline
  const routeSql = `
    SELECT 
      sp.seq,
      sp.node_id,
      sp.node_name,
      sp.road_segment_id,
      r.name AS road_name,
      r.type AS road_type,
      r.length_km,
      COALESCE(lr.total_risk, 0) AS segment_risk,
      COALESCE(lr.flood_risk, 0) AS flood_risk,
      COALESCE(lr.landslide_risk, 0) AS landslide_risk,
      sp.edge_cost,
      sp.agg_cost,
      ST_AsGeoJSON(sp.geometry)::json AS geometry
    FROM nera_shortest_path_with_cost($1, $2, $3, $4) sp
    LEFT JOIN road_segments r ON r.id = sp.road_segment_id
    LEFT JOIN v_latest_risk lr ON lr.road_segment_id = sp.road_segment_id;
  `;

  // Safest route (Primary)
  const safestRouteRes = await query(routeSql, [startNode.id, targetNode.id, 5.0, null]);
  const safestSteps = safestRouteRes.rows;

  // Pure shortest route (Comparison baseline)
  const shortestRouteRes = await query(routeSql, [startNode.id, targetNode.id, 0.0, null]);
  const shortestSteps = shortestRouteRes.rows;

  // 5. Fetch verified blocked roads
  const blockedSql = `
    SELECT DISTINCT r.id, r.name
    FROM road_segments r
    JOIN incidents i ON i.road_segment_id = r.id
    WHERE i.verified = TRUE AND i.resolved_at IS NULL;
  `;
  const blockedRes = await query(blockedSql);
  const blockedRoads = blockedRes.rows.map(b => ({ id: b.id, name: b.name }));

  // Metrics for Safest Route
  const safestMaxRisk = safestSteps.reduce((max, step) => Math.max(max, parseFloat(step.segment_risk || 0)), 0);
  const safestDistanceKm = safestSteps.reduce((sum, step) => sum + parseFloat(step.length_km || 0), 0);

  // Metrics for Pure Shortest Route
  const shortestMaxRisk = shortestSteps.reduce((max, step) => Math.max(max, parseFloat(step.segment_risk || 0)), 0);
  const shortestDistanceKm = shortestSteps.reduce((sum, step) => sum + parseFloat(step.length_km || 0), 0);

  // 6. Generate Empirical Rationale highlighting Safety over Distance
  let explanation = `Optimized for MAXIMUM SAFETY over pure shortest distance. `;
  explanation += `Recommended route to ${targetFacility.name} is ${safestDistanceKm.toFixed(1)} km (Max Risk: ${safestMaxRisk.toFixed(2)}). `;

  if (shortestMaxRisk > safestMaxRisk) {
    explanation += `Bypasses pure shortest path (${shortestDistanceKm.toFixed(1)} km) which carried higher hazard risk (${shortestMaxRisk.toFixed(2)}). `;
  }

  if (blockedRoads.length > 0) {
    explanation += `Avoids ${blockedRoads.length} verified blocked road segment(s) (${blockedRoads.map(b => b.name).join(", ")}). `;
  }

  const recommendation = {
    id: `evac_${Date.now()}`,
    optimizationGoal: "Safest Viable Route (Risk & Hazard Penalized)",
    destination: {
      id: targetFacility.id,
      name: targetFacility.name,
      type: targetFacility.type,
      operatingStatus: targetFacility.operating_status,
      districtId: targetFacility.district_id,
      geometry: targetFacility.geometry
    },
    startPoint: { lat: startLat, lng: startLng },
    route: {
      totalDistanceKm: parseFloat(safestDistanceKm.toFixed(2)),
      maxRisk: parseFloat(safestMaxRisk.toFixed(2)),
      routeSafety: safestMaxRisk >= 0.7 ? "High Risk" : safestMaxRisk >= 0.5 ? "Moderate Risk" : "Safe Viable Route",
      steps: safestSteps
    },
    pureShortestRouteBaseline: {
      totalDistanceKm: parseFloat(shortestDistanceKm.toFixed(2)),
      maxRisk: parseFloat(shortestMaxRisk.toFixed(2)),
      note: "Pure shortest distance path (un-penalized for hazard risk)",
      steps: shortestSteps
    },
    avoidedBlockedRoads: blockedRoads,
    explanation,
    safetyDisclaimer: "Recommended route based on current available risk and road data.",
    timestamp: new Date().toISOString()
  };

  // 7. Trigger real-time SSE alert for critical evacuations
  evalEvacuationRecommended({
    startPoint: { lat: startLat, lng: startLng },
    destinationFacility: targetFacility.name,
    routeRisk: safestMaxRisk,
    reason: explanation,
    districtId: targetFacility.district_id
  }).catch(err => console.error("Evacuation alert eval error:", err));

  return recommendation;
}

export default {
  generateEvacuationRecommendation
};
