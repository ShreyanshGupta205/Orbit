import rateLimit from "express-rate-limit";

/**
 * Rate limiter for verification/resolution endpoints.
 * 30 requests per minute per IP.
 */
export const verifyResolveLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests – please wait before retrying."
  }
});

export default { verifyResolveLimiter };
