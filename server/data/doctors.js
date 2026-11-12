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


// Demo seed profile details (qualifications, experience, fee). Illustrative data for the hackathon demo.
const profiles = {
  prov_101: { qualifications: "MBBS, FCPS (Orthopaedic Surgery)", experienceYears: 14, consultationFee: 3500 },
  prov_102: { qualifications: "MBBS, MS (Orthopaedics)", experienceYears: 9, consultationFee: 3000 },
  prov_201: { qualifications: "MBBS, FCPS (Obstetrics & Gynaecology)", experienceYears: 12, consultationFee: 3500 },
  prov_202: { qualifications: "MBBS, MRCOG", experienceYears: 8, consultationFee: 3000 },
  prov_301: { qualifications: "MBBS, MRCGP", experienceYears: 15, consultationFee: 2000 },
  prov_302: { qualifications: "MBBS, FCPS (Family Medicine)", experienceYears: 7, consultationFee: 1800 },
  prov_401: { qualifications: "BDS, MDS (Oral Surgery)", experienceYears: 10, consultationFee: 2500 },
  prov_402: { qualifications: "BDS, FCPS (Orthodontics)", experienceYears: 6, consultationFee: 2200 },
  prov_501: { qualifications: "MBBS, FCPS (Dermatology)", experienceYears: 11, consultationFee: 3000 },
  prov_502: { qualifications: "MBBS, MCPS (Dermatology)", experienceYears: 5, consultationFee: 2500 },
  prov_601: { qualifications: "MBBS, FCPS (Cardiology)", experienceYears: 18, consultationFee: 4500 },
  prov_602: { qualifications: "MBBS, MD (Cardiology)", experienceYears: 10, consultationFee: 4000 },
  prov_701: { qualifications: "MSc Clinical Psychology, PhD", experienceYears: 12, consultationFee: 3000 },
  prov_702: { qualifications: "MPhil Clinical Psychology", experienceYears: 6, consultationFee: 2500 },
  prov_801: { qualifications: "MBBS, FCPS (Paediatrics)", experienceYears: 13, consultationFee: 2500 },
  prov_802: { qualifications: "MBBS, DCH, MRCPCH", experienceYears: 8, consultationFee: 2200 },
};

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

for (const d of doctors) Object.assign(d, profiles[d.id]);

module.exports = doctors;
