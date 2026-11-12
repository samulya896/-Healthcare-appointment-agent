import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as api from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(api.getStoredUser);
  const [sessionNotice, setSessionNotice] = useState('');

  const persist = useCallback((patient) => {
    api.storeUser(patient);
    setUser(patient);
    return patient;
  }, []);

  const endSession = useCallback(
    (notice = '') => {
      api.resetChatSession();
      api.signOut();
      persist(null);
      setSessionNotice(notice);
    },
    [persist]
  );

  // Sign out automatically whenever the API rejects the session token.
  useEffect(() => {
    api.onUnauthorized(() => endSession('Your session has expired. Please sign in again.'));
    return () => api.onUnauthorized(null);
  }, [endSession]);

  // Re-validate the stored patient on load. The backend keeps data in memory, so after a
  // server restart a stored account may no longer exist.
  useEffect(() => {
    const stored = api.getStoredUser();
    if (!stored) return;
    api
      .getPatient(stored.id)
      .then(persist)
      .catch((err) => {
        if (err.status === 404) endSession('Your session expired because the demo server was reset. Please sign in again.');
        // network errors: keep the cached user, pages show their own error states
      });
  }, [persist, endSession]);

  const login = useCallback((email, password) => api.login(email, password).then(persist), [persist]);
  const register = useCallback((payload) => api.register(payload).then(persist), [persist]);
  const logout = useCallback(() => endSession(), [endSession]);
  const updateProfile = useCallback((updates) => api.updatePatient(user.id, updates).then(persist), [user, persist]);

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, updateProfile, sessionNotice, clearNotice: () => setSessionNotice('') }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
