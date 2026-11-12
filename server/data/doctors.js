// Generate available slots for 2026-11-12 through 2026-11-20 and next 14 days
function generateSlots() {
  const slots = {};
  const times = [
    "09:00", "09:30", "10:00", "10:30", "11:00",
    "14:00", "14:30", "15:00", "15:30", "16:00"
  ];
  const now = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    const dateStr = d.toLocaleDateString("en-CA", { timeZone: "Asia/Karachi" });
    slots[dateStr] = [...times];
  }
  for (let d = 12; d <= 20; d++) {
    const dateStr = `2026-11-${String(d).padStart(2, "0")}`;
    slots[dateStr] = [...times];
  }
  return slots;
}

const doctors = [
  // Orthopedic (2)
  { id: "prov_101", name: "Dr. Ahmed Khan", specialty: "orthopedic", availableSlots: generateSlots() },
  { id: "prov_102", name: "Dr. Fatima Rizvi", specialty: "orthopedic", availableSlots: generateSlots() },

  // Gynecologist (2)
  { id: "prov_201", name: "Dr. Sana Malik", specialty: "gynecologist", availableSlots: generateSlots() },
  { id: "prov_202", name: "Dr. Hina Javed", specialty: "gynecologist", availableSlots: generateSlots() },

  // General Physician (2)
  { id: "prov_301", name: "Dr. Usman Ali", specialty: "general physician", availableSlots: generateSlots() },
  { id: "prov_302", name: "Dr. Ayesha Siddiqui", specialty: "general physician", availableSlots: generateSlots() },

  // Dentist (2)
  { id: "prov_401", name: "Dr. Bilal Hussain", specialty: "dentist", availableSlots: generateSlots() },
  { id: "prov_402", name: "Dr. Nadia Qureshi", specialty: "dentist", availableSlots: generateSlots() },

  // Dermatologist (2)
  { id: "prov_501", name: "Dr. Zainab Shah", specialty: "dermatologist", availableSlots: generateSlots() },
  { id: "prov_502", name: "Dr. Kamran Iqbal", specialty: "dermatologist", availableSlots: generateSlots() },

  // Cardiologist (2)
  { id: "prov_601", name: "Dr. Tariq Mehmood", specialty: "cardiologist", availableSlots: generateSlots() },
  { id: "prov_602", name: "Dr. Rabia Anwar", specialty: "cardiologist", availableSlots: generateSlots() },

  // Therapist (2)
  { id: "prov_701", name: "Dr. Saad Raza", specialty: "therapist", availableSlots: generateSlots() },
  { id: "prov_702", name: "Dr. Mehreen Aslam", specialty: "therapist", availableSlots: generateSlots() },

  // Pediatrician (2)
  { id: "prov_801", name: "Dr. Imran Farooq", specialty: "pediatrician", availableSlots: generateSlots() },
  { id: "prov_802", name: "Dr. Amna Yousuf", specialty: "pediatrician", availableSlots: generateSlots() },
];

module.exports = doctors;
