import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as api from '../services/api.js';
import { resetChatSession } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(api.getStoredUser);
  const [sessionNotice, setSessionNotice] = useState('');

  const persist = useCallback((patient) => {
    api.storeUser(patient);
    setUser(patient);
    return patient;
  }, []);

  // Re-validate the stored patient against the backend on load. The backend keeps
  // data in memory, so after a server restart a stored account may no longer exist.
  useEffect(() => {
    const stored = api.getStoredUser();
    if (!stored) return;
    api
      .getPatient(stored.id)
      .then(persist)
      .catch((err) => {
        if (err.status === 404) {
          persist(null);
          setSessionNotice('Your session expired because the demo server was reset. Please sign in again.');
        }
        // network errors: keep the cached user, pages show their own error states
      });
  }, [persist]);

  const login = useCallback((email, password) => api.login(email, password).then(persist), [persist]);
  const register = useCallback((payload) => api.register(payload).then(persist), [persist]);
  const logout = useCallback(() => {
    resetChatSession();
    persist(null);
  }, [persist]);
  const updateProfile = useCallback(
    (updates) => api.updatePatient(user.id, updates).then(persist),
    [user, persist]
  );

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, updateProfile, sessionNotice, clearNotice: () => setSessionNotice('') }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
