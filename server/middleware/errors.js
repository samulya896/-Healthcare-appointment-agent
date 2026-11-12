const notFound = (req, res) => res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });

// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  if (err.type === "entity.too.large") return res.status(413).json({ error: "Request body too large." });
  if (err.type === "entity.parse.failed") return res.status(400).json({ error: "Invalid JSON body." });
  console.error(err);
  res.status(500).json({ error: "An internal error occurred." });
}

module.exports = { notFound, errorHandler };
