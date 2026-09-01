import { Router } from "express";
import { getAllHazardZones } from "../services/hazards.service.js";

const router = Router();

// GET /api/hazards - List flood and landslide zones
router.get("/", async (req, res, next) => {
  try {
    const { type } = req.query;
    const hazards = await getAllHazardZones(type);
    res.json({
      success: true,
      count: hazards.length,
      data: hazards
    });
  } catch (error) {
    next(error);
  }
});

export default router;
