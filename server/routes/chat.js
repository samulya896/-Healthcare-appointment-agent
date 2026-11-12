const router = require("express").Router();
const { chat } = require("../services/geminiService");
const { isStr } = require("../utils/validate");

// POST /api/chat  { sessionId, message, patientContext }
router.post("/", async (req, res, next) => {
  try {
    const { sessionId, message, patientContext } = req.body || {};
    if (!sessionId || !message) return res.status(400).json({ error: "sessionId and message are required." });
    if (!isStr(sessionId, 100) || !isStr(message, 1000)) {
      return res.status(400).json({ error: "Message is too long (max 1000 characters)." });
    }
    const reply = await chat(sessionId, message, patientContext);
    res.json({ response: reply, reply });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
