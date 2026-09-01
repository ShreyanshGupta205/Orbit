import { createClerkClient } from "@clerk/backend";
import dotenv from "dotenv";

dotenv.config();

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY
});

// Normalized RBAC Role Definitions
export const ROLES = {
  CITIZEN: "citizen",
  FIELD_AGENT: "field_agent",
  LOGISTICS: "logistics",
  AUTHORITY: "authority",
  ADMIN: "admin"
};

/**
 * Normalizes string representation of role into canonical lowercase key
 * @param {string} rawRole
 * @returns {string}
 */
export function normalizeRole(rawRole) {
  if (!rawRole) return ROLES.CITIZEN;
  const cleaned = rawRole.toLowerCase().trim().replace(/[\s\/-]+/g, "_");
  if (cleaned.includes("admin")) return ROLES.ADMIN;
  if (cleaned.includes("authority") || cleaned.includes("analyst")) return ROLES.AUTHORITY;
  if (cleaned.includes("logistics") || cleaned.includes("operator")) return ROLES.LOGISTICS;
  if (cleaned.includes("field") || cleaned.includes("agent")) return ROLES.FIELD_AGENT;
  return ROLES.CITIZEN;
}

/**
 * Middleware: Requires a valid Clerk authentication session
 */
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Bearer token missing."
      });
    }

    const token = authHeader.split(" ")[1];

    try {
      const verifiedToken = await clerkClient.verifyToken(token);
      const userId = verifiedToken.sub;

      // Fetch user profile from Clerk to get verified role metadata
      const user = await clerkClient.users.getUser(userId);

      const rawRole =
        user.publicMetadata?.role ||
        user.unsafeMetadata?.role ||
        verifiedToken.role ||
        "citizen";

      req.auth = {
        userId,
        email: user.emailAddresses?.[0]?.emailAddress || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        role: normalizeRole(rawRole),
        rawRole
      };

      req.user = req.auth;
      next();
    } catch (tokenErr) {
      console.warn("🔒 Clerk Token verification warning:", tokenErr.message);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authentication session."
      });
    }
  } catch (err) {
    console.error("Authentication Middleware Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal authentication error."
    });
  }
}

/**
 * Middleware: Checks if the authenticated user has one of the required roles
 * @param {string[]} allowedRoles
 */
export function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.auth || !req.auth.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthenticated request."
      });
    }

    const normalizedAllowed = allowedRoles.map(r => normalizeRole(r));
    const userRole = req.auth.role;

    // Admin has access to all role-gated resources
    if (userRole === ROLES.ADMIN || normalizedAllowed.includes(userRole)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Access denied. Role '${req.auth.role}' is not authorized for this resource.`
    });
  };
}

/**
 * Optional Authentication: Attaches req.auth if token is present and valid
 */
export async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.auth = null;
    return next();
  }

  const token = authHeader.split(" ")[1];
  try {
    const verifiedToken = await clerkClient.verifyToken(token);
    const userId = verifiedToken.sub;
    const user = await clerkClient.users.getUser(userId);
    const rawRole = user.publicMetadata?.role || user.unsafeMetadata?.role || "citizen";

    req.auth = {
      userId,
      email: user.emailAddresses?.[0]?.emailAddress || "",
      role: normalizeRole(rawRole)
    };
    req.user = req.auth;
  } catch (e) {
    req.auth = null;
  }
  next();
}

export default {
  ROLES,
  normalizeRole,
  requireAuth,
  requireRole,
  optionalAuth
};
