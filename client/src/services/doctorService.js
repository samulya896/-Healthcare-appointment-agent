import { request } from './http.js';

export const getDoctors = () => request('/api/doctors').then((d) => d.doctors || []);

export const getAvailability = (doctorId, date) =>
  request(`/api/doctors/${doctorId}/availability?date=${encodeURIComponent(date)}`);

export const bookAppointment = (payload) =>
  request('/api/appointments', { method: 'POST', body: payload }).then((d) => d.appointment);

export const cancelAppointment = (bookingId, patientId) =>
  request(`/api/appointments/${bookingId}?patientId=${encodeURIComponent(patientId)}`, { method: 'DELETE' });
