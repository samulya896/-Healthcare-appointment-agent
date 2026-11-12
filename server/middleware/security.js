const cors = require("cors");
const { allowedOrigins } = require("../config");
const { verifyToken } = require("../utils/token");

/** CORS restricted to CORS_ORIGINS when set; open otherwise (local dev). */
const corsMiddleware = () =>
  cors({
    origin: allowedOrigins.length ? (origin, cb) => cb(null, !origin || allowedOrigins.includes(origin)) : true,
    allowedHeaders: ["Content-Type", "Authorization"],
  });

/** Baseline security headers (a small subset of what helmet sets). */
function securityHeaders(_req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  res.removeHeader("X-Powered-By");
  next();
}

/** Fixed-window in-memory rate limiter, keyed by client IP. */
function rateLimit({ windowMs, max }) {
  const hits = new Map();
  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip;
    const entry = hits.get(key);
    if (!entry || entry.reset < now) {
      hits.set(key, { count: 1, reset: now + windowMs });
      return next();
    }
    if (++entry.count > max) {
      res.setHeader("Retry-After", Math.ceil((entry.reset - now) / 1000));
      return res.status(429).json({ error: "Too many requests. Please slow down and try again shortly." });
    }
    next();
  };
}

/** Requires a valid Bearer token; exposes the patient id as req.userId. */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const userId = verifyToken(header.startsWith("Bearer ") ? header.slice(7) : "");
  if (!userId) return res.status(401).json({ error: "Please sign in to continue." });
  req.userId = userId;
  next();
}

/** Ensures the authenticated user is the patient referenced by the route/query/body. */
const ownsPatient = (getId) => (req, res, next) => {
  const id = getId(req);
  if (id && id !== req.userId) return res.status(403).json({ error: "You can only access your own records." });
  next();
};

module.exports = { corsMiddleware, securityHeaders, rateLimit, requireAuth, ownsPatient };
