import { Link } from 'react-router-dom';
import Icon from '../common/Icon.jsx';

const ACTIONS = [
  { to: '/doctors', icon: 'stethoscope', title: 'Find a doctor', text: 'Search and book' },
  { to: '/appointments', icon: 'calendar', title: 'My appointments', text: 'View or cancel' },
  { to: '/symptoms', icon: 'pill', title: 'Symptom relief', text: 'Safe self-care guide' },
  { to: '/profile', icon: 'user', title: 'Health profile', text: 'Update your details' },
];

export default function QuickActions() {
  return (
    <section>
      <h2 style={{ marginBottom: 12 }}>Quick actions</h2>
      <div className="quick-grid">
        {ACTIONS.map((a) => (
          <Link key={a.to} to={a.to} className="card quick-card">
            <span className="quick-icon"><Icon name={a.icon} size={20} /></span>
            <strong>{a.title}</strong>
            <span className="muted">{a.text}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
