import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import BrandPanel from '../components/auth/BrandPanel.jsx';
import LoginForm from '../components/auth/LoginForm.jsx';
import RegisterForm from '../components/auth/RegisterForm.jsx';
import ServerBanner from '../components/layout/ServerBanner.jsx';
import Icon from '../components/common/Icon.jsx';
import Logo from '../components/common/Logo.jsx';
import { Alert } from '../components/common/States.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import useServerStatus from '../hooks/useServerStatus.js';

export default function AuthPage() {
  const { user, login, register, sessionNotice, clearNotice } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { status, recheck } = useServerStatus();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (user) return <Navigate to="/" replace />;

  const run = async (fn) => {
    setBusy(true);
    setError('');
    clearNotice();
    try {
      await fn();
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setError('');
  };

  return (
    <div className="auth-page">
      <BrandPanel />
      <section className="auth-side">
        <ServerBanner status={status} onRetry={recheck} />
        <div className="auth-topbar">
          <span className="auth-mobile-logo"><Logo /></span>
          <button className="btn btn-ghost btn-icon" onClick={toggleTheme} aria-label="Toggle theme">
            <Icon name={theme === 'light' ? 'moon' : 'sun'} />
          </button>
        </div>
        <div className="auth-card">
          <div className="auth-heading">
            <h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
            <p className="muted">
              {mode === 'login' ? 'Sign in to manage your health and appointments.' : 'Register to book appointments and keep your health profile.'}
            </p>
          </div>

          <div className="segmented" role="tablist">
            <button role="tab" aria-selected={mode === 'login'} className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')}>Sign in</button>
            <button role="tab" aria-selected={mode === 'register'} className={mode === 'register' ? 'active' : ''} onClick={() => switchMode('register')}>Register</button>
          </div>

          {sessionNotice && <Alert type="warning">{sessionNotice}</Alert>}

          <div key={mode} className="auth-pane">
            {mode === 'login' ? (
              <LoginForm busy={busy} error={error} onSubmit={(email, password) => run(() => login(email, password))} />
            ) : (
              <RegisterForm busy={busy} error={error} onSubmit={(payload) => run(() => register(payload))} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
