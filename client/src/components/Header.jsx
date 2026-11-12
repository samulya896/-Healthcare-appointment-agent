import React from 'react';
import './Header.css';

export default function Header({ user, activeTab, onTabChange, onLogout, theme, onToggleTheme }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand" onClick={() => user && onTabChange('portal')}>
          <h1 className="header-title">🏥 HealthCare Portal</h1>
          <p className="header-subtitle">Patient Records, Relief Guide & AI Scheduling</p>
        </div>

        {user && (
          <nav className="header-nav">
            <button
              className={`nav-btn ${activeTab === 'portal' ? 'active' : ''}`}
              onClick={() => onTabChange('portal')}
            >
              📋 Patient Portal
            </button>
            <button
              className={`nav-btn ${activeTab === 'relief' ? 'active' : ''}`}
              onClick={() => onTabChange('relief')}
            >
              💊 Medicine & Relief
            </button>
            <button
              className={`nav-btn ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => onTabChange('chat')}
            >
              💬 AI Assistant
            </button>
            <button
              className={`nav-btn ${activeTab === 'appointments' ? 'active' : ''}`}
              onClick={() => onTabChange('appointments')}
            >
              📅 My Appointments
            </button>
          </nav>
        )}

        <div className="header-actions">
          {/* Theme Toggle Button */}
          <button
            className="btn-theme-toggle"
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>

          {user && (
            <div className="header-user-section">
              <div className="user-pill" title={user.email}>
                <span className="user-avatar-small">
                  {user.name.split(' ').map((n) => n[0]).join('')}
                </span>
                <span className="user-name-text">{user.name}</span>
              </div>
              <button className="btn-logout" onClick={onLogout} title="Log Out">
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
