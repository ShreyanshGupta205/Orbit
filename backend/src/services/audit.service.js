import { query } from "../config/db.js";

/**
 * Log an audit action to the audit_logs table.
 * @param {Object} params
 *   - actorUserId: Clerk user ID of the actor
 *   - targetUserId: ID of the affected entity (user ID, incident ID, etc.)
 *   - action: string describing the action (e.g., 'role_change', 'verify_incident')
 *   - oldValue: previous state (object or null)
 *   - newValue: new state (object or null)
 *   - metadata: additional context (object or null)
 */
export async function logAction({ actorUserId, targetUserId, action, oldValue = null, newValue = null, metadata = null }) {
  const sql = `
    INSERT INTO audit_logs (
      actor_user_id,
      target_user_id,
      action,
      old_value,
      new_value,
      metadata,
      created_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, now()
    )
    RETURNING id;
  `;
  const params = [
    actorUserId || "system",
    String(targetUserId || "system"),
    action,
    oldValue ? JSON.stringify(oldValue) : null,
    newValue ? JSON.stringify(newValue) : null,
    metadata ? JSON.stringify(metadata) : null
  ];
  const result = await query(sql, params);
  return result.rows[0] ? result.rows[0].id : null;
}

/**
 * Log an audit action within an existing transaction client.
 */
export async function logActionTx(client, { actorUserId, targetUserId, action, oldValue = null, newValue = null, metadata = null }) {
  const sql = `
    INSERT INTO audit_logs (
      actor_user_id,
      target_user_id,
      action,
      old_value,
      new_value,
      metadata,
      created_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, now()
    )
    RETURNING id;
  `;
  const params = [
    actorUserId || "system",
    String(targetUserId || "system"),
    action,
    oldValue ? JSON.stringify(oldValue) : null,
    newValue ? JSON.stringify(newValue) : null,
    metadata ? JSON.stringify(metadata) : null
  ];
  const result = await client.query(sql, params);
  return result.rows[0] ? result.rows[0].id : null;
}

/**
 * Fetch paginated audit logs with optional filters.
 */
export async function getAuditLogs({ page = 1, limit = 20, actor = null, action = null, target = null, from = null, to = null } = {}) {
  const safeLimit = Math.min(Math.max(limit, 1), 100);
  const offset = (Math.max(page, 1) - 1) * safeLimit;

  let whereClause = "WHERE 1=1";
  const params = [];

  if (actor) {
    params.push(`%${actor}%`);
    whereClause += ` AND actor_user_id ILIKE $${params.length}`;
  }
  if (action) {
    params.push(action);
    whereClause += ` AND action = $${params.length}`;
  }
  if (target) {
    params.push(`%${target}%`);
    whereClause += ` AND target_user_id ILIKE $${params.length}`;
  }
  if (from) {
    params.push(from);
    whereClause += ` AND created_at >= $${params.length}`;
  }
  if (to) {
    params.push(to);
    whereClause += ` AND created_at <= $${params.length}`;
  }

  const countSql = `SELECT COUNT(*) FROM audit_logs ${whereClause};`;
  const countRes = await query(countSql, params);
  const total = parseInt(countRes.rows[0].count, 10);

  const dataSql = `
    SELECT id, actor_user_id, target_user_id, action, old_value, new_value, metadata, created_at
    FROM audit_logs
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${params.length + 1} OFFSET $${params.length + 2};
  `;

  const dataRes = await query(dataSql, [...params, safeLimit, offset]);

  return {
    total,
    page,
    limit: safeLimit,
    totalPages: Math.ceil(total / safeLimit) || 1,
    logs: dataRes.rows
  };
}

/**
 * Get single audit log details by ID.
 */
export async function getAuditLogById(id) {
  const sql = `SELECT * FROM audit_logs WHERE id = $1;`;
  const res = await query(sql, [id]);
  return res.rows[0] || null;
}

export default {
  logAction,
  logActionTx,
  getAuditLogs,
  getAuditLogById
};
