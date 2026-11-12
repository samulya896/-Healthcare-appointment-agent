import { v4 as uuidv4 } from 'uuid';

// Empty in dev (Vite proxies /api). Set VITE_API_URL in production.
export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, { status = 0, network = false } = {}) {
    super(message);
    this.status = status;
    this.network = network;
  }
}

async function request(path, { method = 'GET', body, timeout = 30000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    throw new ApiError(
      err.name === 'AbortError'
        ? 'The server took too long to respond. It may be waking up — please try again in a moment.'
        : 'Cannot reach the server. Check your connection or try again shortly.',
      { network: true }
    );
  } finally {
    clearTimeout(timer);
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(data?.error || `Request failed (${res.status})`, { status: res.status });
  }
  return data;
}

// ---- Session user (existing localStorage mechanism) ----
const USER_KEY = 'hc_patient_user';
export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
export function storeUser(user) {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  } catch {
    /* storage unavailable */
  }
}

// ---- Health ----
export const checkHealth = () => request('/api/health', { timeout: 45000 });

// ---- Auth ----
export const login = (email, password) =>
  request('/api/auth/login', { method: 'POST', body: { email, password } }).then((d) => d.patient);
export const register = (payload) =>
  request('/api/auth/register', { method: 'POST', body: payload }).then((d) => d.patient);

// ---- Patient ----
export const getPatient = (id) => request(`/api/patient/${id}`).then((d) => d.patient);
export const updatePatient = (id, updates) =>
  request(`/api/patient/${id}`, { method: 'PUT', body: updates }).then((d) => d.patient);
export const getPatientAppointments = (id) =>
  request(`/api/patient/${id}/appointments`).then((d) => d.appointments || []);

// ---- Doctors & appointments ----
export const getDoctors = () => request('/api/doctors').then((d) => d.doctors || []);
export const getAvailability = (doctorId, date) =>
  request(`/api/doctors/${doctorId}/availability?date=${encodeURIComponent(date)}`);
export const bookAppointment = (payload) =>
  request('/api/appointments', { method: 'POST', body: payload }).then((d) => d.appointment);
export const cancelAppointment = (bookingId, patientId) =>
  request(`/api/appointments/${bookingId}?patientId=${encodeURIComponent(patientId)}`, {
    method: 'DELETE',
  });

// ---- Chat ----
let sessionId = uuidv4();
export const resetChatSession = () => {
  sessionId = uuidv4();
};
export async function sendChatMessage(message, patientContext) {
  const data = await request('/api/chat', {
    method: 'POST',
    body: { sessionId, message, patientContext },
    timeout: 90000,
  });
  return data?.response || data?.reply || 'No response received.';
}
