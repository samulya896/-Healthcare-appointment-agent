const doctors = require("../data/doctors");
const bookings = require("../data/bookings");
const { v4: uuidv4 } = require("uuid");

/**
 * Find doctors by specialty (case-insensitive).
 */
function findDoctorBySpecialtyTool(specialty) {
  const matches = doctors.filter(
    (d) => d.specialty.toLowerCase() === specialty.toLowerCase()
  );
  if (matches.length === 0) {
    return { success: false, message: `No doctors found for specialty: ${specialty}` };
  }
  return {
    success: true,
    doctors: matches.map((d) => ({ id: d.id, name: d.name, specialty: d.specialty })),
  };
}

/**
 * Check available slots for a given doctor on a given date.
 */
function checkAvailabilityTool(providerId, date) {
  const doctor = doctors.find((d) => d.id === providerId);
  if (!doctor) {
    return { success: false, message: `Doctor with ID ${providerId} not found.` };
  }

  const slots = doctor.availableSlots[date];
  if (!slots || slots.length === 0) {
    return {
      success: false,
      message: `No available slots for ${doctor.name} on ${date}.`,
    };
  }

  // Build dateLabel like "Thursday, 12 November 2026"
  const dateObj = new Date(date + "T00:00:00+05:00");
  const options = { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Karachi" };
  const dateLabel = dateObj.toLocaleDateString("en-GB", options);

  return {
    success: true,
    providerId,
    doctorName: doctor.name,
    date,
    dateLabel,
    availableSlots: slots,
  };
}

/**
 * Book an appointment.
 */
function bookAppointmentTool(providerId, patientName, patientPhone, startTime, reason) {
  const doctor = doctors.find((d) => d.id === providerId);
  if (!doctor) {
    return { success: false, message: `Doctor with ID ${providerId} not found.` };
  }

  // Extract date and time directly from ISO string (YYYY-MM-DDTHH:mm:ss+05:00)
  const dateStr = startTime.slice(0, 10); // YYYY-MM-DD
  const timeSlot = startTime.slice(11, 16); // HH:mm
  const [hours, minutes] = timeSlot.split(":");

  const slots = doctor.availableSlots[dateStr];
  if (!slots) {
    return { success: false, message: `No slots available for ${doctor.name} on ${dateStr}.` };
  }

  const slotIndex = slots.indexOf(timeSlot);
  if (slotIndex === -1) {
    return {
      success: false,
      message: `The ${timeSlot} slot on ${dateStr} is not available for ${doctor.name}.`,
    };
  }

  // Remove slot
  slots.splice(slotIndex, 1);

  const bookingId = uuidv4();

  // Build Google Calendar link (30-min appointment)
  const calStart = dateStr.replace(/-/g, "") + "T" + timeSlot.replace(":", "") + "00";
  const endMinutes = parseInt(minutes, 10) + 30;
  const endHours = parseInt(hours, 10) + Math.floor(endMinutes / 60);
  const endMins = endMinutes % 60;
  const calEnd =
    dateStr.replace(/-/g, "") +
    "T" +
    String(endHours).padStart(2, "0") +
    String(endMins).padStart(2, "0") +
    "00";

  const calendarLink =
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent("Doctor Appointment with " + doctor.name)}` +
    `&dates=${calStart}/${calEnd}` +
    `&details=${encodeURIComponent(reason)}` +
    `&sf=true&output=xml`;

  // Store booking
  bookings.push({
    bookingId,
    providerId,
    doctorName: doctor.name,
    patientName,
    patientPhone,
    startTime,
    date: dateStr,
    timeSlot,
    reason,
    calendarLink,
  });

  return {
    success: true,
    bookingId,
    message: "Appointment booked successfully",
    calendarLink,
  };
}

/**
 * Cancel an existing appointment.
 */
function cancelAppointmentTool(providerId, startTime, patientPhone) {
  const bookingIndex = bookings.findIndex(
    (b) =>
      b.providerId === providerId &&
      b.startTime === startTime &&
      b.patientPhone === patientPhone
  );

  if (bookingIndex === -1) {
    return { success: false, message: "No matching appointment found to cancel." };
  }

  const booking = bookings[bookingIndex];

  // Restore the slot
  const doctor = doctors.find((d) => d.id === providerId);
  if (doctor && doctor.availableSlots[booking.date]) {
    doctor.availableSlots[booking.date].push(booking.timeSlot);
    doctor.availableSlots[booking.date].sort();
  }

  // Remove booking
  bookings.splice(bookingIndex, 1);

  return { success: true, message: "Appointment cancelled successfully" };
}

module.exports = {
  findDoctorBySpecialtyTool,
  checkAvailabilityTool,
  bookAppointmentTool,
  cancelAppointmentTool,
};
