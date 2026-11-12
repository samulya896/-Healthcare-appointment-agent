const router = require("express").Router();
const patients = require("../data/patients");
const bookings = require("../data/bookings");
const doctors = require("../data/doctors");
const { requireAuth, ownsPatient } = require("../middleware/security");
const { bookAppointmentTool, cancelAppointmentTool } = require("../tools/schedulingTools");
const { bookableSlots } = require("../utils/time");
const { isStr } = require("../utils/validate");

router.use(requireAuth);

// POST /api/appointments  { providerId, date, timeSlot, reason }  (patient = signed-in user)
router.post("/", ownsPatient((req) => req.body && req.body.patientId), (req, res) => {
  const { providerId, date, timeSlot, reason } = req.body || {};
  const patient = patients.find((p) => p.id === req.userId);
  if (!patient) return res.status(404).json({ error: "Patient not found." });
  if (!providerId || !date || !timeSlot) {
    return res.status(400).json({ error: "providerId, date and timeSlot are required." });
  }
  if (![providerId, date, timeSlot].every((v) => isStr(v, 40)) || (reason !== undefined && !isStr(reason, 300))) {
    return res.status(400).json({ error: "Invalid booking details." });
  }
  const doctor = doctors.find((d) => d.id === providerId);
  if (!doctor) return res.status(404).json({ error: "Doctor not found." });
  if (!bookableSlots(doctor, date).includes(timeSlot)) {
    return res.status(409).json({ error: "That time slot is no longer available. Please pick another." });
  }
  const result = bookAppointmentTool(
    providerId,
    patient.name,
    patient.phone,
    `${date}T${timeSlot}:00+05:00`,
    (reason || "").trim() || "General consultation"
  );
  if (!result.success) return res.status(409).json({ error: result.message });
  res.status(201).json({ success: true, appointment: bookings.find((b) => b.bookingId === result.bookingId) });
});

// DELETE /api/appointments/:bookingId?patientId=
router.delete("/:bookingId", ownsPatient((req) => req.query.patientId), (req, res) => {
  const patient = patients.find((p) => p.id === req.userId);
  if (!patient) return res.status(404).json({ error: "Patient not found." });
  const booking = bookings.find((b) => b.bookingId === req.params.bookingId);
  if (!booking) return res.status(404).json({ error: "Appointment not found." });
  if (booking.patientPhone !== patient.phone) {
    return res.status(403).json({ error: "This appointment belongs to another patient." });
  }
  const result = cancelAppointmentTool(booking.providerId, booking.startTime, booking.patientPhone);
  if (!result.success) return res.status(409).json({ error: result.message });
  res.json({ success: true, message: result.message });
});

module.exports = router;
