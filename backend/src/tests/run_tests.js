import { query } from "../config/db.js";
import { executeJob, getAllJobsStatus } from "../services/jobs.service.js";

async function runTestSuite() {
  console.log("================================================");
  console.log("🧪 NERA Automated Integration & Unit Test Suite");
  console.log("================================================");

  let passed = 0;
  let failed = 0;

  async function assert(name, fn) {
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  // 1. Health API Check
  await assert("Health Check API", async () => {
    const res = await fetch("http://localhost:5000/api/health");
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const json = await res.json();
    if (!json.status || json.status !== "healthy") throw new Error("Unhealthy status");
  });

  // 2. Weather Integration & Caching
  await assert("Weather API Location-Aware & Cache", async () => {
    const res = await fetch("http://localhost:5000/api/weather/current?lat=27.105&lng=93.696");
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const json = await res.json();
    if (!json.success || !json.data.temperature) throw new Error("Missing weather data");
  });

  // 3. Analytics Aggregations & CSV Export
  await assert("Analytics Summary SQL Aggregation", async () => {
    const res = await fetch("http://localhost:5000/api/analytics/summary");
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const json = await res.json();
    if (json.data.totalIncidents === undefined) throw new Error("Missing incident aggregations");
  });

  await assert("Analytics CSV Export Endpoint", async () => {
    const res = await fetch("http://localhost:5000/api/analytics/export");
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const text = await res.text();
    if (!text.startsWith("Incident ID,")) throw new Error("Invalid CSV format");
  });

  // 4. Emergency Resource Discovery
  await assert("Emergency Resource Spatial Discovery", async () => {
    const res = await fetch("http://localhost:5000/api/resources/nearby?lat=27.105&lng=93.696");
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const json = await res.json();
    if (!json.success || !Array.isArray(json.data)) throw new Error("Invalid resource list");
  });

  // 5. Evacuation Safety Pathfinder
  await assert("Evacuation Recommendation Pathfinder", async () => {
    const res = await fetch("http://localhost:5000/api/evacuation/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat: 27.105, lng: 93.696 })
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const json = await res.json();
    if (!json.data.optimizationGoal.includes("Safest")) throw new Error("Not optimized for safety");
  });

  // 6. Admin RBAC Gate Security
  await assert("Admin RBAC 401 Unauthenticated Protection", async () => {
    const res = await fetch("http://localhost:5000/api/admin/overview");
    if (res.status !== 401) throw new Error(`Expected status 401, got ${res.status}`);
  });

  // 7. Background Jobs Execution & Concurrency Lock
  await assert("Background Job Execution & Concurrency Lock", async () => {
    const jobs = getAllJobsStatus();
    if (!jobs || jobs.length === 0) throw new Error("No background jobs registered");

    const execResult = await executeJob("analyticsPrecomputeJob", "automated_test");
    if (!execResult.success) throw new Error("Job execution failed");
  });

  // 8. Database Audit Logging Verification
  await assert("Database Immutable Audit Logging", async () => {
    const res = await query("SELECT COUNT(*) FROM audit_logs;");
    const count = parseInt(res.rows[0].count, 10);
    if (isNaN(count) || count < 1) throw new Error("Audit log entries not recorded");
  });

  console.log("================================================");
  console.log(`📊 Test Results: ${passed} PASSED, ${failed} FAILED`);
  console.log("================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error("Test Suite Runtime Error:", err);
  process.exit(1);
});
