import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import logisticsRoutes from "./routes/logistics.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      process.env.NODE_ENV !== "production" ||
      allowedOrigins.includes(origin) ||
      allowedOrigins.includes("*") ||
      origin.endsWith(".vercel.app")
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    system: "NERA Backend API Engine",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/districts", (await import('./routes/districts.routes.js')).default);
app.use("/api/roads", (await import('./routes/roads.routes.js')).default);
app.use("/api/hazards", (await import('./routes/hazards.routes.js')).default);
app.use("/api/facilities", (await import('./routes/facilities.routes.js')).default);
app.use("/api/incidents", (await import('./routes/incidents.routes.js')).default);
app.use("/api/vehicles", (await import('./routes/vehicles.routes.js')).default);
app.use("/api/shipments", (await import('./routes/shipments.routes.js')).default);
app.use("/api/routes", (await import('./routes/routes.routes.js')).default);
app.use("/api/resilience", (await import('./routes/resilience.routes.js')).default);
app.use("/api/alerts", (await import('./routes/alerts.routes.js')).default);
app.use("/api/risk", (await import('./routes/risk.routes.js')).default);
app.use("/api/resources", (await import('./routes/resources.routes.js')).default);
app.use("/api/geospatial", (await import('./routes/geospatial.routes.js')).default);
app.use("/api/evacuation", (await import('./routes/evacuation.routes.js')).default);
app.use("/api/weather", (await import('./routes/weather.routes.js')).default);
app.use("/api/analytics", (await import('./routes/analytics.routes.js')).default);
app.use("/api/logistics", logisticsRoutes);
app.use("/api/uploads", (await import('./routes/uploads.routes.js')).default);
app.use("/api/admin", (await import('./routes/admin.routes.js')).default);

// Serve uploaded files statically
import path from "path";
import { fileURLToPath } from "url";
import { startJobScheduler } from "./services/jobs.service.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

// Start Server & Background Job Scheduler
app.listen(PORT, () => {
  console.log(`================================================`);
  console.log(`🚀 NERA Backend Server running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`================================================`);
  startJobScheduler();
});
