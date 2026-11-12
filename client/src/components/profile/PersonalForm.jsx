import Field from '../common/Field.jsx';
import { BLOOD_GROUPS } from './personalUtils.js';

export default function PersonalForm({ draft, setDraft, errors, email }) {
  const set = (k) => (e) => setDraft((d) => ({ ...d, [k]: e.target.value }));
  const setEc = (k) => (e) => setDraft((d) => ({ ...d, emergencyContact: { ...d.emergencyContact, [k]: e.target.value } }));

  return (
    <div className="form-grid">
      <Field label="Full name" value={draft.name} onChange={set('name')} error={errors.name} />
      <Field label="Phone" type="tel" value={draft.phone} onChange={set('phone')} error={errors.phone} />
      <Field label="Email" value={email} disabled hint="Email cannot be changed" />
      <Field label="Date of birth" type="date" value={draft.dob} max={new Date().toISOString().slice(0, 10)} onChange={set('dob')} error={errors.dob} />
      <Field label="Gender" as="select" value={draft.gender} onChange={set('gender')}>
        <option value="">Not specified</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </Field>
      <Field label="Blood group" as="select" value={draft.bloodGroup} onChange={set('bloodGroup')}>
        <option value="">Unknown</option>
        {BLOOD_GROUPS.map((b) => <option key={b}>{b}</option>)}
      </Field>
      <Field className="span-2" label="Address" value={draft.address} onChange={set('address')} />
      <Field label="Emergency contact name" value={draft.emergencyContact.name} onChange={setEc('name')} />
      <Field label="Relation" value={draft.emergencyContact.relation} onChange={setEc('relation')} />
      <Field label="Emergency contact phone" type="tel" value={draft.emergencyContact.phone} onChange={setEc('phone')} error={errors.emergencyPhone} />
    </div>
  );
}
