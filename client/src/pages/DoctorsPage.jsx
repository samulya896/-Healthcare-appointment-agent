import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DoctorCard from '../components/doctors/DoctorCard.jsx';
import BookingModal from '../components/doctors/BookingModal.jsx';
import Icon from '../components/common/Icon.jsx';
import { EmptyState, ErrorState } from '../components/common/States.jsx';
import useAsync from '../hooks/useAsync.js';
import { getDoctors } from '../services/api.js';
import { titleCase } from '../utils/format.js';

export default function DoctorsPage() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [booking, setBooking] = useState(null);
  const specialty = params.get('specialty') || 'all';
  const { data: doctors, loading, error, reload } = useAsync(getDoctors, []);

  const specialties = useMemo(() => [...new Set((doctors || []).map((d) => d.specialty))].sort(), [doctors]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (doctors || []).filter(
      (d) =>
        (specialty === 'all' || d.specialty === specialty) &&
        (!q || d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q) || (d.qualifications || '').toLowerCase().includes(q))
    );
  }, [doctors, query, specialty]);

  const setSpecialty = (s) => setParams(s === 'all' ? {} : { specialty: s }, { replace: true });

  // Refresh availability after a booking so "next available" stays accurate.
  const handleBooked = () => reload();

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Find a doctor</h1>
          <p>Browse specialists, compare details and book a time that suits you.</p>
        </div>
      </div>

      <div className="doctor-toolbar">
        <div className="input-wrap search-box">
          <span className="lead-icon"><Icon name="search" size={16} /></span>
          <input className="input has-lead" placeholder="Search by name, specialty or qualification" value={query}
            onChange={(e) => setQuery(e.target.value)} aria-label="Search doctors" />
        </div>
        <div className="chip-row" role="group" aria-label="Filter by specialty">
          <button className={`chip ${specialty === 'all' ? 'active' : ''}`} onClick={() => setSpecialty('all')}>All</button>
          {specialties.map((s) => (
            <button key={s} className={`chip ${specialty === s ? 'active' : ''}`} onClick={() => setSpecialty(s)}>{titleCase(s)}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="doctor-grid">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 230, borderRadius: 16 }} />)}
        </div>
      ) : error ? (
        <div className="card"><ErrorState error={error} onRetry={reload} title="Could not load doctors" /></div>
      ) : filtered.length === 0 ? (
        <div className="card"><EmptyState icon="search" title="No doctors match your search" message="Try a different name or clear the specialty filter." /></div>
      ) : (
        <>
          <p className="muted" style={{ marginBottom: 12, fontSize: 13 }}>{filtered.length} doctor{filtered.length === 1 ? '' : 's'}</p>
          <div className="doctor-grid">
            {filtered.map((d) => <DoctorCard key={d.id} doctor={d} onBook={setBooking} />)}
          </div>
        </>
      )}

      {booking && <BookingModal doctor={booking} onClose={() => setBooking(null)} onBooked={handleBooked} />}
    </>
  );
}
