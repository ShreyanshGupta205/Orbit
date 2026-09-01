import { Router } from "express";
import { requireAuth, requireRole, ROLES } from "../middleware/auth.middleware.js";
import { getAdminOverview, getUsersList, updateUserRole, getSystemHealth } from "../services/admin.service.js";
import { getAuditLogs, getAuditLogById } from "../services/audit.service.js";
import { getAllJobsStatus, executeJob } from "../services/jobs.service.js";

const router = Router();

// Strict Server-Side Admin RBAC Enforcement: All routes require authentication & 'admin' role
router.use(requireAuth);
router.use(requireRole([ROLES.ADMIN]));

/**
 * GET /api/admin/overview — High-level system overview KPIs
 */
router.get("/overview", async (req, res, next) => {
  try {
    const overview = await getAdminOverview();
    res.json({ success: true, data: overview });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/users — Paginated user list with role & search filters
 */
router.get("/users", async (req, res, next) => {
  try {
    const { page, limit, role, search } = req.query;
    const users = await getUsersList({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      role,
      search
    });
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/admin/users/:userId/role — Update authorized user role
 */
router.patch("/users/:userId/role", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ success: false, message: "Missing required 'role' field" });
    }

    const result = await updateUserRole({
      actorUserId: req.auth.userId,
      targetUserId: userId,
      newRole: role
    });

    res.json({ success: true, data: result, message: `User role successfully updated to '${role}'` });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/audit-logs — Audit log search with pagination & filters
 */
router.get("/audit-logs", async (req, res, next) => {
  try {
    const { page, limit, actor, action, target, from, to } = req.query;
    const logs = await getAuditLogs({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      actor,
      action,
      target,
      from,
      to
    });
    res.json({ success: true, data: logs });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/audit-logs/:id — Single audit log detail inspection
 */
router.get("/audit-logs/:id", async (req, res, next) => {
  try {
    const log = await getAuditLogById(req.params.id);
    if (!log) {
      return res.status(404).json({ success: false, message: "Audit log entry not found" });
    }
    res.json({ success: true, data: log });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/jobs — List background jobs status
 */
router.get("/jobs", async (_req, res, next) => {
  try {
    const jobs = getAllJobsStatus();
    res.json({ success: true, data: jobs });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/admin/jobs/:jobName/run — Manually trigger background job execution
 */
router.post("/jobs/:jobName/run", async (req, res, next) => {
  try {
    const { jobName } = req.params;
    const result = await executeJob(jobName, req.auth.userId);
    res.json({ success: true, data: result, message: `Job '${jobName}' executed successfully` });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/admin/health — Detailed system health checks
 */
router.get("/health", async (_req, res, next) => {
  try {
    const health = await getSystemHealth();
    res.json({ success: true, data: health });
  } catch (err) {
    next(err);
  }
});

export default router;
