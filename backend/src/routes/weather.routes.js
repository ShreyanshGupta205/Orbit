import { Router } from "express";
import { getWeatherData } from "../services/weather.service.js";
import { optionalAuth } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * GET /api/weather/current — Fetch location-aware weather data
 */
router.get("/current", optionalAuth, async (req, res, next) => {
  try {
    const { lat, lng } = req.query;
    // Default to Itanagar / Papum Pare region if coordinates omitted
    const parsedLat = lat ? parseFloat(lat) : 27.105;
    const parsedLng = lng ? parseFloat(lng) : 93.696;

    const weather = await getWeatherData(parsedLat, parsedLng);
    res.json({ success: true, data: weather });
  } catch (err) {
    next(err);
  }
});

export default router;
