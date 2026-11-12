import Icon from '../common/Icon.jsx';
import Logo from '../common/Logo.jsx';

const POINTS = [
  { icon: 'sparkles', title: 'AI scheduling assistant', text: 'Describe what you need and book in a conversation.' },
  { icon: 'stethoscope', title: 'Specialists across 8 fields', text: 'Search doctors and see real-time availability.' },
  { icon: 'shield', title: 'Your health, in one place', text: 'Profile, allergies, medications and appointments.' },
];

export default function BrandPanel() {
  return (
    <aside className="brand-panel">
      <Logo light />
      <div className="brand-copy">
        <h1>Care that fits your schedule.</h1>
        <p>Find the right doctor, book in seconds, and keep your health information organised.</p>
        <ul className="brand-points">
          {POINTS.map((p) => (
            <li key={p.title}>
              <span className="brand-point-icon"><Icon name={p.icon} size={18} /></span>
              <div>
                <strong>{p.title}</strong>
                <span>{p.text}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <p className="brand-foot">Hackathon demo · not for real medical use</p>
    </aside>
  );
}
