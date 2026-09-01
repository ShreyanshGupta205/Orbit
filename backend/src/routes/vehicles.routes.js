import { Router } from "express";
import { getAllVehicles, updateVehicleStatus, recordVehicleTrack } from "../services/vehicles.service.js";
import { requireAuth, requireRole, ROLES } from "../middleware/auth.middleware.js";

const router = Router();

// GET /api/vehicles - List all fleet vehicles with latest location
router.get("/", async (req, res, next) => {
  try {
    const vehicles = await getAllVehicles();
    res.json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/vehicles/:id/status - Update vehicle status (Logistics, Authority, Admin)
router.patch("/:id/status", requireAuth, requireRole([ROLES.LOGISTICS, ROLES.AUTHORITY, ROLES.ADMIN]), async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required." });
    }

    const updated = await updateVehicleStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Vehicle not found." });
    }

    res.json({
      success: true,
      message: "Vehicle status updated successfully.",
      data: updated
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/vehicles/:id/track - Ingest live GPS telemetry ping (Logistics, Field Agent, Admin)
router.post("/:id/track", requireAuth, requireRole([ROLES.LOGISTICS, ROLES.FIELD_AGENT, ROLES.ADMIN]), async (req, res, next) => {
  try {
    const { longitude, latitude, speedKmh, heading, onRouteId, status } = req.body;

    if (longitude === undefined || latitude === undefined) {
      return res.status(400).json({ success: false, message: "Longitude and latitude are required." });
    }

    const track = await recordVehicleTrack({
      vehicleId: req.params.id,
      longitude,
      latitude,
      speedKmh,
      heading,
      onRouteId,
      status: status || "moving"
    });

    res.status(201).json({
      success: true,
      message: "GPS ping recorded successfully.",
      data: track
    });
  } catch (error) {
    next(error);
  }
});

export default router;
