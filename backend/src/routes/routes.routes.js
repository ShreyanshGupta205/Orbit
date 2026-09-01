import { Router } from "express";
import { getAllRoutes, calculateShortestPath, getRoadNodes } from "../services/routes.service.js";

const router = Router();

// GET /api/routes - List all defined candidate routes
router.get("/", async (req, res, next) => {
  try {
    const routes = await getAllRoutes();
    res.json({
      success: true,
      count: routes.length,
      data: routes
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/routes/nodes - List all road graph nodes (junctions)
router.get("/nodes", async (req, res, next) => {
  try {
    const nodes = await getRoadNodes();
    res.json({
      success: true,
      count: nodes.length,
      data: nodes
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/routes/calculate - Dynamic risk-aware shortest path (DB function nera_shortest_path_with_cost)
router.get("/calculate", async (req, res, next) => {
  try {
    const sourceNode = parseInt(req.query.source, 10);
    const targetNode = parseInt(req.query.target, 10);
    const riskWeight = parseFloat(req.query.riskWeight) || 1.0;
    const excludeRoadId = req.query.excludeRoad ? parseInt(req.query.excludeRoad, 10) : null;

    if (isNaN(sourceNode) || isNaN(targetNode)) {
      return res.status(400).json({
        success: false,
        message: "Source node ID (source) and target node ID (target) are required query parameters."
      });
    }

    const pathHops = await calculateShortestPath(sourceNode, targetNode, riskWeight, excludeRoadId);

    const totalDistance = pathHops.reduce((sum, h) => sum + (parseFloat(h.edge_cost) || 0), 0);

    res.json({
      success: true,
      sourceNode,
      targetNode,
      hopCount: pathHops.length,
      totalCost: pathHops[pathHops.length - 1]?.agg_cost || totalDistance,
      hops: pathHops
    });
  } catch (error) {
    next(error);
  }
});

export default router;
