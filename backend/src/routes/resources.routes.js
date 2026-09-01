import { Router } from "express";
import { getNearbyResources, getNearestResources } from "../services/resources.service.js";
import { optionalAuth, requireAuth, ROLES } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * GET /api/resources/nearby — Find emergency facilities near a point ranked by status, risk, and distance.
 */
router.get("/nearby", optionalAuth, async (req, res, next) => {
  try {
    const { lat, lng, radius, type, status, limit = 20 } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: "lat and lng parameters are required" });
    }

    const resources = await getNearbyResources({
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      radiusMeters: radius ? parseFloat(radius) : 10000,
      type: type || null,
      status: status || null,
      limit: parseInt(limit, 10)
    });

    const data = resources.map(r => ({
      id: r.id,
      name: r.name,
      type: r.type,
      districtId: r.district_id,
      districtName: r.district_name,
      priority: r.priority,
      populationServed: r.population_served,
      operatingStatus: r.operating_status,
      distanceMeters: parseFloat(r.distance_meters),
      distanceKm: parseFloat((parseFloat(r.distance_meters) / 1000).toFixed(2)),
      surroundingRoadRisk: parseFloat(r.surrounding_road_risk),
      capacity: r.capacity,
      capacityNote: "Capacity untracked in current database schema",
      geometry: r.geometry
    }));

    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/resources/nearest — Top N nearest operational emergency resources.
 */
router.get("/nearest", optionalAuth, async (req, res, next) => {
  try {
    const { lat, lng, type, limit = 5 } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: "lat and lng parameters are required" });
    }

    const resources = await getNearestResources({
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      type: type || null,
      limit: parseInt(limit, 10)
    });

    const data = resources.map(r => ({
      id: r.id,
      name: r.name,
      type: r.type,
      districtId: r.district_id,
      districtName: r.district_name,
      priority: r.priority,
      operatingStatus: r.operating_status,
      distanceKm: parseFloat((parseFloat(r.distance_meters) / 1000).toFixed(2)),
      surroundingRoadRisk: parseFloat(r.surrounding_road_risk),
      capacityNote: "Capacity untracked in current database schema",
      geometry: r.geometry
    }));

    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
});

export default router;
