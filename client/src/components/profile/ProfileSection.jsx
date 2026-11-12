import Icon from '../common/Icon.jsx';
import Button from '../common/Button.jsx';
import { Alert } from '../common/States.jsx';

/** Card with an Edit / Save / Cancel header. Children receive nothing; parent controls editing state. */
export default function ProfileSection({ title, icon, editing, saving, error, onEdit, onSave, onCancel, children }) {
  return (
    <section className="card">
      <div className="card-head">
        <h2><Icon name={icon} size={18} /> {title}</h2>
        {editing ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="ghost" size="sm" onClick={onCancel} disabled={saving}>Cancel</Button>
            <Button size="sm" icon="check" onClick={onSave} loading={saving}>Save</Button>
          </div>
        ) : (
          <Button variant="secondary" size="sm" icon="edit" onClick={onEdit}>Edit</Button>
        )}
      </div>
      <div className="card-body">
        {error && <div style={{ marginBottom: 14 }}><Alert type="error">{error}</Alert></div>}
        {children}
      </div>
    </section>
  );
}
