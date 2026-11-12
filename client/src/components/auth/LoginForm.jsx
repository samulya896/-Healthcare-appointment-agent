import { useState } from 'react';
import Field from '../common/Field.jsx';
import Button from '../common/Button.jsx';
import { Alert } from '../common/States.jsx';
import { validateLogin } from '../../utils/validation.js';

const DEMO_USERS = [
  { name: 'John Doe', email: 'john@example.com', password: 'password123', tone: '' },
  { name: 'Ayesha Khan', email: 'ayesha@example.com', password: 'password123', tone: 'blue' },
];

export default function LoginForm({ onSubmit, busy, error }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = (e) => {
    e.preventDefault();
    const errs = validateLogin(form);
    setErrors(errs);
    if (Object.keys(errs).length === 0) onSubmit(form.email.trim(), form.password);
  };

  return (
    <>
      <form onSubmit={submit} noValidate className="auth-form">
        {error && <Alert type="error">{error}</Alert>}
        <Field label="Email" icon="mail" type="email" autoComplete="email" placeholder="you@example.com"
          value={form.email} onChange={set('email')} error={errors.email} />
        <Field label="Password" icon="lock" type="password" autoComplete="current-password" placeholder="Enter your password"
          value={form.password} onChange={set('password')} error={errors.password} />
        <Button type="submit" block loading={busy}>Sign in</Button>
      </form>

      <div className="auth-divider"><span>or try a demo account</span></div>
      <div className="demo-grid">
        {DEMO_USERS.map((u) => (
          <button key={u.email} type="button" className="demo-btn" disabled={busy} onClick={() => onSubmit(u.email, u.password)}>
            <span className={`avatar ${u.tone === 'blue' ? 'avatar-blue' : ''}`}>{u.name.split(' ').map((p) => p[0]).join('')}</span>
            <span><strong>{u.name}</strong><small>Demo patient</small></span>
          </button>
        ))}
      </div>
    </>
  );
}
