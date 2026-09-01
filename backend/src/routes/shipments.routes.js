import { Router } from "express";
import { getAllShipments, createShipment, updateShipment } from "../services/shipments.service.js";
import { requireAuth, requireRole, ROLES } from "../middleware/auth.middleware.js";

const router = Router();

// GET /api/shipments - List shipments with origin and destination facility details
router.get("/", async (req, res, next) => {
  try {
    const { status, priority } = req.query;
    const shipments = await getAllShipments({ status, priority });
    res.json({
      success: true,
      count: shipments.length,
      data: shipments
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/shipments - Create a new relief / cargo shipment (Logistics, Authority, Admin)
router.post("/", requireAuth, requireRole([ROLES.LOGISTICS, ROLES.AUTHORITY, ROLES.ADMIN]), async (req, res, next) => {
  try {
    const { originFacilityId, destinationFacilityId, cargoType, priorityTier, vehicleId, currentRouteId, eta, status } = req.body;

    if (!originFacilityId || !destinationFacilityId || !cargoType) {
      return res.status(400).json({
        success: false,
        message: "Origin facility, destination facility, and cargo type are required."
      });
    }

    if (originFacilityId === destinationFacilityId) {
      return res.status(400).json({
        success: false,
        message: "Origin facility and destination facility must be different."
      });
    }

    const shipment = await createShipment({
      originFacilityId,
      destinationFacilityId,
      cargoType,
      priorityTier: priorityTier || "medium",
      vehicleId,
      currentRouteId,
      eta,
      status: status || "planned"
    });

    res.status(201).json({
      success: true,
      message: "Shipment created successfully.",
      data: shipment
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/shipments/:id - Update shipment status / ETA (Logistics, Authority, Admin)
router.patch("/:id", requireAuth, requireRole([ROLES.LOGISTICS, ROLES.AUTHORITY, ROLES.ADMIN]), async (req, res, next) => {
  try {
    const { status, eta, vehicleId, currentRouteId } = req.body;
    const updated = await updateShipment(req.params.id, { status, eta, vehicleId, currentRouteId });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Shipment not found." });
    }

    res.json({
      success: true,
      message: "Shipment updated successfully.",
      data: updated
    });
  } catch (error) {
    next(error);
  }
});

export default router;
