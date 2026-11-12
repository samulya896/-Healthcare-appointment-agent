// Initial sample bookings
const bookings = [
  {
    bookingId: "book_sample_001",
    providerId: "prov_301",
    doctorName: "Dr. Usman Ali",
    specialty: "general physician",
    patientName: "John Doe",
    patientPhone: "+92 300 1234567",
    startTime: "2026-11-14T10:00:00+05:00",
    date: "2026-11-14",
    timeSlot: "10:00",
    reason: "Routine health checkup & blood pressure review",
    calendarLink: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Doctor+Appointment+with+Dr.+Usman+Ali&dates=20261114T100000/20261114T103000&details=Routine+health+checkup&sf=true&output=xml",
    status: "Confirmed"
  }
];

module.exports = bookings;
