require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const { chat } = require("./services/geminiService");
const patients = require("./data/patients");
const bookings = require("./data/bookings");
const doctors = require("./data/doctors");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
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
    age: dob ? Math.floor((new Date() - new Date(dob)) / 31557600000) : 30,
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
  if (dob !== undefined) patient.dob = dob;
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

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
      const msg = "⚠️ **Gemini API Key Missing**: Please add your Gemini API key to `server/.env` (e.g. `GEMINI_API_KEY=AIzaSy...`) and restart the server to chat with the assistant.";
      return res.json({ response: msg, reply: msg });
    }

    const reply = await chat(sessionId, message, patientContext);
    res.json({ response: reply, reply });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: error.message || "An internal error occurred." });
  }
});

app.listen(PORT, () => {
  console.log(`Healthcare Scheduler server running on port ${PORT}`);
});
