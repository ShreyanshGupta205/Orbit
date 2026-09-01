import { Router } from "express";
import {
  getRiskPrioritizedRoads,
  getRiskSummary,
  getRiskByDistrict
} from "../services/risk.service.js";
import { optionalAuth, requireAuth, requireRole, ROLES } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * GET /api/risk/summary — Dashboard summary stats
 * Public endpoint (optionalAuth) — returns aggregate counts, no sensitive data.
 */
router.get("/summary", optionalAuth, async (req, res, next) => {
  try {
    const { districtId } = req.query;
    const summary = await getRiskSummary(districtId || null);
    res.json({ success: true, data: summary });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/risk/priority — Prioritized roads sorted by risk
 * Supports: sort, filters (districtId, roadType, minRisk, search), pagination (page, limit)
 *
 * Role-based visibility:
 *   - Citizen: only roads with total_risk shown (no incident details)
 *   - Field Agent / Authority / Admin / Logistics: full data
 */
router.get("/priority", optionalAuth, async (req, res, next) => {
  try {
    const {
      districtId,
      roadType,
      minRisk,
      sort = "risk",
      page = 1,
      limit = 20,
      search
    } = req.query;

    const roads = await getRiskPrioritizedRoads({
      districtId: districtId || undefined,
      roadType: roadType || undefined,
      minRisk: minRisk !== undefined ? parseFloat(minRisk) : undefined,
      sort,
      page: parseInt(page, 10),
      limit: Math.min(parseInt(limit, 10) || 20, 100),
      search: search || undefined
    });

    // Role-based filtering: citizens don't see incident counts
    const userRole = req.auth?.role;
    const isCitizen = !userRole || userRole === ROLES.CITIZEN;

    const data = roads.map(road => {
      const base = {
        id: road.id,
        name: road.name,
        districtId: road.district_id,
        districtName: road.district_name,
        type: road.type,
        lengthKm: road.length_km,
        surfaceQuality: road.surface_quality,
        totalRisk: parseFloat(road.total_risk),
        floodRisk: parseFloat(road.flood_risk),
        landslideRisk: parseFloat(road.landslide_risk),
        roadConditionScore: parseFloat(road.road_condition_score),
        rainfallScore: parseFloat(road.rainfall_score),
        riskUpdatedAt: road.risk_updated_at,
        priority: road.priority,
        inFloodZone: road.in_flood_zone,
        inLandslideZone: road.in_landslide_zone,
        geometry: road.geometry
      };

      // Non-citizen roles see operational data
      if (!isCitizen) {
        base.activeIncidents = parseInt(road.active_incidents, 10);
      }

      return base;
    });

    res.json({
      success: true,
      count: data.length,
      page: parseInt(page, 10),
      data
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/risk/districts — Risk aggregated by district
 * Requires authentication — operational data.
 */
router.get("/districts", requireAuth, requireRole([ROLES.AUTHORITY, ROLES.ADMIN, ROLES.FIELD_AGENT, ROLES.LOGISTICS]), async (req, res, next) => {
  try {
    const districts = await getRiskByDistrict();
    const data = districts.map(d => ({
      districtId: d.district_id,
      districtName: d.district_name,
      roadCount: parseInt(d.road_count, 10),
      avgRisk: parseFloat(d.avg_risk),
      maxRisk: parseFloat(d.max_risk),
      criticalRoads: parseInt(d.critical_roads, 10),
      highRiskRoads: parseInt(d.high_risk_roads, 10),
      activeIncidents: parseInt(d.active_incidents, 10)
    }));
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
});

export default router;
