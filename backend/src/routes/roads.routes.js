import { Router } from "express";
import { getAllRoads, getHighRiskRoads, getRoadById } from "../services/roads.service.js";

const router = Router();

// GET /api/roads - List road segments with live risk scores
router.get("/", async (req, res, next) => {
  try {
    const { districtId, type } = req.query;
    const roads = await getAllRoads({ districtId, type });
    res.json({
      success: true,
      count: roads.length,
      data: roads
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/roads/high-risk - High risk road segments (DB function)
router.get("/high-risk", async (req, res, next) => {
  try {
    const flood = parseFloat(req.query.flood) || 0.6;
    const landslide = parseFloat(req.query.landslide) || 0.6;
    const highRiskRoads = await getHighRiskRoads(flood, landslide);
    res.json({
      success: true,
      count: highRiskRoads.length,
      data: highRiskRoads
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/roads/:id - Get road by ID
router.get("/:id", async (req, res, next) => {
  try {
    const road = await getRoadById(req.params.id);
    if (!road) {
      return res.status(404).json({ success: false, message: "Road segment not found" });
    }
    res.json({ success: true, data: road });
  } catch (error) {
    next(error);
  }
});

export default router;
