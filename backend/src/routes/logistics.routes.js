import { Router } from "express";
import { getVehicles, getIncidents } from "../controllers/logistics.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// GET /api/logistics/vehicles
router.get("/vehicles", requireAuth, getVehicles);

// GET /api/logistics/incidents
router.get("/incidents", requireAuth, getIncidents);

export default router;
