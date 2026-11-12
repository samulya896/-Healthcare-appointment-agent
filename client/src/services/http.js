// Empty in dev (Vite proxies /api). Set VITE_API_URL in production when the API is on another origin.
export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, { status = 0, network = false } = {}) {
    super(message);
    this.status = status;
    this.network = network;
  }
}

// ---- Session storage (patient profile + signed token) ----
const USER_KEY = 'hc_patient_user';
const TOKEN_KEY = 'hc_token';

const read = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
const write = (key, value) => {
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch {
    /* storage unavailable */
  }
};

export function getStoredUser() {
  try {
    return JSON.parse(read(USER_KEY));
  } catch {
    return null;
  }
}
export const storeUser = (user) => write(USER_KEY, user ? JSON.stringify(user) : null);
export const getToken = () => read(TOKEN_KEY);
export const storeToken = (token) => write(TOKEN_KEY, token);

// Lets the auth layer sign the user out when the API rejects the session.
let unauthorizedHandler = null;
export const onUnauthorized = (fn) => {
  unauthorizedHandler = fn;
};

export async function request(path, { method = 'GET', body, timeout = 30000, auth = true } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  const token = auth && getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
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
    if (res.status === 401 && token) unauthorizedHandler?.();
    throw new ApiError(data?.error || `Request failed (${res.status})`, { status: res.status });
  }
  return data;
}
