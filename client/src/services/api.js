// Single import surface for all backend access. UI code imports from here only.
export { API_BASE, ApiError, getStoredUser, storeUser, onUnauthorized } from './http.js';
export { health as checkHealth, login, register, signOut } from './authService.js';
export { getPatient, updatePatient, getPatientAppointments } from './patientService.js';
export { getDoctors, getAvailability, bookAppointment, cancelAppointment } from './doctorService.js';
export { sendChatMessage, resetChatSession } from './chatService.js';
