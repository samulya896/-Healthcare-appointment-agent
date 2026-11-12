import { Link } from 'react-router-dom';
import Icon from '../common/Icon.jsx';

export default function HealthSummary({ user }) {
  const stats = [
    { label: 'Blood group', value: user.bloodGroup && user.bloodGroup !== 'Unknown' ? user.bloodGroup : '—' },
    { label: 'Age', value: user.age ?? '—' },
    { label: 'Conditions', value: user.pastMedicalHistory?.length ?? 0 },
    { label: 'Allergies', value: user.allergies?.length ?? 0 },
    { label: 'Medications', value: user.currentMedications?.length ?? 0 },
    { label: 'Gender', value: user.gender && user.gender !== 'Not specified' ? user.gender : '—' },
  ];
  return (
    <section className="card">
      <div className="card-head">
        <h2><Icon name="heart" size={18} /> Health summary</h2>
        <Link to="/profile" className="link-sm">View profile</Link>
      </div>
      <div className="card-body">
        <dl className="stat-grid">
          {stats.map((s) => (
            <div key={s.label} className="stat">
              <dd>{s.value}</dd>
              <dt>{s.label}</dt>
            </div>
          ))}
        </dl>
        {user.allergies?.length > 0 && (
          <div className="summary-allergies">
            <span className="faint">Allergies</span>
            <div className="pill-row">
              {user.allergies.map((a) => <span key={a} className="badge badge-warning">{a}</span>)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
