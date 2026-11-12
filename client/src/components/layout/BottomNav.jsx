import { NavLink } from 'react-router-dom';
import Icon from '../common/Icon.jsx';
import { MOBILE_NAV } from './nav.js';

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Quick navigation">
      {MOBILE_NAV.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `bottom-link ${isActive ? 'active' : ''}`}>
          <Icon name={item.icon} size={20} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
