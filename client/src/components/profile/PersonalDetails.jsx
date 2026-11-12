import { useState } from 'react';
import ProfileSection from './ProfileSection.jsx';
import PersonalView from './PersonalView.jsx';
import PersonalForm from './PersonalForm.jsx';
import { toDraft } from './personalUtils.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { validatePersonal } from '../../utils/validation.js';

export default function PersonalDetails() {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(() => toDraft(user));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

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
    <ProfileSection
      title="Personal details"
      icon="user"
      editing={editing}
      saving={saving}
      error={saveError}
      onEdit={start}
      onSave={save}
      onCancel={() => setEditing(false)}
    >
      {editing ? (
        <PersonalForm draft={draft} setDraft={setDraft} errors={errors} email={user.email} />
      ) : (
        <PersonalView user={user} />
      )}
    </ProfileSection>
  );
}
