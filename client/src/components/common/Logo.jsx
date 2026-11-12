import Icon from './Icon.jsx';

export default function Logo({ light = false }) {
  return (
    <div className="logo">
      <span className="logo-mark"><Icon name="cross" size={16} strokeWidth={2.4} /></span>
      <span className="logo-text" style={light ? { color: '#fff' } : undefined}>CareLink</span>
    </div>
  );
}
