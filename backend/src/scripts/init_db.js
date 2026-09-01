import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL is not set in backend/.env");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function runInit() {
  const client = await pool.connect();
  try {
    console.log("==================================================");
    console.log("🔗 Connecting to Neon PostgreSQL...");
    console.log("==================================================");

    // 1. Check Postgres Version
    const versionRes = await client.query("SELECT version();");
    console.log("🐘 Postgres Version:", versionRes.rows[0].version);

    // 2. Check & Enable PostGIS
    console.log("\n📦 Enabling PostGIS extension...");
    await client.query("CREATE EXTENSION IF NOT EXISTS postgis;");
    const postgisVersion = await client.query("SELECT PostGIS_Version();");
    console.log("✅ PostGIS Version:", postgisVersion.rows[0].postgis_version);

    // 3. Read 01_schema.sql
    console.log("\n📄 Reading 01_schema.sql...");
    const schemaPath = path.resolve(__dirname, "../../../01_schema.sql");
    let schemaSql = fs.readFileSync(schemaPath, "utf-8");

    // Remove timescaledb specific statements (incompatible with Neon architecture)
    schemaSql = schemaSql.replace(/CREATE EXTENSION IF NOT EXISTS timescaledb;/gi, "-- TimescaleDB omitted for Neon");
    schemaSql = schemaSql.replace(/SELECT create_hypertable\([\s\S]*?\);/gi, "-- create_hypertable omitted for Neon");

    console.log("🚀 Executing 01_schema.sql against Neon...");
    await client.query(schemaSql);
    console.log("✅ 01_schema.sql executed successfully!");

    // 4. Read 02_sample_data.sql
    console.log("\n📄 Reading 02_sample_data.sql...");
    const sampleDataPath = path.resolve(__dirname, "../../../02_sample_data.sql");
    const sampleDataSql = fs.readFileSync(sampleDataPath, "utf-8");

    console.log("🚀 Executing 02_sample_data.sql against Neon...");
    await client.query(sampleDataSql);
    console.log("✅ 02_sample_data.sql executed successfully!");

    // 5. Verification Queries
    console.log("\n==================================================");
    console.log("🔍 RUNNING DATABASE VERIFICATION QUERIES");
    console.log("==================================================");

    const tables = [
      "districts",
      "road_nodes",
      "hazard_zones",
      "stakeholders",
      "vehicles",
      "routes",
      "road_segments",
      "risk_snapshots",
      "incidents",
      "facilities",
      "dependencies",
      "shipments",
      "vehicle_tracks",
      "route_candidates",
      "alerts"
    ];

    for (const table of tables) {
      const countRes = await client.query(`SELECT COUNT(*) AS count FROM ${table};`);
      console.log(`📊 Table [${table.padEnd(18)}]: ${countRes.rows[0].count} rows`);
    }

    // Verify View
    const viewRes = await client.query("SELECT COUNT(*) AS count FROM v_latest_risk;");
    console.log(`📊 View  [${'v_latest_risk'.padEnd(18)}]: ${viewRes.rows[0].count} rows`);

    // Verify Spatial PostGIS function: ST_AsGeoJSON on districts
    const geoJsonRes = await client.query("SELECT id, name, ST_AsGeoJSON(boundary) AS geojson FROM districts LIMIT 1;");
    console.log(`🌐 Spatial GeoJSON Test: District "${geoJsonRes.rows[0].name}" boundary serialized successfully`);

    // Verify Custom Database Function: nera_shortest_path_with_cost
    const shortestPathRes = await client.query("SELECT * FROM nera_shortest_path_with_cost(1, 9, 1.0) LIMIT 3;");
    console.log(`🗺️ Function Test [nera_shortest_path_with_cost]: Returned ${shortestPathRes.rowCount} path hops`);

    // Verify Custom Database Function: nera_facilities_in_district
    const facRes = await client.query("SELECT COUNT(*) AS count FROM nera_facilities_in_district(1);");
    console.log(`🏥 Function Test [nera_facilities_in_district]: Found ${facRes.rows[0].count} facilities in District 1`);

    console.log("\n🎉 ALL DATABASE INITIALIZATION AND VERIFICATION CHECKS PASSED!");
  } catch (err) {
    console.error("❌ Database Initialization Error:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runInit();
