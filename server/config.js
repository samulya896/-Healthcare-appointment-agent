const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const PLACEHOLDER_KEY = "your_gemini_api_key_here";

module.exports = {
  port: process.env.PORT || 3001,
  isProduction: process.env.NODE_ENV === "production" || !!process.env.VERCEL,
  allowedOrigins: (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((o) => o.trim().replace(/\/$/, ""))
    .filter(Boolean),
  // Signs session tokens. Set SESSION_SECRET in production (any long random string).
  sessionSecret: process.env.SESSION_SECRET || "dev-only-insecure-secret-change-me",
  sessionTtlMs: 12 * 60 * 60 * 1000,
  geminiConfigured() {
    const key = (process.env.GEMINI_API_KEY || "").trim();
    return key.length > 20 && key !== PLACEHOLDER_KEY;
  },
};
