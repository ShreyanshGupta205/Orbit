import { Router } from "express";
import { getSummaryKPIs, getIncidentAnalytics, exportAnalyticsCSV } from "../services/analytics.service.js";
import { optionalAuth, requireAuth, requireRole, ROLES } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * GET /api/analytics/summary — Executive KPI summary metrics
 */
router.get("/summary", optionalAuth, async (req, res, next) => {
  try {
    const { timeRange, districtId } = req.query;
    const summary = await getSummaryKPIs({
      timeRange: timeRange || "Last 7 Days",
      districtId: districtId ? parseInt(districtId, 10) : null
    });
    res.json({ success: true, data: summary });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/analytics/incidents — Incident severity, type, and trend analytics
 */
router.get("/incidents", optionalAuth, async (req, res, next) => {
  try {
    const { timeRange, districtId } = req.query;
    const analytics = await getIncidentAnalytics({
      timeRange: timeRange || "Last 7 Days",
      districtId: districtId ? parseInt(districtId, 10) : null
    });
    res.json({ success: true, data: analytics });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/analytics/export — Download CSV analytical report
 */
router.get("/export", optionalAuth, async (req, res, next) => {
  try {
    const { timeRange, districtId } = req.query;
    const csvContent = await exportAnalyticsCSV({
      timeRange: timeRange || "Last 7 Days",
      districtId: districtId ? parseInt(districtId, 10) : null
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="NERA-Executive-Analytics-${Date.now()}.csv"`);
    res.send(csvContent);
  } catch (err) {
    next(err);
  }
});

export default router;
