import { useState } from 'react';
import { Link } from 'react-router-dom';
import AppointmentCard from '../components/appointments/AppointmentCard.jsx';
import CancelDialog from '../components/appointments/CancelDialog.jsx';
import { EmptyState, ErrorState, LoadingBlock } from '../components/common/States.jsx';
import useAppointments from '../hooks/useAppointments.js';
import { useToast } from '../context/ToastContext.jsx';

export default function AppointmentsPage() {
  const { upcoming, past, loading, error, reload } = useAppointments();
  const [tab, setTab] = useState('upcoming');
  const [cancelling, setCancelling] = useState(null);
  const toast = useToast();

  const list = tab === 'upcoming' ? upcoming : past;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>My appointments</h1>
          <p>Manage upcoming visits and review your history.</p>
        </div>
        <Link to="/doctors" className="btn btn-primary">Book new appointment</Link>
      </div>

      <div className="segmented" style={{ maxWidth: 360, marginBottom: 20 }} role="tablist">
        <button role="tab" aria-selected={tab === 'upcoming'} className={tab === 'upcoming' ? 'active' : ''} onClick={() => setTab('upcoming')}>
          Upcoming{!loading && ` (${upcoming.length})`}
        </button>
        <button role="tab" aria-selected={tab === 'history'} className={tab === 'history' ? 'active' : ''} onClick={() => setTab('history')}>
          History{!loading && ` (${past.length})`}
        </button>
      </div>

      {loading ? (
        <div className="card card-pad"><LoadingBlock lines={4} height={22} /></div>
      ) : error ? (
        <div className="card"><ErrorState error={error} onRetry={reload} title="Could not load appointments" /></div>
      ) : list.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="calendar"
            title={tab === 'upcoming' ? 'No upcoming appointments' : 'No past appointments yet'}
            message={tab === 'upcoming' ? 'Find a doctor and book your next visit.' : 'Completed visits will appear here.'}
            action={tab === 'upcoming' && <Link to="/doctors" className="btn btn-primary btn-sm">Find a doctor</Link>}
          />
        </div>
      ) : (
        <div className="stack" style={{ gap: 14 }}>
          {list.map((a) => (
            <AppointmentCard key={a.bookingId} appointment={a} past={tab === 'history'} onCancel={setCancelling} />
          ))}
        </div>
      )}

      {cancelling && (
        <CancelDialog
          appointment={cancelling}
          onClose={() => setCancelling(null)}
          onCancelled={() => {
            setCancelling(null);
            toast('Appointment cancelled');
            reload();
          }}
        />
      )}
    </>
  );
}
