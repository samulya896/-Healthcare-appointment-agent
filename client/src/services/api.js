import { v4 as uuidv4 } from 'uuid';

let sessionId = uuidv4();

export function getSessionId() {
  return sessionId;
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem('hc_patient_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function setCurrentUser(user) {
  if (user) {
    localStorage.setItem('hc_patient_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('hc_patient_user');
  }
}

export async function login(email, password) {
  let res;
  try {
    res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  } catch (err) {
    throw new Error('Cannot connect to backend server. Ensure backend is running.');
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || 'Login failed');
  }
  setCurrentUser(data.patient);
  return data.patient;
}

export async function register(patientData) {
  let res;
  try {
    res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData),
    });
  } catch (err) {
    throw new Error('Cannot connect to backend server. Ensure backend is running.');
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || 'Registration failed');
  }
  setCurrentUser(data.patient);
  return data.patient;
}

export async function getPatientProfile(patientId) {
  const res = await fetch(`/api/patient/${patientId}`);
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || 'Failed to fetch profile');
  }
  return data.patient;
}

export async function updatePatientProfile(patientId, updates) {
  const res = await fetch(`/api/patient/${patientId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || 'Failed to update profile');
  }
  setCurrentUser(data.patient);
  return data.patient;
}

export async function getPatientAppointments(patientId) {
  const res = await fetch(`/api/patient/${patientId}/appointments`);
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || 'Failed to fetch appointments');
  }
  return data.appointments || [];
}

export async function sendMessage(message, patientContext = null) {
  let response;
  try {
    response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, message, patientContext }),
    });
  } catch (netErr) {
    throw new Error('Cannot connect to backend server. Make sure the backend is running (`npm start` inside `server/`).');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorDetails = data?.error || `Server error (${response.status})`;
    throw new Error(errorDetails);
  }

  return data?.response || data?.reply || 'No response received.';
}
