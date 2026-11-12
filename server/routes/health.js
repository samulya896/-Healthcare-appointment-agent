const router = require("express").Router();
const config = require("../config");

router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    uptimeSeconds: Math.round(process.uptime()),
    assistantMode: config.geminiConfigured() ? "gemini" : "clinical-fallback",
  });
});

module.exports = router;
