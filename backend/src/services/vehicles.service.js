import { query, withTransaction } from "../config/db.js";

/**
 * Fetch all vehicles with latest GPS position
 */
export async function getAllVehicles() {
  const sql = `
    SELECT 
      v.id,
      v.registration_no,
      v.vehicle_type,
      v.capacity_kg,
      v.home_district_id,
      d.name AS home_district_name,
      v.status,
      vt.speed_kmh,
      vt.heading,
      vt.timestamp AS last_ping_at,
      ST_AsGeoJSON(vt.geometry)::json AS last_location
    FROM vehicles v
    LEFT JOIN districts d ON d.id = v.home_district_id
    LEFT JOIN LATERAL (
      SELECT geometry, speed_kmh, heading, timestamp
      FROM vehicle_tracks
      WHERE vehicle_id = v.id
      ORDER BY timestamp DESC
      LIMIT 1
    ) vt ON true
    ORDER BY v.id ASC;
  `;

  const result = await query(sql);
  return result.rows;
}

/**
 * Update vehicle operational status
 */
export async function updateVehicleStatus(id, status) {
  const sql = `
    UPDATE vehicles
    SET status = $1
    WHERE id = $2
    RETURNING id, registration_no, vehicle_type, capacity_kg, status;
  `;
  const result = await query(sql, [status, id]);
  return result.rows[0] || null;
}

/**
 * Record a telemetry GPS track point for a vehicle
 */
export async function recordVehicleTrack({ vehicleId, longitude, latitude, speedKmh = 0, heading = 0, onRouteId = null, status = "moving" }) {
  return await withTransaction(async (client) => {
    const trackSql = `
      INSERT INTO vehicle_tracks (
        vehicle_id,
        geometry,
        speed_kmh,
        heading,
        on_route_id,
        status,
        timestamp
      ) VALUES (
        $1,
        ST_SetSRID(ST_MakePoint($2, $3), 4326),
        $4,
        $5,
        $6,
        $7,
        now()
      )
      RETURNING id, vehicle_id, speed_kmh, heading, timestamp, ST_AsGeoJSON(geometry)::json AS location;
    `;

    const trackRes = await client.query(trackSql, [vehicleId, longitude, latitude, speedKmh, heading, onRouteId, status]);

    // Update vehicle status
    await client.query("UPDATE vehicles SET status = $1 WHERE id = $2;", [status, vehicleId]);

    return trackRes.rows[0];
  });
}

export default {
  getAllVehicles,
  updateVehicleStatus,
  recordVehicleTrack
};
