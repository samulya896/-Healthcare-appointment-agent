import { request, storeToken } from './http.js';

const signedIn = (data) => {
  storeToken(data.token);
  return data.patient;
};

export const health = () => request('/api/health', { timeout: 45000, auth: false });

export const login = (email, password) =>
  request('/api/auth/login', { method: 'POST', body: { email, password }, auth: false }).then(signedIn);

export const register = (payload) =>
  request('/api/auth/register', { method: 'POST', body: payload, auth: false }).then(signedIn);

export const signOut = () => storeToken(null);
