import { Router } from "express";
import { getDependencies, simulateRoadFailure, getExpectedImpact } from "../services/resilience.service.js";

const router = Router();

// GET /api/resilience/dependencies - List facility dependency graph links
router.get("/dependencies", async (req, res, next) => {
  try {
    const dependencies = await getDependencies();
    res.json({
      success: true,
      count: dependencies.length,
      data: dependencies
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/resilience/simulate-isolation - What-if simulation for road failure (DB function nera_isolated_facilities_if_road_fails)
router.get("/simulate-isolation", async (req, res, next) => {
  try {
    const failedRoadId = parseInt(req.query.roadId, 10);
    const hubFacilityId = req.query.hubId ? parseInt(req.query.hubId, 10) : null;

    if (isNaN(failedRoadId)) {
      return res.status(400).json({
        success: false,
        message: "Failed road segment ID (roadId) is required."
      });
    }

    const isolatedFacilities = await simulateRoadFailure(failedRoadId, hubFacilityId);
    const isolatedCount = isolatedFacilities.filter(f => f.is_isolated).length;

    res.json({
      success: true,
      failedRoadId,
      hubFacilityId,
      isolatedCount,
      facilities: isolatedFacilities
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/resilience/expected-impact - Calculate expected disruption impact index (DB function nera_expected_impact)
router.get("/expected-impact", async (req, res, next) => {
  try {
    const roadId = parseInt(req.query.roadId, 10);
    const hours = parseFloat(req.query.hours) || 6;

    if (isNaN(roadId)) {
      return res.status(400).json({
        success: false,
        message: "Road segment ID (roadId) is required."
      });
    }

    const impact = await getExpectedImpact(roadId, hours);
    if (!impact) {
      return res.status(404).json({ success: false, message: "Road impact calculation returned no data." });
    }

    res.json({
      success: true,
      data: impact
    });
  } catch (error) {
    next(error);
  }
});

export default router;
