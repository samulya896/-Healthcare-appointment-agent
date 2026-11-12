// Vercel serverless entry: exposes the Express app from server/ under /api/*.
// NOTE: data is in memory, so it is per-function-instance and resets on cold starts.
module.exports = require("../server/index.js");
