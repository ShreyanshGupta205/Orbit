import { Router } from "express";
import {
  getUserAlerts,
  getUnreadAlertCount,
  createAlert,
  markAlertRead,
  markAlertAcknowledged,
  resolveAlert
} from "../services/alerts.service.js";
import { registerSSEClient } from "../services/realtime.service.js";
import { requireAuth, requireRole, optionalAuth, ROLES } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * GET /api/alerts/stream — Authenticated Server-Sent Events (SSE) Realtime Stream
 * Accepts token via Bearer header or ?token query string parameter.
 */
router.get("/stream", optionalAuth, async (req, res, next) => {
  try {
    if (!req.auth?.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: Valid Clerk token required for real-time stream" });
    }

    const user = {
      id: req.auth.userId,
      role: req.auth.role || ROLES.CITIZEN
    };

    registerSSEClient(req, res, user);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/alerts/unread-count — Unread alert badge counter for current user
 */
router.get("/unread-count", requireAuth, async (req, res, next) => {
  try {
    const count = await getUnreadAlertCount(req.auth.userId, req.auth.role);
    res.json({ success: true, count });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/alerts — List alerts targeted to current user/role with user-specific read/ack status
 */
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const { districtId, page = 1, limit = 20 } = req.query;
    const alerts = await getUserAlerts({
      userId: req.auth.userId,
      userRole: req.auth.role,
      districtId: districtId ? parseInt(districtId, 10) : null,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10)
    });
    res.json({ success: true, count: alerts.length, data: alerts });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/alerts — Manually create an alert (Authority, Admin only)
 */
router.post("/", requireAuth, requireRole([ROLES.AUTHORITY, ROLES.ADMIN]), async (req, res, next) => {
  try {
    const { type, severity, targetRole, targetUserId, districtId, roadSegmentId, facilityId, message, channel } = req.body;
    if (!type || !message) {
      return res.status(400).json({ success: false, message: "type and message are required" });
    }

    const alert = await createAlert({
      type,
      severity,
      targetRole,
      targetUserId,
      districtId,
      roadSegmentId,
      facilityId,
      message,
      channel
    });

    res.status(201).json({ success: true, data: alert });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/alerts/:id/read — Mark an alert as read for current user
 */
router.post("/:id/read", requireAuth, async (req, res, next) => {
  try {
    const state = await markAlertRead(req.params.id, req.auth.userId);
    res.json({ success: true, data: state });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/alerts/:id/acknowledge — Acknowledge an alert for current user
 */
router.post("/:id/acknowledge", requireAuth, async (req, res, next) => {
  try {
    const updated = await markAlertAcknowledged(req.params.id, req.auth.userId);
    if (!updated) return res.status(404).json({ success: false, message: "Alert not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/alerts/:id/resolve — Resolve an alert (Authority, Admin only)
 */
router.patch("/:id/resolve", requireAuth, requireRole([ROLES.AUTHORITY, ROLES.ADMIN]), async (req, res, next) => {
  try {
    const updated = await resolveAlert(req.params.id);
    if (!updated) return res.status(404).json({ success: false, message: "Alert not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

export default router;
