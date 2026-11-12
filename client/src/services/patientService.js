import { request } from './http.js';

export const getPatient = (id) => request(`/api/patient/${id}`).then((d) => d.patient);

export const updatePatient = (id, updates) =>
  request(`/api/patient/${id}`, { method: 'PUT', body: updates }).then((d) => d.patient);

export const getPatientAppointments = (id) =>
  request(`/api/patient/${id}/appointments`).then((d) => d.appointments || []);
