import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../common/Icon.jsx';
import Avatar from '../common/Avatar.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { firstName } from '../../utils/format.js';

export default function Topbar({ user, title, onMenu }) {
  const { theme, toggleTheme } = useTheme();
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef(null);

  useEffect(() => {
    if (!bellOpen) return;
    const close = (e) => !bellRef.current?.contains(e.target) && setBellOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [bellOpen]);

  return (
    <header className="topbar">
      <button className="btn btn-ghost btn-icon menu-btn" onClick={onMenu} aria-label="Open menu">
        <Icon name="menu" size={20} />
      </button>
      <div className="topbar-title">
        <span className="topbar-welcome">Welcome back, {firstName(user.name)}</span>
        <strong>{title}</strong>
      </div>
      <div className="topbar-actions">
        <button
          className="btn btn-ghost btn-icon"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title="Toggle theme"
        >
          <Icon name={theme === 'light' ? 'moon' : 'sun'} />
        </button>
        <div className="bell-wrap" ref={bellRef}>
          <button className="btn btn-ghost btn-icon" onClick={() => setBellOpen((o) => !o)} aria-label="Notifications" aria-expanded={bellOpen}>
            <Icon name="bell" />
          </button>
          {bellOpen && (
            <div className="popover">
              <strong>Notifications</strong>
              <p className="muted">You're all caught up. Appointment reminders will appear here in a future update.</p>
            </div>
          )}
        </div>
        <Link to="/profile" className="topbar-avatar" aria-label="My profile">
          <Avatar name={user.name} />
        </Link>
      </div>
    </header>
  );
}
