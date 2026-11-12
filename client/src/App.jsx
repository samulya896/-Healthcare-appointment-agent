import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import { FullPageLoader } from './components/common/States.jsx';
import { useAuth } from './context/AuthContext.jsx';

// Route-level code splitting: each page ships as its own chunk.
const AuthPage = lazy(() => import('./pages/AuthPage.jsx'));
const OverviewPage = lazy(() => import('./pages/OverviewPage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));
const AssistantPage = lazy(() => import('./pages/AssistantPage.jsx'));
const SymptomReliefPage = lazy(() => import('./pages/SymptomReliefPage.jsx'));
const DoctorsPage = lazy(() => import('./pages/DoctorsPage.jsx'));
const AppointmentsPage = lazy(() => import('./pages/AppointmentsPage.jsx'));
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

function RequireAuth({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<FullPageLoader />}>
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
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
