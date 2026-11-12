require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const { chat } = require("./services/geminiService");
const patients = require("./data/patients");
const bookings = require("./data/bookings");
const doctors = require("./data/doctors");
const { checkAvailabilityTool, bookAppointmentTool, cancelAppointmentTool } = require("./tools/schedulingTools");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// CORS: set CORS_ORIGINS to a comma-separated list (e.g. your Vercel URL) to restrict
// browser access. When unset, all origins are allowed (fine for local dev / demos).
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);
app.use(
  cors({
    origin: allowedOrigins.length
      ? (origin, cb) => cb(null, !origin || allowedOrigins.includes(origin))
      : true,
  })
);
app.use(express.json());

// Health check (never exposes secrets)
app.get("/api/health", (_req, res) => {
  const key = (process.env.GEMINI_API_KEY || "").trim();
  res.json({
    status: "ok",
    uptimeSeconds: Math.round(process.uptime()),
    assistantMode: key.startsWith("AIzaSy") ? "gemini" : "clinical-fallback",
  });
});

const TZ = "Asia/Karachi";
const todayKarachi = () => new Date().toLocaleDateString("en-CA", { timeZone: TZ });
const nowMinutesKarachi = () => {
  const [h, m] = new Date()
    .toLocaleTimeString("en-GB", { timeZone: TZ, hour12: false, hour: "2-digit", minute: "2-digit" })
    .split(":")
    .map(Number);
  return h * 60 + m;
};

// Slots still bookable for a date (hides dates and times that already passed).
function bookableSlots(doctor, date) {
  const slots = doctor.availableSlots[date] || [];
  const today = todayKarachi();
  if (date < today) return [];
  if (date > today) return slots;
  const now = nowMinutesKarachi();
  return slots.filter((t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m > now;
  });
}

function publicDoctor(d) {
  const availableDates = Object.keys(d.availableSlots)
    .sort()
    .filter((date) => bookableSlots(d, date).length > 0);
  const { availableSlots: _slots, ...rest } = d;
  return { ...rest, availableDates, nextAvailableDate: availableDates[0] || null };
}

// -----------------------------------------------------------------------------
// Doctors & Appointments (REST wrappers around the same tools the AI assistant uses)
// -----------------------------------------------------------------------------

// GET /api/doctors?specialty=&q=
app.get("/api/doctors", (req, res) => {
  const specialty = (req.query.specialty || "").toString().toLowerCase();
  const q = (req.query.q || "").toString().toLowerCase();
  const list = doctors
    .filter((d) => !specialty || d.specialty.toLowerCase() === specialty)
    .filter((d) => !q || d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q))
    .map(publicDoctor);
  res.json({ success: true, doctors: list });
});

// GET /api/doctors/:id
app.get("/api/doctors/:id", (req, res) => {
  const doctor = doctors.find((d) => d.id === req.params.id);
  if (!doctor) return res.status(404).json({ error: "Doctor not found." });
  res.json({ success: true, doctor: publicDoctor(doctor) });
});

// GET /api/doctors/:id/availability?date=YYYY-MM-DD
app.get("/api/doctors/:id/availability", (req, res) => {
  const doctor = doctors.find((d) => d.id === req.params.id);
  if (!doctor) return res.status(404).json({ error: "Doctor not found." });
  const date = (req.query.date || "").toString();
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

// POST /api/appointments  { patientId, providerId, date, timeSlot, reason }
app.post("/api/appointments", (req, res) => {
  const { patientId, providerId, date, timeSlot, reason } = req.body || {};
  const patient = patients.find((p) => p.id === patientId);
  if (!patient) return res.status(404).json({ error: "Patient not found." });
  if (!providerId || !date || !timeSlot) {
    return res.status(400).json({ error: "providerId, date and timeSlot are required." });
  }
  const doctor = doctors.find((d) => d.id === providerId);
  if (doctor && !bookableSlots(doctor, date).includes(timeSlot)) {
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
  const appointment = bookings.find((b) => b.bookingId === result.bookingId);
  res.status(201).json({ success: true, appointment });
});

// DELETE /api/appointments/:bookingId?patientId=
app.delete("/api/appointments/:bookingId", (req, res) => {
  const patient = patients.find((p) => p.id === req.query.patientId);
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

// -----------------------------------------------------------------------------
// Authentication Endpoints
// -----------------------------------------------------------------------------

// POST /api/auth/login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const patient = patients.find(
    (p) => p.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (!patient || patient.password !== password) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  // Return patient profile without password
  const { password: _, ...profile } = patient;
  res.json({ success: true, patient: profile });
});

// POST /api/auth/register
app.post("/api/auth/register", (req, res) => {
  const { name, email, password, phone, dob, gender, bloodGroup } = req.body;
  if (!name || !email || !password || !phone) {
    return res.status(400).json({ error: "Name, email, password, and phone are required." });
  }

  const existing = patients.find(
    (p) => p.email.toLowerCase() === email.trim().toLowerCase()
  );
  if (existing) {
    return res.status(409).json({ error: "An account with this email already exists." });
  }

  const newPatient = {
    id: `pat_${uuidv4().slice(0, 8)}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    phone: phone.trim(),
    dob: dob || "Not specified",
    age: dob ? Math.floor((new Date() - new Date(dob)) / 31557600000) : null,
    gender: gender || "Not specified",
    bloodGroup: bloodGroup || "Unknown",
    address: "Not provided",
    emergencyContact: {
      name: "Not provided",
      relation: "",
      phone: "",
    },
    commonSymptoms: [],
    pastMedicalHistory: [],
    allergies: [],
    currentMedications: [],
    immunizations: []
  };

  patients.push(newPatient);

  const { password: _, ...profile } = newPatient;
  res.status(201).json({ success: true, patient: profile });
});

// -----------------------------------------------------------------------------
// Patient Portal Endpoints
// -----------------------------------------------------------------------------

// GET /api/patient/:id
app.get("/api/patient/:id", (req, res) => {
  const patient = patients.find((p) => p.id === req.params.id);
  if (!patient) {
    return res.status(404).json({ error: "Patient not found." });
  }
  const { password: _, ...profile } = patient;
  res.json({ success: true, patient: profile });
});

// PUT /api/patient/:id - Update patient profile, symptoms, or medical history
app.put("/api/patient/:id", (req, res) => {
  const patient = patients.find((p) => p.id === req.params.id);
  if (!patient) {
    return res.status(404).json({ error: "Patient not found." });
  }

  const {
    name,
    phone,
    dob,
    gender,
    bloodGroup,
    address,
    emergencyContact,
    commonSymptoms,
    pastMedicalHistory,
    allergies,
    currentMedications,
  } = req.body;

  if (name !== undefined) patient.name = name;
  if (phone !== undefined) patient.phone = phone;
  if (dob !== undefined) {
    patient.dob = dob;
    const t = new Date(dob).getTime();
    if (!Number.isNaN(t)) patient.age = Math.floor((Date.now() - t) / 31557600000);
  }
  if (gender !== undefined) patient.gender = gender;
  if (bloodGroup !== undefined) patient.bloodGroup = bloodGroup;
  if (address !== undefined) patient.address = address;
  if (emergencyContact !== undefined) patient.emergencyContact = emergencyContact;
  if (commonSymptoms !== undefined) patient.commonSymptoms = commonSymptoms;
  if (pastMedicalHistory !== undefined) patient.pastMedicalHistory = pastMedicalHistory;
  if (allergies !== undefined) patient.allergies = allergies;
  if (currentMedications !== undefined) patient.currentMedications = currentMedications;

  const { password: _, ...profile } = patient;
  res.json({ success: true, patient: profile });
});

// GET /api/patient/:id/appointments
app.get("/api/patient/:id/appointments", (req, res) => {
  const patient = patients.find((p) => p.id === req.params.id);
  if (!patient) {
    return res.status(404).json({ error: "Patient not found." });
  }

  // Find bookings matching patient phone or patient name
  const patientBookings = bookings.filter(
    (b) =>
      (b.patientPhone && b.patientPhone.replace(/\s+/g, "") === patient.phone.replace(/\s+/g, "")) ||
      (b.patientName && b.patientName.toLowerCase() === patient.name.toLowerCase())
  );

  res.json({ success: true, appointments: patientBookings });
});

// -----------------------------------------------------------------------------
// Chat Endpoint
// -----------------------------------------------------------------------------

app.post("/api/chat", async (req, res) => {
  try {
    const { sessionId, message, patientContext } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ error: "sessionId and message are required." });
    }

    const reply = await chat(sessionId, message, patientContext);
    res.json({ response: reply, reply });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: error.message || "An internal error occurred." });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Healthcare Scheduler server running on port ${PORT}`);
  });
}

module.exports = app;
