const router = require("express").Router();
const patients = require("../data/patients");
const bookings = require("../data/bookings");
const { requireAuth, ownsPatient } = require("../middleware/security");
const { isPhone, isStr, cleanList, ageFromDob } = require("../utils/validate");
const { toProfile } = require("../utils/patient");

// Every patient route requires a valid session and may only touch the signed-in patient's record.
router.use("/:id", requireAuth, ownsPatient((req) => req.params.id));

const findPatient = (req, res) => {
  const patient = patients.find((p) => p.id === req.params.id);
  if (!patient) res.status(404).json({ error: "Patient not found." });
  return patient;
};

// GET /api/patient/:id
router.get("/:id", (req, res) => {
  const patient = findPatient(req, res);
  if (patient) res.json({ success: true, patient: toProfile(patient) });
});

const LIST_FIELDS = ["commonSymptoms", "pastMedicalHistory", "allergies", "currentMedications"];

// PUT /api/patient/:id - update profile, symptoms or medical history
router.put("/:id", (req, res) => {
  const patient = findPatient(req, res);
  if (!patient) return;
  const body = req.body || {};
  const updates = {};

  if (body.name !== undefined) {
    if (!isStr(body.name, 100) || !body.name.trim()) return res.status(400).json({ error: "Enter a valid name." });
    updates.name = body.name.trim();
  }
  if (body.phone !== undefined) {
    if (!isPhone(body.phone)) return res.status(400).json({ error: "Enter a valid phone number." });
    updates.phone = body.phone.trim();
  }
  for (const f of ["gender", "bloodGroup", "address"]) {
    if (body[f] !== undefined) {
      if (!isStr(body[f], 300)) return res.status(400).json({ error: `Invalid ${f}.` });
      updates[f] = body[f].trim();
    }
  }
  if (body.dob !== undefined) {
    if (!isStr(body.dob, 10)) return res.status(400).json({ error: "Invalid date of birth." });
    updates.dob = body.dob;
    const age = ageFromDob(body.dob);
    if (age !== null) updates.age = age;
  }
  if (body.emergencyContact !== undefined) {
    const ec = body.emergencyContact;
    const ok = ec && typeof ec === "object" && [ec.name, ec.relation, ec.phone].every((v) => v === undefined || isStr(v, 100));
    if (!ok) return res.status(400).json({ error: "Invalid emergency contact." });
    updates.emergencyContact = { name: ec.name || "", relation: ec.relation || "", phone: ec.phone || "" };
  }
  for (const f of LIST_FIELDS) {
    if (body[f] !== undefined) {
      const list = cleanList(body[f]);
      if (!list) return res.status(400).json({ error: `Invalid ${f}.` });
      updates[f] = list;
    }
  }

  Object.assign(patient, updates);
  res.json({ success: true, patient: toProfile(patient) });
});

// GET /api/patient/:id/appointments
router.get("/:id/appointments", (req, res) => {
  const patient = findPatient(req, res);
  if (!patient) return;
  const norm = (s) => (s || "").replace(/\s+/g, "");
  const mine = bookings.filter(
    (b) =>
      (b.patientPhone && norm(b.patientPhone) === norm(patient.phone)) ||
      (b.patientName && b.patientName.toLowerCase() === patient.name.toLowerCase())
  );
  res.json({ success: true, appointments: mine });
});

module.exports = router;
