import { Router } from "express";
import { searchNearby, searchViewport } from "../services/geospatial.service.js";
import { optionalAuth } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * GET /api/geospatial/nearby — Multi-category spatial radius search.
 */
router.get("/nearby", optionalAuth, async (req, res, next) => {
  try {
    const { lat, lng, radius = 5000, categories, limit = 30 } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: "lat and lng parameters are required" });
    }

    const catArray = categories
      ? (Array.isArray(categories) ? categories : String(categories).split(","))
      : ["facilities", "incidents", "roads", "hazards"];

    const results = await searchNearby({
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      radiusMeters: parseFloat(radius),
      categories: catArray,
      limit: parseInt(limit, 10)
    });

    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/geospatial/viewport — Spatial bounding box search for map viewports.
 */
router.get("/viewport", optionalAuth, async (req, res, next) => {
  try {
    const { minLat, minLng, maxLat, maxLng, categories, limit = 50 } = req.query;
    if (!minLat || !minLng || !maxLat || !maxLng) {
      return res.status(400).json({ success: false, message: "minLat, minLng, maxLat, maxLng bounding box parameters are required" });
    }

    const catArray = categories
      ? (Array.isArray(categories) ? categories : String(categories).split(","))
      : ["facilities", "incidents", "roads"];

    const results = await searchViewport({
      minLat: parseFloat(minLat),
      minLng: parseFloat(minLng),
      maxLat: parseFloat(maxLat),
      maxLng: parseFloat(maxLng),
      categories: catArray,
      limit: parseInt(limit, 10)
    });

    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
});

export default router;
