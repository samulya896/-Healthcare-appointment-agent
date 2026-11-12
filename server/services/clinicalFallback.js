const doctors = require("../data/doctors");
const bookings = require("../data/bookings");
const {
  findDoctorBySpecialtyTool,
  checkAvailabilityTool,
  bookAppointmentTool,
  cancelAppointmentTool,
} = require("../tools/schedulingTools");

const fallbackSessions = new Map();

/**
 * Smart rule-based clinical scheduler fallback when Gemini API key is missing or invalid.
 */
function handleClinicalFallback(sessionId, userMessage, patientContext = null) {
  let state = fallbackSessions.get(sessionId);
  if (!state) {
    state = {
      stage: "start",
      specialty: null,
      selectedDoctor: null,
      selectedDate: null,
      selectedTime: null,
      patientName: patientContext?.name || "",
      patientPhone: patientContext?.phone || "",
      reason: "",
      pendingConfirmation: null,
    };
    fallbackSessions.set(sessionId, state);
  }

  const text = userMessage.toLowerCase().trim();

  // 1. EMERGENCY CHECK
  const emergencyKeywords = [
    "chest pain",
    "heart attack",
    "can't breathe",
    "cannot breathe",
    "difficulty breathing",
    "shortness of breath",
    "sudden numbness",
    "sudden weakness",
    "paralysis",
    "unconscious",
    "stroke",
    "bleeding heavily",
    "choking"
  ];

  if (emergencyKeywords.some((k) => text.includes(k))) {
    return (
      "🚨 **EMERGENCY WARNING**: If you are experiencing a life-threatening medical emergency, please call emergency services or go to the nearest emergency room immediately.\n\n" +
      "Booking an appointment is not a substitute for urgent emergency medical care."
    );
  }

  // 2. CANCELLATION REQUEST
  if (text.includes("cancel") && (text.includes("appointment") || text.includes("booking") || state.stage === "cancel_confirm")) {
    if (state.stage === "cancel_confirm" && (text === "yes" || text.includes("yes") || text.includes("confirm"))) {
      if (state.pendingCancel) {
        const res = cancelAppointmentTool(
          state.pendingCancel.providerId,
          state.pendingCancel.startTime,
          state.pendingCancel.phone
        );
        state.stage = "start";
        state.pendingCancel = null;
        if (res.success) {
          return "Your appointment has been successfully cancelled.";
        } else {
          return res.message || "Failed to cancel the appointment.";
        }
      }
    }

    // Look for matching booking
    const phone = state.patientPhone || (patientContext?.phone) || "+92 300 1234567";
    const found = bookings.find((b) => b.patientPhone === phone || (patientContext && b.patientName === patientContext.name));

    if (found) {
      state.stage = "cancel_confirm";
      state.pendingCancel = {
        providerId: found.providerId,
        startTime: found.startTime,
        phone: found.patientPhone,
        doctorName: found.doctorName,
        date: found.date,
        timeSlot: found.timeSlot,
      };
      return `Are you sure you want to cancel your appointment with ${found.doctorName} on ${found.date} at ${found.timeSlot}? Please reply with **yes** to confirm.`;
    } else {
      return "I could not find an active appointment under your phone number to cancel. Could you please specify your phone number or appointment details?";
    }
  }

  // 3. BOOKING CONFIRMATION ("yes", "confirm")
  if (state.stage === "awaiting_confirmation") {
    if (text === "yes" || text.includes("yes") || text.includes("confirm") || text.includes("proceed")) {
      const { providerId, doctorName, date, timeSlot, patientName, patientPhone, reason } = state.pendingBooking;
      const startTime = `${date}T${timeSlot}:00+05:00`;
      const res = bookAppointmentTool(providerId, patientName, patientPhone, startTime, reason);

      state.stage = "booked";
      state.pendingBooking = null;

      if (res.success) {
        return (
          `Your appointment with **${doctorName}** has been confirmed for **${date}** at **${timeSlot}** (PKT).\n\n` +
          `Patient: ${patientName}\nPhone: ${patientPhone}\n\n` +
          `[Add to Calendar](${res.calendarLink})\n\n` +
          `Please arrive 10 minutes early. Is there anything else I can assist you with?`
        );
      } else {
        return `Booking failed: ${res.message}. Would you like to select another time slot?`;
      }
    } else {
      state.stage = "slot_selection";
      return "Booking was not confirmed. Would you like to choose a different time slot or doctor?";
    }
  }

  // 4. SLOT SELECTION
  // Check if patient selected a time (e.g. "10:00", "09:30", "14:00")
  const timeMatch = text.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/);
  if (timeMatch && state.selectedDoctor && state.selectedDate) {
    const chosenTime = `${timeMatch[1].padStart(2, "0")}:${timeMatch[2]}`;
    state.selectedTime = chosenTime;
    state.patientName = state.patientName || patientContext?.name || "Patient";
    state.patientPhone = state.patientPhone || patientContext?.phone || "+92 300 1234567";
    state.reason = state.reason || `${state.specialty || "General"} consultation`;

    state.pendingBooking = {
      providerId: state.selectedDoctor.id,
      doctorName: state.selectedDoctor.name,
      date: state.selectedDate,
      timeSlot: chosenTime,
      patientName: state.patientName,
      patientPhone: state.patientPhone,
      reason: state.reason,
    };
    state.stage = "awaiting_confirmation";

    return (
      `Please confirm your booking details:\n\n` +
      `• **Doctor**: ${state.selectedDoctor.name} (${state.selectedDoctor.specialty})\n` +
      `• **Date**: ${state.selectedDate}\n` +
      `• **Time**: ${chosenTime} (Asia/Karachi)\n` +
      `• **Patient Name**: ${state.patientName}\n` +
      `• **Phone Number**: ${state.patientPhone}\n\n` +
      `Would you like me to book this appointment? Please reply **yes** to confirm.`
    );
  }

  // 5. DATE & DOCTOR CHECK
  // Check if user specified a doctor name or date
  const foundDoctor = doctors.find((d) => text.includes(d.name.toLowerCase()) || text.includes(d.name.toLowerCase().replace("dr. ", "")));
  if (foundDoctor) {
    state.selectedDoctor = foundDoctor;
  }

  // Detect date words: "tomorrow", "day after tomorrow", "today", or YYYY-MM-DD
  let targetDate = null;
  const now = new Date();
  if (text.includes("day after tomorrow")) {
    const d = new Date(now);
    d.setDate(d.getDate() + 2);
    targetDate = d.toLocaleDateString("en-CA", { timeZone: "Asia/Karachi" });
  } else if (text.includes("tomorrow")) {
    const d = new Date(now);
    d.setDate(d.getDate() + 1);
    targetDate = d.toLocaleDateString("en-CA", { timeZone: "Asia/Karachi" });
  } else if (text.includes("today")) {
    targetDate = now.toLocaleDateString("en-CA", { timeZone: "Asia/Karachi" });
  } else {
    const dateMatch = text.match(/\b(202\d-\d{2}-\d{2})\b/);
    if (dateMatch) {
      targetDate = dateMatch[1];
    }
  }

  if (targetDate) {
    state.selectedDate = targetDate;
  }

  if (state.selectedDoctor && state.selectedDate) {
    const avail = checkAvailabilityTool(state.selectedDoctor.id, state.selectedDate);
    if (avail.success && avail.availableSlots.length > 0) {
      state.stage = "slot_selection";
      const slotList = avail.availableSlots.slice(0, 8).map((s) => `• **${s}**`).join("\n");
      return (
        `${state.selectedDoctor.name} is available on **${avail.dateLabel}**.\n\n` +
        `Available slots:\n${slotList}\n\n` +
        `Which time slot works best for you?`
      );
    } else {
      return `I checked availability for ${state.selectedDoctor.name} on ${state.selectedDate}, but there are no available slots. Would you like to check another date?`;
    }
  }

  // 6. SPECIALTY ROUTING
  let matchedSpecialty = null;

  if (text.includes("tooth") || text.includes("teeth") || text.includes("gum") || text.includes("dentist") || text.includes("cavity") || text.includes("root canal")) {
    matchedSpecialty = "dentist";
  } else if (text.includes("bone") || text.includes("fracture") || text.includes("joint") || text.includes("back pain") || text.includes("leg pain") || text.includes("knee") || text.includes("sprain") || text.includes("orthopedic")) {
    matchedSpecialty = "orthopedic";
  } else if (text.includes("period") || text.includes("pregnancy") || text.includes("women") || text.includes("gynecologist")) {
    matchedSpecialty = "gynecologist";
  } else if (text.includes("skin") || text.includes("rash") || text.includes("acne") || text.includes("hair loss") || text.includes("dermatologist")) {
    matchedSpecialty = "dermatologist";
  } else if (text.includes("heart") || text.includes("palpitation") || text.includes("blood pressure") || text.includes("cardiologist")) {
    matchedSpecialty = "cardiologist";
  } else if (text.includes("stress") || text.includes("anxiety") || text.includes("depression") || text.includes("sleep") || text.includes("mental") || text.includes("therapist")) {
    matchedSpecialty = "therapist";
  } else if (text.includes("child") || text.includes("baby") || text.includes("kid") || text.includes("pediatrician")) {
    matchedSpecialty = "pediatrician";
  } else if (text.includes("fever") || text.includes("cold") || text.includes("flu") || text.includes("cough") || text.includes("stomach") || text.includes("weakness") || text.includes("physician") || text.includes("doctor")) {
    matchedSpecialty = "general physician";
  }

  if (matchedSpecialty) {
    state.specialty = matchedSpecialty;
    state.reason = userMessage;
    const res = findDoctorBySpecialtyTool(matchedSpecialty);

    if (res.success && res.doctors.length > 0) {
      const docList = res.doctors.map((d) => `• **${d.name}**`).join("\n");
      return (
        `I suggest this type of doctor: **${matchedSpecialty}**.\n\n` +
        `We have the following doctors available:\n${docList}\n\n` +
        `Which doctor would you prefer, and what date would you like to check (e.g. "tomorrow" or "Friday")?`
      );
    }
  }

  // 7. DEFAULT HELPFUL RESPONSE
  const greeting = patientContext?.name ? `Hello ${patientContext.name}! ` : "Hello! ";
  return (
    `${greeting}I am your healthcare appointment scheduling assistant.\n\n` +
    `I can help you find a doctor, check availability, or book/cancel appointments.\n\n` +
    `You can tell me your symptoms (e.g. *"I have tooth pain"*, *"I need an orthopedic for back pain"*, *"fever and cold"*) or mention a specialty directly.`
  );
}

module.exports = { handleClinicalFallback };
