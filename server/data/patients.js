// In-memory patient database with sample patients
const patients = [
  {
    id: "pat_001",
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    phone: "+92 300 1234567",
    dob: "1990-05-14",
    age: 34,
    gender: "Male",
    bloodGroup: "B+",
    address: "Apartment 4B, Gulberg Heights, Lahore",
    emergencyContact: {
      name: "Sarah Doe",
      relation: "Spouse",
      phone: "+92 300 7654321",
    },
    commonSymptoms: [
      "Occasional seasonal wheezing in cold weather",
      "Lower back stiffness after prolonged desk work",
      "Mild tension headaches"
    ],
    pastMedicalHistory: [
      "Mild Bronchial Asthma (Diagnosed 2015)",
      "Essential Hypertension (Well-controlled)",
      "Appendectomy (Laparoscopic, 2018)",
      "Right Ankle Sprain (2021, resolved)"
    ],
    allergies: [
      "Penicillin (Causes hives/rash)",
      "Peanuts (Mild allergy)",
      "Sulfa drugs"
    ],
    currentMedications: [
      "Albuterol Sulfate Inhaler (90mcg, 2 puffs PRN for wheezing)",
      "Lisinopril (10mg oral tablet, once daily in morning)",
      "Vitamin D3 (2000 IU daily)"
    ],
    immunizations: [
      "COVID-19 (3 doses completed)",
      "Tetanus Toxoid Booster (2022)",
      "Annual Influenza (2025)"
    ]
  },
  {
    id: "pat_002",
    name: "Ayesha Khan",
    email: "ayesha@example.com",
    password: "password123",
    phone: "+92 301 9876543",
    dob: "1996-08-22",
    age: 28,
    gender: "Female",
    bloodGroup: "O+",
    address: "House 12, Street 5, DHA Phase 5, Karachi",
    emergencyContact: {
      name: "Bilal Khan",
      relation: "Brother",
      phone: "+92 301 5551234",
    },
    commonSymptoms: [
      "Frequent migraine headaches with light sensitivity",
      "Allergic rhinitis and morning sneezing",
      "Fatigue when iron levels are low"
    ],
    pastMedicalHistory: [
      "Migraine with Aura (Diagnosed 2019)",
      "Iron Deficiency Anemia (Intermittent, managed with supplements)",
      "Wisdom Teeth Extraction (2020)"
    ],
    allergies: [
      "Dust mites & pollen",
      "Aspirin / NSAIDs (Causes stomach upset)"
    ],
    currentMedications: [
      "Sumatriptan (50mg as needed for acute migraine onset)",
      "Ferrous Sulfate (200mg once daily with food)",
      "Cetirizine (10mg as needed for seasonal allergies)"
    ],
    immunizations: [
      "COVID-19 (3 doses completed)",
      "Hepatitis B (Complete course)",
      "Annual Influenza (2025)"
    ]
  }
];


// Seed accounts use the demo password "password123"; store it hashed like real registrations.
const { hashPassword } = require("../utils/password");
for (const p of patients) p.password = hashPassword(p.password);
module.exports = patients;
