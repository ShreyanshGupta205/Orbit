import { Router } from "express";
import { getAllDistricts, getDistrictById } from "../services/districts.service.js";
import { getFacilitiesInDistrict } from "../services/facilities.service.js";

const router = Router();

// GET /api/districts - List all districts with GeoJSON boundaries
router.get("/", async (req, res, next) => {
  try {
    const districts = await getAllDistricts();
    res.json({
      success: true,
      count: districts.length,
      data: districts
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/districts/:id - Get district by ID
router.get("/:id", async (req, res, next) => {
  try {
    const district = await getDistrictById(req.params.id);
    if (!district) {
      return res.status(404).json({ success: false, message: "District not found" });
    }
    res.json({ success: true, data: district });
  } catch (error) {
    next(error);
  }
});

// GET /api/districts/:id/facilities - List facilities in district
router.get("/:id/facilities", async (req, res, next) => {
  try {
    const facilities = await getFacilitiesInDistrict(req.params.id);
    res.json({ success: true, count: facilities.length, data: facilities });
  } catch (error) {
    next(error);
  }
});

export default router;
