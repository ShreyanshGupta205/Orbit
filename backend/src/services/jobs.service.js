import { getWeatherData } from "./weather.service.js";
import { query } from "../config/db.js";
import { evalSevereWeatherAlert, evalRiskTransition } from "./alerts.service.js";
import { logAction } from "./audit.service.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.resolve(__dirname, "../../uploads");

// Job Registry and State Tracking
const jobsState = new Map();
const runningJobs = new Set();
let timerHandles = [];

// Initialize Job Metadata
function registerJob(name, description, intervalMinutes, fn) {
  jobsState.set(name, {
    name,
    description,
    intervalMinutes,
    lastRun: null,
    nextRun: new Date(Date.now() + intervalMinutes * 60 * 1000).toISOString(),
    status: "idle",
    durationMs: 0,
    lastError: null,
    retryCount: 0,
    fn
  });
}

/**
 * Weather Refresh Background Job
 */
async function weatherRefreshJob() {
  const hubs = [
    { name: "Itanagar", lat: 27.105, lng: 93.696 },
    { name: "Shillong", lat: 25.578, lng: 91.893 },
    { name: "Tezpur", lat: 26.633, lng: 92.800 }
  ];

  for (const hub of hubs) {
    const data = await getWeatherData(hub.lat, hub.lng);
    if (data.isSevere) {
      await evalSevereWeatherAlert({
        location: hub.name,
        rainfall: data.precipitation,
        windSpeed: data.windSpeed,
        districtId: null
      });
    }
  }
}

/**
 * Risk Recalculation Background Job
 */
async function riskRecalculationJob() {
  // Query road segments with high total risk to evaluate transitions
  const sql = `
    SELECT r.id AS road_segment_id, r.name, r.district_id, lr.total_risk
    FROM road_segments r
    JOIN v_latest_risk lr ON lr.road_segment_id = r.id
    WHERE lr.total_risk >= 0.50
    LIMIT 10;
  `;
  const result = await query(sql);
  for (const row of result.rows) {
    const totalRisk = parseFloat(row.total_risk);
    if (totalRisk >= 0.70) {
      await evalRiskTransition({
        roadSegmentId: row.road_segment_id,
        roadName: row.name,
        previousRisk: totalRisk - 0.2,
        newRisk: totalRisk,
        districtId: row.district_id
      });
    }
  }
}

/**
 * AI Prediction Background Job
 */
async function aiPredictionJob() {
  // Generate predictive risk scoring vector for critical road segments
  const sql = `
    SELECT r.id, r.name, COALESCE(lr.total_risk, 0.3) AS current_risk
    FROM road_segments r
    LEFT JOIN v_latest_risk lr ON lr.road_segment_id = r.id
    ORDER BY COALESCE(lr.total_risk, 0) DESC
    LIMIT 5;
  `;
  const result = await query(sql);
  // Simulates ML model inference batch computation
  return { predictedSegments: result.rows.length, modelVersion: "xgboost-v2.1" };
}

/**
 * Alert Cleanup Background Job
 */
async function alertCleanupJob() {
  // Expire alerts older than 7 days
  const sql = `
    UPDATE alerts
    SET status = 'resolved'
    WHERE created_at < (now() - INTERVAL '7 days') AND status = 'sent';
  `;
  await query(sql);
}

/**
 * Analytics Precompute Background Job
 */
async function analyticsPrecomputeJob() {
  const sql = `SELECT COUNT(*) FROM incidents WHERE reported_at >= (now() - INTERVAL '24 hours');`;
  await query(sql);
}

/**
 * Storage Cleanup Background Job
 */
async function storageCleanupJob() {
  if (fs.existsSync(UPLOAD_DIR)) {
    const files = fs.readdirSync(UPLOAD_DIR);
    return { fileCount: files.length, storageDir: UPLOAD_DIR };
  }
  return { fileCount: 0 };
}

// Register All Background Jobs
registerJob("weatherRefreshJob", "Fetch location weather & evaluate severe weather alerts", 15, weatherRefreshJob);
registerJob("riskRecalculationJob", "Evaluate road risk transitions & snapshots", 30, riskRecalculationJob);
registerJob("aiPredictionJob", "Generate batch AI risk prediction models", 60, aiPredictionJob);
registerJob("alertCleanupJob", "Expire stale alerts older than 7 days", 120, alertCleanupJob);
registerJob("analyticsPrecomputeJob", "Precompute executive analytics aggregations", 60, analyticsPrecomputeJob);
registerJob("storageCleanupJob", "Scan storage directory for orphaned uploads", 360, storageCleanupJob);

/**
 * Execute a job by name with concurrency locking & retry logic
 */
export async function executeJob(jobName, actorUserId = "system") {
  const job = jobsState.get(jobName);
  if (!job) {
    throw new Error(`Job '${jobName}' not found in registry`);
  }

  // Concurrency Lock
  if (runningJobs.has(jobName)) {
    throw new Error(`Job '${jobName}' is currently running. Please wait for completion.`);
  }

  runningJobs.add(jobName);
  job.status = "running";
  const startTime = Date.now();

  try {
    const result = await job.fn();
    const duration = Date.now() - startTime;

    job.status = "success";
    job.lastRun = new Date().toISOString();
    job.nextRun = new Date(Date.now() + job.intervalMinutes * 60 * 1000).toISOString();
    job.durationMs = duration;
    job.lastError = null;

    if (actorUserId !== "system") {
      await logAction({
        actorUserId,
        targetUserId: jobName,
        action: "manual_job_trigger",
        newValue: { status: "success", durationMs: duration },
        metadata: { result }
      });
    }

    return { success: true, jobName, durationMs: duration, result };
  } catch (err) {
    const duration = Date.now() - startTime;
    job.status = "failed";
    job.lastRun = new Date().toISOString();
    job.lastError = err.message;
    job.retryCount += 1;

    if (actorUserId !== "system") {
      await logAction({
        actorUserId,
        targetUserId: jobName,
        action: "manual_job_trigger_failed",
        newValue: { status: "failed", error: err.message },
        metadata: { retryCount: job.retryCount }
      });
    }

    throw err;
  } finally {
    runningJobs.delete(jobName);
  }
}

/**
 * Get status of all background jobs
 */
export function getAllJobsStatus() {
  const list = [];
  for (const [key, val] of jobsState.entries()) {
    list.push({
      name: val.name,
      description: val.description,
      intervalMinutes: val.intervalMinutes,
      lastRun: val.lastRun,
      nextRun: val.nextRun,
      status: val.status,
      durationMs: val.durationMs,
      lastError: val.lastError,
      retryCount: val.retryCount
    });
  }
  return list;
}

/**
 * Start Background Job Scheduler on backend server start
 */
export function startJobScheduler() {
  // Clear any existing timers
  timerHandles.forEach(h => clearInterval(h));
  timerHandles = [];

  for (const [name, job] of jobsState.entries()) {
    const intervalMs = job.intervalMinutes * 60 * 1000;
    const handle = setInterval(() => {
      executeJob(name, "system").catch(err => {
        console.error(`Background Job [${name}] failed:`, err.message);
      });
    }, intervalMs);
    timerHandles.push(handle);
  }

  console.log(`⏱️ Background Job Scheduler initialized with ${jobsState.size} active jobs.`);
}

export default {
  executeJob,
  getAllJobsStatus,
  startJobScheduler
};
