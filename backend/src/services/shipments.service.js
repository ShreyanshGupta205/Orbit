import { query, withTransaction } from "../config/db.js";

/**
 * Fetch all shipments with origin, destination, vehicle, and candidate routes
 */
export async function getAllShipments(filters = {}) {
  let whereClause = "WHERE 1=1";
  const params = [];

  if (filters.status) {
    params.push(filters.status);
    whereClause += ` AND s.status = $${params.length}`;
  }

  if (filters.priority) {
    params.push(filters.priority);
    whereClause += ` AND s.priority_tier = $${params.length}`;
  }

  const sql = `
    SELECT 
      s.id,
      s.cargo_type,
      s.priority_tier,
      s.status,
      s.eta,
      s.created_at,
      s.origin_facility_id,
      fo.name AS origin_facility_name,
      fo.type AS origin_facility_type,
      ST_AsGeoJSON(fo.geometry)::json AS origin_geometry,
      s.destination_facility_id,
      fd.name AS destination_facility_name,
      fd.type AS destination_facility_type,
      ST_AsGeoJSON(fd.geometry)::json AS destination_geometry,
      s.vehicle_id,
      v.registration_no AS vehicle_registration_no,
      s.current_route_id,
      r.name AS route_name
    FROM shipments s
    JOIN facilities fo ON fo.id = s.origin_facility_id
    JOIN facilities fd ON fd.id = s.destination_facility_id
    LEFT JOIN vehicles v ON v.id = s.vehicle_id
    LEFT JOIN routes r ON r.id = s.current_route_id
    ${whereClause}
    ORDER BY s.created_at DESC;
  `;

  const result = await query(sql, params);
  return result.rows;
}

/**
 * Create a new shipment with atomic assignment
 */
export async function createShipment({
  originFacilityId,
  destinationFacilityId,
  cargoType,
  priorityTier = "medium",
  vehicleId = null,
  currentRouteId = null,
  eta = null,
  status = "planned"
}) {
  return await withTransaction(async (client) => {
    const insertSql = `
      INSERT INTO shipments (
        origin_facility_id,
        destination_facility_id,
        cargo_type,
        priority_tier,
        vehicle_id,
        current_route_id,
        eta,
        status,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now())
      RETURNING *;
    `;

    const res = await client.query(insertSql, [
      originFacilityId,
      destinationFacilityId,
      cargoType,
      priorityTier,
      vehicleId,
      currentRouteId,
      eta,
      status
    ]);

    // If a vehicle is assigned and status is in_transit, update vehicle status
    if (vehicleId && status === "in_transit") {
      await client.query("UPDATE vehicles SET status = 'moving' WHERE id = $1;", [vehicleId]);
    }

    return res.rows[0];
  });
}

/**
 * Update shipment status or ETA
 */
export async function updateShipment(id, updateData = {}) {
  const fields = [];
  const params = [id];

  if (updateData.status) {
    params.push(updateData.status);
    fields.push(`status = $${params.length}`);
  }

  if (updateData.eta) {
    params.push(updateData.eta);
    fields.push(`eta = $${params.length}`);
  }

  if (updateData.vehicleId !== undefined) {
    params.push(updateData.vehicleId);
    fields.push(`vehicle_id = $${params.length}`);
  }

  if (updateData.currentRouteId !== undefined) {
    params.push(updateData.currentRouteId);
    fields.push(`current_route_id = $${params.length}`);
  }

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  const sql = `
    UPDATE shipments
    SET ${fields.join(", ")}
    WHERE id = $1
    RETURNING *;
  `;

  const result = await query(sql, params);
  return result.rows[0] || null;
}

export default {
  getAllShipments,
  createShipment,
  updateShipment
};
