import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell.jsx';
import AuthPage from './pages/AuthPage.jsx';
import OverviewPage from './pages/OverviewPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AssistantPage from './pages/AssistantPage.jsx';
import SymptomReliefPage from './pages/SymptomReliefPage.jsx';
import DoctorsPage from './pages/DoctorsPage.jsx';
import AppointmentsPage from './pages/AppointmentsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import { useAuth } from './context/AuthContext.jsx';

function RequireAuth({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route element={<RequireAuth><AppShell /></RequireAuth>}>
        <Route index element={<OverviewPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="assistant" element={<AssistantPage />} />
        <Route path="symptoms" element={<SymptomReliefPage />} />
        <Route path="doctors" element={<DoctorsPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
