import { useState } from 'react';
import Field from '../common/Field.jsx';
import Button from '../common/Button.jsx';
import { Alert } from '../common/States.jsx';
import { validateRegister } from '../../utils/validation.js';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function RegisterForm({ onSubmit, busy, error }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirm: '', dob: '', gender: '', bloodGroup: '',
  });
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = (e) => {
    e.preventDefault();
    const errs = validateRegister(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const { confirm, ...payload } = form;
    onSubmit({
      ...payload,
      name: payload.name.trim(),
      email: payload.email.trim(),
      phone: payload.phone.trim(),
      dob: payload.dob || undefined,
      gender: payload.gender || undefined,
      bloodGroup: payload.bloodGroup || undefined,
    });
  };

  return (
    <form onSubmit={submit} noValidate className="auth-form">
      {error && <Alert type="error">{error}</Alert>}
      <Field label="Full name" icon="user" autoComplete="name" placeholder="Jane Smith" value={form.name} onChange={set('name')} error={errors.name} />
      <div className="form-grid">
        <Field label="Email" icon="mail" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={set('email')} error={errors.email} />
        <Field label="Phone" icon="phone" type="tel" autoComplete="tel" placeholder="+92 300 1234567" value={form.phone} onChange={set('phone')} error={errors.phone} />
        <Field label="Password" type="password" autoComplete="new-password" placeholder="At least 6 characters" value={form.password} onChange={set('password')} error={errors.password} />
        <Field label="Confirm password" type="password" autoComplete="new-password" placeholder="Repeat password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} />
        <Field label="Date of birth" type="date" value={form.dob} max={new Date().toISOString().slice(0, 10)} onChange={set('dob')} error={errors.dob} hint="Optional" />
        <div className="form-grid" style={{ gap: 12 }}>
          <Field label="Gender" as="select" value={form.gender} onChange={set('gender')} hint="Optional">
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </Field>
          <Field label="Blood group" as="select" value={form.bloodGroup} onChange={set('bloodGroup')} hint="Optional">
            <option value="">Select</option>
            {BLOOD_GROUPS.map((b) => <option key={b}>{b}</option>)}
          </Field>
        </div>
      </div>
      <Button type="submit" block loading={busy}>Create account</Button>
    </form>
  );
}
