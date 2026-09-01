import { Router } from "express";
import {
  getAllIncidents,
  createIncident,
  updateIncident,
  getIncidentById,
  verifyIncidentTx,
  resolveIncidentTx,
  deleteIncident
} from "../services/incidents.service.js";
import { logAction } from "../services/audit.service.js";
import { createAlert } from "../services/alerts.service.js";
import { withTransaction } from "../config/db.js";
import { requireAuth, requireRole, optionalAuth, ROLES } from "../middleware/auth.middleware.js";
import { verifyResolveLimiter } from "../middleware/rateLimit.middleware.js";

const router = Router();

// LIST incidents with pagination, filters, search
router.get("/", optionalAuth, async (req, res, next) => {
  try {
    const { districtId, severity, type, verified, page = 1, limit = 20, search } = req.query;
    const filters = { districtId, severity, type };
    if (req.auth && [ROLES.FIELD_AGENT, ROLES.AUTHORITY, ROLES.ADMIN].includes(req.auth.role)) {
      if (verified !== undefined) filters.verified = verified === "true";
    } else {
      filters.verified = true;
    }
    const incidents = await getAllIncidents({
      filters,
      page: parseInt(page, 10),
      limit: Math.min(parseInt(limit, 10), 100),
      search
    });
    res.json({ success: true, count: incidents.length, data: incidents });
  } catch (err) {
    next(err);
  }
});

// GET single incident
router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const incident = await getIncidentById(req.params.id);
    if (!incident) return res.status(404).json({ success: false, message: "Incident not found" });
    const isOwner = incident.reportedBy === req.auth.userId;
    const canSeeAll = isOwner || [ROLES.ADMIN, ROLES.AUTHORITY, ROLES.FIELD_AGENT].includes(req.auth.role);
    if (!incident.verified && !canSeeAll) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    res.json({ success: true, data: incident });
  } catch (err) {
    next(err);
  }
});

// CREATE incident + audit log
router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { type, severity, roadSegmentId, longitude, latitude, description, photoUrl } = req.body;
    if (!type || longitude === undefined || latitude === undefined) {
      return res.status(400).json({ success: false, message: "type, longitude and latitude are required" });
    }
    const incident = await createIncident({
      type,
      severity: severity || "medium",
      roadSegmentId: roadSegmentId || null,
      longitude,
      latitude,
      reportedBy: req.auth.userId,
      description: description || "",
      photoUrl: photoUrl || null
    });
    // Audit – fire-and-forget (non-blocking)
    logAction({
      actorUserId: req.auth.userId,
      targetUserId: String(incident.id),
      action: "create_incident",
      newValue: incident
    }).catch(() => {});
    res.status(201).json({ success: true, data: incident });
  } catch (err) {
    next(err);
  }
});

// PATCH incident – owners can edit description/severity
router.patch("/:id", requireAuth, async (req, res, next) => {
  try {
    const incident = await getIncidentById(req.params.id);
    if (!incident) return res.status(404).json({ success: false, message: "Incident not found" });
    const isOwner = incident.reportedBy === req.auth.userId;
    const canEdit = isOwner || [ROLES.ADMIN, ROLES.AUTHORITY, ROLES.FIELD_AGENT].includes(req.auth.role);
    if (!canEdit) return res.status(403).json({ success: false, message: "Not authorized to edit" });
    const { description, severity } = req.body;
    const updated = await updateIncident(req.params.id, { description, severity });
    logAction({
      actorUserId: req.auth.userId,
      targetUserId: String(req.params.id),
      action: "update_incident",
      oldValue: { description: incident.description, severity: incident.severity },
      newValue: { description: updated.description, severity: updated.severity }
    }).catch(() => {});
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// VERIFY incident — AUTHORITY and ADMIN only (never Field Agent)
// - Concurrency-safe via SELECT FOR UPDATE inside transaction
// - Idempotency: returns 409 if already verified (no duplicate side-effects)
// - Audit: written atomically in same transaction
// - Post-verify alert: fire-and-forget for high/critical severity
router.post(
  "/:id/verify",
  verifyResolveLimiter,
  requireAuth,
  requireRole([ROLES.AUTHORITY, ROLES.ADMIN]),   // ← Field Agent explicitly excluded
  async (req, res, next) => {
    try {
      const result = await withTransaction(async (client) => {
        return await verifyIncidentTx(client, req.params.id, req.auth.userId);
      });

      // Incident not found
      if (result === null) {
        return res.status(404).json({ success: false, message: "Incident not found" });
      }

      // Already verified — prevent duplicate side-effects
      if (result.alreadyVerified) {
        return res.status(409).json({
          success: false,
          message: "Incident is already verified. No changes were made."
        });
      }

      const { incident, roadSegmentId, severity } = result;

      res.json({ success: true, data: incident });
    } catch (err) {
      next(err);
    }
  }
);

// RESOLVE incident – transactional (incident update + audit insert)
router.post("/:id/resolve", verifyResolveLimiter, requireAuth, requireRole([ROLES.AUTHORITY, ROLES.ADMIN, ROLES.FIELD_AGENT]), async (req, res, next) => {
  try {
    const result = await withTransaction(async (client) => {
      return await resolveIncidentTx(client, req.params.id, req.auth.userId);
    });
    if (!result) return res.status(404).json({ success: false, message: "Incident not found" });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// DELETE incident – admin only + audit log
router.delete("/:id", requireAuth, requireRole([ROLES.ADMIN]), async (req, res, next) => {
  try {
    const incident = await getIncidentById(req.params.id);
    if (!incident) return res.status(404).json({ success: false, message: "Incident not found" });
    const deleted = await deleteIncident(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Incident not found" });
    logAction({
      actorUserId: req.auth.userId,
      targetUserId: String(req.params.id),
      action: "delete_incident",
      oldValue: incident
    }).catch(() => {});
    res.json({ success: true, message: "Incident deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
