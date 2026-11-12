import { useState } from 'react';
import ProfileSection from './ProfileSection.jsx';
import Field from '../common/Field.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { validatePersonal } from '../../utils/validation.js';
import { formatDob } from '../../utils/format.js';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const val = (v) => (v && v !== 'Not specified' && v !== 'Not provided' && v !== 'Unknown' ? v : '');

const toDraft = (u) => ({
  name: u.name || '',
  phone: u.phone || '',
  dob: /^\d{4}-\d{2}-\d{2}$/.test(u.dob || '') ? u.dob : '',
  gender: val(u.gender),
  bloodGroup: val(u.bloodGroup),
  address: val(u.address),
  emergencyContact: {
    name: val(u.emergencyContact?.name),
    relation: val(u.emergencyContact?.relation),
    phone: val(u.emergencyContact?.phone),
  },
});

function Row({ label, children }) {
  return (
    <div className="detail-row">
      <dt>{label}</dt>
      <dd>{children || <span className="faint">Not provided</span>}</dd>
    </div>
  );
}

export default function PersonalDetails() {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(() => toDraft(user));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const set = (k) => (e) => setDraft((d) => ({ ...d, [k]: e.target.value }));
  const setEc = (k) => (e) => setDraft((d) => ({ ...d, emergencyContact: { ...d.emergencyContact, [k]: e.target.value } }));

  const start = () => {
    setDraft(toDraft(user));
    setErrors({});
    setSaveError('');
    setEditing(true);
  };

  const save = async () => {
    const errs = validatePersonal(draft);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSaving(true);
    setSaveError('');
    try {
      await updateProfile({
        name: draft.name.trim(),
        phone: draft.phone.trim(),
        dob: draft.dob || undefined,
        gender: draft.gender || undefined,
        bloodGroup: draft.bloodGroup || undefined,
        address: draft.address.trim() || undefined,
        emergencyContact: draft.emergencyContact,
      });
      setEditing(false);
      toast('Personal details saved');
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProfileSection title="Personal details" icon="user" editing={editing} saving={saving} error={saveError}
      onEdit={start} onSave={save} onCancel={() => setEditing(false)}>
      {editing ? (
        <div className="form-grid">
          <Field label="Full name" value={draft.name} onChange={set('name')} error={errors.name} />
          <Field label="Phone" type="tel" value={draft.phone} onChange={set('phone')} error={errors.phone} />
          <Field label="Email" value={user.email} disabled hint="Email cannot be changed" />
          <Field label="Date of birth" type="date" value={draft.dob} max={new Date().toISOString().slice(0, 10)} onChange={set('dob')} error={errors.dob} />
          <Field label="Gender" as="select" value={draft.gender} onChange={set('gender')}>
            <option value="">Not specified</option>
            <option>Male</option><option>Female</option><option>Other</option>
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
      ) : (
        <dl className="detail-grid">
          <Row label="Full name">{user.name}</Row>
          <Row label="Email">{user.email}</Row>
          <Row label="Phone">{user.phone}</Row>
          <Row label="Date of birth">{formatDob(user.dob) !== '—' && `${formatDob(user.dob)}${user.age != null ? ` (${user.age} yrs)` : ''}`}</Row>
          <Row label="Gender">{val(user.gender)}</Row>
          <Row label="Blood group">{val(user.bloodGroup)}</Row>
          <Row label="Address">{val(user.address)}</Row>
          <Row label="Emergency contact">
            {val(user.emergencyContact?.name) &&
              `${user.emergencyContact.name}${user.emergencyContact.relation ? ` (${user.emergencyContact.relation})` : ''}${user.emergencyContact.phone ? ` · ${user.emergencyContact.phone}` : ''}`}
          </Row>
        </dl>
      )}
    </ProfileSection>
  );
}
