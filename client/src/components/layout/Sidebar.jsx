import { NavLink } from 'react-router-dom';
import Icon from '../common/Icon.jsx';
import Logo from '../common/Logo.jsx';
import Avatar from '../common/Avatar.jsx';
import { NAV_ITEMS } from './nav.js';

export default function Sidebar({ user, open, onClose, onLogout }) {
  return (
    <>
      {open && <div className="drawer-scrim" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'is-open' : ''}`} aria-label="Primary navigation">
        <div className="sidebar-top">
          <Logo />
          <button className="btn btn-ghost btn-icon btn-sm sidebar-close" onClick={onClose} aria-label="Close menu">
            <Icon name="x" />
          </button>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon name={item.icon} size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-user">
          <Avatar name={user.name} />
          <div className="sidebar-user-text">
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onLogout} aria-label="Sign out" title="Sign out">
            <Icon name="logout" size={16} />
          </button>
        </div>
      </aside>
    </>
  );
}
