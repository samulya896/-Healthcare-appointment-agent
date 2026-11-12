const express = require("express");
const { corsMiddleware, securityHeaders, rateLimit } = require("./middleware/security");
const { notFound, errorHandler } = require("./middleware/errors");

const app = express();
app.set("trust proxy", 1); // correct client IPs behind Vercel / Render

app.use(securityHeaders);
app.use(corsMiddleware());
app.use(express.json({ limit: "100kb" }));

app.use("/api", require("./routes/health"));
app.use("/api/auth", rateLimit({ windowMs: 60_000, max: 30 }), require("./routes/auth"));
app.use("/api/patient", require("./routes/patients"));
app.use("/api/doctors", require("./routes/doctors"));
app.use("/api/appointments", require("./routes/appointments"));
app.use("/api/chat", rateLimit({ windowMs: 60_000, max: 30 }), require("./routes/chat"));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
