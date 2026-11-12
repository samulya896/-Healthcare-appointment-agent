import { useState } from 'react';
import ProfileSection from './ProfileSection.jsx';
import EditableList from '../common/EditableList.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

/** Edit/save/cancel section for one string-array field of the patient record. */
export default function ListSection({ title, icon, field, placeholder, emptyText }) {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const current = user[field] || [];
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(current);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    const cleaned = draft.map((s) => s.trim()).filter(Boolean);
    const dupes = cleaned.find((s, i) => cleaned.findIndex((x) => x.toLowerCase() === s.toLowerCase()) !== i);
    if (dupes) {
      setError(`"${dupes}" appears more than once.`);
      return;
    }
    setSaving(true);
    setError('');
    try {
      await updateProfile({ [field]: cleaned });
      setEditing(false);
      toast(`${title} saved`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProfileSection title={title} icon={icon} editing={editing} saving={saving}
      onEdit={() => { setDraft(current); setError(''); setEditing(true); }}
      onSave={save} onCancel={() => { setEditing(false); setError(''); }}>
      <EditableList
        items={editing ? draft : current}
        onChange={setDraft}
        editing={editing}
        placeholder={placeholder}
        emptyText={emptyText}
        error={error}
        onClearError={() => setError('')}
      />
    </ProfileSection>
  );
}
