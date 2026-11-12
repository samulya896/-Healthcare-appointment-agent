const crypto = require("crypto");
const router = require("express").Router();
const patients = require("../data/patients");
const { hashPassword, verifyPassword } = require("../utils/password");
const { issueToken } = require("../utils/token");
const { isEmail, isPhone, isStr, ageFromDob } = require("../utils/validate");
const { toProfile } = require("../utils/patient");

// POST /api/auth/login  -> { success, patient, token }
router.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Email and password are required." });
  if (!isStr(email, 254) || !isStr(password, 200)) {
    return res.status(400).json({ error: "Invalid credentials format." });
  }

  const patient = patients.find((p) => p.email.toLowerCase() === email.trim().toLowerCase());
  if (!patient || !verifyPassword(password, patient.password)) {
    return res.status(401).json({ error: "Invalid email or password." });
  }
  res.json({ success: true, patient: toProfile(patient), token: issueToken(patient.id) });
});

// POST /api/auth/register  -> { success, patient, token }
router.post("/register", (req, res) => {
  const { name, email, password, phone, dob, gender, bloodGroup } = req.body || {};
  if (!name || !email || !password || !phone) {
    return res.status(400).json({ error: "Name, email, password, and phone are required." });
  }
  if (!isStr(name, 100) || !name.trim()) return res.status(400).json({ error: "Enter a valid name." });
  if (!isEmail(email)) return res.status(400).json({ error: "Enter a valid email address." });
  if (!isPhone(phone)) return res.status(400).json({ error: "Enter a valid phone number." });
  if (!isStr(password, 200) || password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }
  if (patients.some((p) => p.email.toLowerCase() === email.trim().toLowerCase())) {
    return res.status(409).json({ error: "An account with this email already exists." });
  }

  const patient = {
    id: `pat_${crypto.randomUUID().slice(0, 8)}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: hashPassword(password),
    phone: phone.trim(),
    dob: isStr(dob, 10) && dob ? dob : "Not specified",
    age: dob ? ageFromDob(dob) : null,
    gender: isStr(gender, 20) && gender ? gender : "Not specified",
    bloodGroup: isStr(bloodGroup, 5) && bloodGroup ? bloodGroup : "Unknown",
    address: "Not provided",
    emergencyContact: { name: "Not provided", relation: "", phone: "" },
    commonSymptoms: [],
    pastMedicalHistory: [],
    allergies: [],
    currentMedications: [],
    immunizations: [],
  };
  patients.push(patient);
  res.status(201).json({ success: true, patient: toProfile(patient), token: issueToken(patient.id) });
});

module.exports = router;
