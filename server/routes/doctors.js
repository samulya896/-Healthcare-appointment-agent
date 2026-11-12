const router = require("express").Router();
const doctors = require("../data/doctors");
const { checkAvailabilityTool } = require("../tools/schedulingTools");
const { bookableSlots } = require("../utils/time");

function publicDoctor(d) {
  const availableDates = Object.keys(d.availableSlots)
    .sort()
    .filter((date) => bookableSlots(d, date).length > 0);
  const { availableSlots: _slots, ...rest } = d;
  return { ...rest, availableDates, nextAvailableDate: availableDates[0] || null };
}

// GET /api/doctors?specialty=&q=
router.get("/", (req, res) => {
  const specialty = String(req.query.specialty || "").toLowerCase();
  const q = String(req.query.q || "").toLowerCase();
  const list = doctors
    .filter((d) => !specialty || d.specialty.toLowerCase() === specialty)
    .filter((d) => !q || d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q))
    .map(publicDoctor);
  res.json({ success: true, doctors: list });
});

// GET /api/doctors/:id
router.get("/:id", (req, res) => {
  const doctor = doctors.find((d) => d.id === req.params.id);
  if (!doctor) return res.status(404).json({ error: "Doctor not found." });
  res.json({ success: true, doctor: publicDoctor(doctor) });
});

// GET /api/doctors/:id/availability?date=YYYY-MM-DD
router.get("/:id/availability", (req, res) => {
  const doctor = doctors.find((d) => d.id === req.params.id);
  if (!doctor) return res.status(404).json({ error: "Doctor not found." });
  const date = String(req.query.date || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: "date query parameter (YYYY-MM-DD) is required." });
  }
  const info = checkAvailabilityTool(doctor.id, date);
  res.json({
    success: true,
    providerId: doctor.id,
    doctorName: doctor.name,
    date,
    dateLabel: info.dateLabel || date,
    availableSlots: bookableSlots(doctor, date),
  });
});

module.exports = router;
