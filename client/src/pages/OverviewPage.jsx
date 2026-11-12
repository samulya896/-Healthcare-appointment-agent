import NextAppointment from '../components/dashboard/NextAppointment.jsx';
import QuickActions from '../components/dashboard/QuickActions.jsx';
import HealthSummary from '../components/dashboard/HealthSummary.jsx';
import RecentSymptoms from '../components/dashboard/RecentSymptoms.jsx';
import AssistantShortcut from '../components/dashboard/AssistantShortcut.jsx';
import UpcomingList from '../components/dashboard/UpcomingList.jsx';
import useAppointments from '../hooks/useAppointments.js';
import { useAuth } from '../context/AuthContext.jsx';
import { firstName } from '../utils/format.js';

export default function OverviewPage() {
  const { user } = useAuth();
  const { upcoming, loading, error, reload } = useAppointments();

  return (
    <div className="stack" style={{ gap: 24 }}>
      <div className="page-head" style={{ marginBottom: 0 }}>
        <div>
          <h1>Good to see you, {firstName(user.name)}</h1>
          <p>Here's an overview of your health and upcoming care.</p>
        </div>
      </div>

      <div className="overview-grid">
        <NextAppointment appointment={upcoming[0]} loading={loading} error={error} onRetry={reload} />
        <HealthSummary user={user} />
      </div>

      <QuickActions />

      <div className="overview-grid">
        <RecentSymptoms symptoms={user.commonSymptoms} />
        <UpcomingList appointments={upcoming} loading={loading} />
      </div>

      <AssistantShortcut />
    </div>
  );
}
