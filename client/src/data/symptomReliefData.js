export const symptomReliefGuides = [
  {
    id: 'fever_cold',
    title: 'Fever, Cold & Sore Throat',
    specialty: 'general physician',
    icon: '🤒',
    description: 'Elevated body temperature, runny nose, body aches, or scratchy throat.',
    otcSuggestions: [
      {
        name: 'Paracetamol / Acetaminophen (500mg)',
        purpose: 'Helps lower fever and relieve mild-to-moderate body aches and headache.',
        notes: 'Follow package dosage instructions. Do not exceed 4000mg in 24 hours.'
      },
      {
        name: 'Saline Nasal Drops / Spray',
        purpose: 'Naturally thins mucus and relieves nasal congestion without drug side effects.',
        notes: 'Safe for frequent use throughout the day.'
      },
      {
        name: 'Throat Lozenges / Warm Honey-Lemon Water',
        purpose: 'Soothes throat irritation and temporary cough tickles.',
        notes: 'Drink plenty of warm broths, herbal teas, and water.'
      }
    ],
    homeCareTips: [
      'Get ample bed rest to allow your immune system to fight off infection.',
      'Stay thoroughly hydrated with water, warm soups, and electrolyte fluids.',
      'Use a cool-mist humidifier or take steam inhalations to clear airways.'
    ],
    redFlags: [
      'Fever exceeding 103°F (39.4°C) or lasting more than 3 consecutive days.',
      'Difficulty breathing, chest tightness, or persistent wheezing.',
      'Inability to swallow liquids or keep fluids down.'
    ]
  },
  {
    id: 'tooth_pain',
    title: 'Toothache & Gum Discomfort',
    specialty: 'dentist',
    icon: '🦷',
    description: 'Sharp or throbbing tooth pain, gum swelling, or sensitivity to hot/cold.',
    otcSuggestions: [
      {
        name: 'Paracetamol / Acetaminophen',
        purpose: 'Temporary pain relief until professional dental care is received.',
        notes: 'Avoid placing aspirin directly on the gums as it can burn gum tissue.'
      },
      {
        name: 'Warm Salt Water Rinse',
        purpose: 'Natural disinfectant; helps reduce swelling and cleans oral debris.',
        notes: 'Dissolve 1/2 teaspoon of salt in a glass of warm water. Swish for 30s and spit.'
      },
      {
        name: 'Topical Benzocaine Gel (or Clove Oil / Eugenol)',
        purpose: 'Temporary numbing of irritated gum tissue around a sore tooth.',
        notes: 'Apply sparingly with a clean cotton swab directly to the affected area.'
      }
    ],
    homeCareTips: [
      'Gently floss around the sore tooth to dislodge trapped food particles.',
      'Apply an ice pack wrapped in a cloth to the outside cheek for 15 minutes.',
      'Avoid very hot, icy, acidic, or extremely sweet foods and drinks.'
    ],
    redFlags: [
      'Visible swelling spreading into the cheek, jaw, or eye area.',
      'Fever or general malaise accompanying tooth pain.',
      'Difficulty swallowing or breathing (potential spreading dental abscess).'
    ]
  },
  {
    id: 'headache',
    title: 'Tension Headache & Mild Migraine',
    specialty: 'general physician',
    icon: '🤕',
    description: 'Dull ache around the forehead or temples, or throbbing headache.',
    otcSuggestions: [
      {
        name: 'Paracetamol (Acetaminophen) / Ibuprofen',
        purpose: 'First-line relief for tension headaches and mild migraines.',
        notes: 'Caution: If you have aspirin/NSAID allergies or stomach ulcers, use Paracetamol instead of Ibuprofen.'
      },
      {
        name: 'Oral Electrolytes & Hydration Packets',
        purpose: 'Dehydration is one of the most common headache triggers.',
        notes: 'Drink a tall glass of water or electrolyte drink immediately at onset.'
      }
    ],
    homeCareTips: [
      'Rest in a dark, quiet, well-ventilated room with eyes closed.',
      'Apply a cool gel pack to the forehead or warm compress to the back of the neck.',
      'Perform gentle neck stretches and massage tight shoulder muscles.'
    ],
    redFlags: [
      'Sudden "thunderclap" headache reaching maximum severity in seconds.',
      'Headache accompanied by stiff neck, high fever, or confusion.',
      'Headache following a head injury or accompanied by vision loss/numbness.'
    ]
  },
  {
    id: 'joint_back_pain',
    title: 'Joint, Sprain & Lower Back Pain',
    specialty: 'orthopedic',
    icon: '🦴',
    description: 'Musculoskeletal stiffness, muscle strain, or joint tenderness.',
    otcSuggestions: [
      {
        name: 'Topical Pain Relief Gel (Diclofenac / Menthol / Arnica)',
        purpose: 'Targeted local relief without heavy systemic absorption.',
        notes: 'Apply 3-4 times daily over the painful area. Wash hands after use.'
      },
      {
        name: 'Paracetamol / Mild OTC Analgesic',
        purpose: 'Systemic relief for musculoskeletal inflammation and aches.',
        notes: 'Use as directed on package.'
      }
    ],
    homeCareTips: [
      'Follow the R.I.C.E. method for acute sprains: Rest, Ice (15-20m), Compression, Elevation.',
      'For lower back stiffness, avoid prolonged bed rest. Take short gentle walks.',
      'Use ergonomic lumbar support while seated and avoid heavy lifting.'
    ],
    redFlags: [
      'Inability to bear any weight on the affected limb.',
      'Visible bone deformity or extreme joint swelling.',
      'Numbness, tingling, or loss of bowel/bladder sensation (spinal emergency).'
    ]
  },
  {
    id: 'stomach_acidity',
    title: 'Acid Reflux, Indigestion & Stomach Upset',
    specialty: 'general physician',
    icon: '🫄',
    description: 'Heartburn, sour stomach, mild bloating, or nausea after meals.',
    otcSuggestions: [
      {
        name: 'Antacid Chewables (Calcium Carbonate / Magnesium Hydroxide)',
        purpose: 'Quickly neutralizes excess stomach acid to relieve heartburn.',
        notes: 'Take 1-2 tablets after meals or at onset of heartburn as directed.'
      },
      {
        name: 'Oral Rehydration Salts (ORS)',
        purpose: 'Replenishes vital fluid, potassium, and sodium during diarrhea or nausea.',
        notes: 'Mix 1 sachet in clean drinking water and sip gradually.'
      },
      {
        name: 'Ginger or Peppermint Tea',
        purpose: 'Natural stomach soother for mild nausea and digestive spasm.',
        notes: 'Sip warm tea slowly.'
      }
    ],
    homeCareTips: [
      'Eat smaller, more frequent meals rather than large heavy dinners.',
      'Avoid lying down for at least 2 to 3 hours after eating.',
      'Cut back on caffeine, carbonated drinks, citrus, and heavily fried foods.'
    ],
    redFlags: [
      'Severe, sudden, or rigid abdominal pain (potential appendicitis/perforation).',
      'Persistent vomiting lasting over 24 hours, or blood in vomit/stool.',
      'Unexplained significant weight loss or difficulty swallowing.'
    ]
  },
  {
    id: 'skin_rash',
    title: 'Skin Irritation, Itching & Acne',
    specialty: 'dermatologist',
    icon: '🧴',
    description: 'Mild rash, insect bites, contact irritation, or skin breakouts.',
    otcSuggestions: [
      {
        name: 'Calamine Lotion / 1% Hydrocortisone Cream',
        purpose: 'Soothes intense itching and calms mild contact dermatitis or bug bites.',
        notes: 'Apply a thin layer to clean dry skin 2-3 times daily for up to 7 days.'
      },
      {
        name: 'Gentle Ceramide Moisturizing Lotion',
        purpose: 'Restores the damaged skin barrier and prevents dryness/flaking.',
        notes: 'Use fragrance-free, hypoallergenic formulations.'
      },
      {
        name: 'Benzoyl Peroxide 2.5% or Salicylic Acid Cleanser',
        purpose: 'Over-the-counter treatment for mild facial or back acne.',
        notes: 'Start once daily to avoid excessive skin peeling or dryness.'
      }
    ],
    homeCareTips: [
      'Take short, lukewarm showers rather than hot baths which strip skin oils.',
      'Wear loose, breathable 100% cotton clothing over affected areas.',
      'Avoid scratching irritated skin to prevent secondary bacterial infections.'
    ],
    redFlags: [
      'Rapidly spreading rash accompanied by fever, facial swelling, or breathing difficulty.',
      'Painful blisters, peeling skin, or open weeping lesions.',
      'Signs of bacterial infection like spreading warmth, redness, or yellow pus.'
    ]
  },
  {
    id: 'stress_anxiety',
    title: 'Stress, Restlessness & Mild Insomnia',
    specialty: 'therapist',
    icon: '🧘',
    description: 'Emotional overwhelm, muscle tension, or difficulty falling asleep.',
    otcSuggestions: [
      {
        name: 'Chamomile or Lavender Herbal Infusions',
        purpose: 'Natural relaxation aid to calm evening nerves and promote sleep onset.',
        notes: 'Drink a warm cup 45 minutes before intended sleep time.'
      },
      {
        name: 'Melatonin (1mg - 3mg)',
        purpose: 'Short-term support to regulate disrupted circadian rhythms or jet lag.',
        notes: 'Use the lowest effective dose. Not intended for long-term dependence.'
      }
    ],
    homeCareTips: [
      'Practice the 4-7-8 breathing method: Inhale 4s, hold 7s, exhale slowly 8s.',
      'Turn off phone screens, tablets, and computers at least 1 hour before bed.',
      'Keep a daytime "worry journal" to write down thoughts before resting.'
    ],
    redFlags: [
      'Severe panic attacks with chest pain (always rule out cardiac causes first).',
      'Prolonged clinical depression impairing basic daily self-care.',
      'Thoughts of self-harm or hopelessness (Immediately reach out to emergency services).'
    ]
  }
];
