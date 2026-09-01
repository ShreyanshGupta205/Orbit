import { Router } from "express";
import { generateEvacuationRecommendation } from "../services/evacuation.service.js";
import { optionalAuth, requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * POST /api/evacuation/recommend — Generate risk-aware evacuation route recommendation
 */
router.post("/recommend", optionalAuth, async (req, res, next) => {
  try {
    const { lat, lng, incidentId, destinationFacilityId, maxRiskThreshold } = req.body;

    if (!lat && !lng && !incidentId) {
      return res.status(400).json({
        success: false,
        message: "Either lat/lng coordinates or incidentId is required to calculate evacuation route"
      });
    }

    const recommendation = await generateEvacuationRecommendation({
      lat,
      lng,
      incidentId,
      destinationFacilityId,
      maxRiskThreshold
    });

    res.json({ success: true, data: recommendation });
  } catch (err) {
    next(err);
  }
});

export default router;
