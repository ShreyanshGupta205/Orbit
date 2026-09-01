import { Router } from "express";
import { getAllFacilities, getRoadsNearFacility } from "../services/facilities.service.js";

const router = Router();

// GET /api/facilities - List facilities with optional filters
router.get("/", async (req, res, next) => {
  try {
    const { districtId, type, status } = req.query;
    const facilities = await getAllFacilities({ districtId, type, status });
    res.json({
      success: true,
      count: facilities.length,
      data: facilities
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/facilities/:id/nearby-roads - Nearby road segments within radius
router.get("/:id/nearby-roads", async (req, res, next) => {
  try {
    const radius = parseFloat(req.query.radius) || 500;
    const roads = await getRoadsNearFacility(req.params.id, radius);
    res.json({
      success: true,
      count: roads.length,
      data: roads
    });
  } catch (error) {
    next(error);
  }
});

export default router;
