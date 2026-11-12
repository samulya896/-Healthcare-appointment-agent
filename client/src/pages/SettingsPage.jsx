import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import Icon from '../components/common/Icon.jsx';
import Avatar from '../components/common/Avatar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import useServerStatus from '../hooks/useServerStatus.js';
import { API_BASE } from '../services/api.js';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { status, info, recheck } = useServerStatus();
  const navigate = useNavigate();

  return (
    <>
      <div className="page-head"><div><h1>Settings</h1><p>Appearance, account and connection status.</p></div></div>
      <div className="stack" style={{ maxWidth: 720 }}>
        <section className="card">
          <div className="card-head"><h2><Icon name="sun" size={18} /> Appearance</h2></div>
          <div className="card-body">
            <div className="segmented" style={{ maxWidth: 320 }} role="radiogroup" aria-label="Theme">
              {['light', 'dark'].map((t) => (
                <button key={t} role="radio" aria-checked={theme === t} className={theme === t ? 'active' : ''} onClick={() => setTheme(t)}>
                  {t === 'light' ? 'Light' : 'Dark'}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="card">
          <div className="card-head"><h2><Icon name="user" size={18} /> Account</h2></div>
          <div className="card-body settings-row">
            <Avatar name={user.name} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <strong>{user.name}</strong>
              <div className="muted" style={{ fontSize: 13 }}>{user.email}</div>
            </div>
            <Button variant="secondary" icon="logout" onClick={() => { logout(); navigate('/login'); }}>Sign out</Button>
          </div>
        </section>

        <section className="card">
          <div className="card-head"><h2><Icon name="activity" size={18} /> Connection</h2></div>
          <div className="card-body">
            <dl className="detail-grid">
              <div className="detail-row"><dt>Server</dt><dd>
                <span className={`badge ${status === 'online' ? 'badge-success' : status === 'offline' ? 'badge-danger' : ''}`}>
                  {status === 'online' ? 'Online' : status === 'offline' ? 'Unreachable' : 'Checking…'}
                </span>
              </dd></div>
              <div className="detail-row"><dt>API endpoint</dt><dd>{API_BASE || 'Same origin (/api via dev proxy)'}</dd></div>
              <div className="detail-row"><dt>Assistant mode</dt><dd>{info ? (info.assistantMode === 'gemini' ? 'Gemini AI' : 'Built-in clinical fallback (no Gemini key configured)') : '—'}</dd></div>
            </dl>
            <Button variant="ghost" size="sm" icon="refresh" onClick={recheck} style={{ marginTop: 14 }}>Re-check</Button>
          </div>
        </section>
      </div>
    </>
  );
}
