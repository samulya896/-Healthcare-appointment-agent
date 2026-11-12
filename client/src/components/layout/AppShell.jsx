import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import BottomNav from './BottomNav.jsx';
import ServerBanner from './ServerBanner.jsx';
import { NAV_ITEMS } from './nav.js';
import { useAuth } from '../../context/AuthContext.jsx';
import useServerStatus from '../../hooks/useServerStatus.js';

export default function AppShell() {
  const { user, logout } = useAuth();
  const { status, recheck } = useServerStatus();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  const current =
    NAV_ITEMS.find((n) => (n.end ? pathname === n.to : pathname.startsWith(n.to)))?.label || 'CareLink';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="shell">
      <Sidebar user={user} open={menuOpen} onClose={() => setMenuOpen(false)} onLogout={handleLogout} />
      <div className="shell-main">
        <Topbar user={user} title={current} onMenu={() => setMenuOpen(true)} />
        <ServerBanner status={status} onRetry={recheck} />
        <main className={`shell-content ${pathname.startsWith('/assistant') ? 'is-chat' : ''}`}>
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
