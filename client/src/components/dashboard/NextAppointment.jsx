import { Link } from 'react-router-dom';
import Icon from '../common/Icon.jsx';
import { EmptyState, ErrorState, LoadingBlock } from '../common/States.jsx';
import { formatDate, formatTime, titleCase } from '../../utils/format.js';

export default function NextAppointment({ appointment: a, loading, error, onRetry }) {
  return (
    <section className="card next-appt">
      <div className="card-head"><h2><Icon name="calendar" size={18} /> Next appointment</h2></div>
      <div className="card-body">
        {loading ? (
          <LoadingBlock lines={3} height={22} />
        ) : error ? (
          <ErrorState error={error} onRetry={onRetry} title="Could not load appointments" />
        ) : !a ? (
          <EmptyState icon="calendar" title="Nothing scheduled" message="Book a visit with one of our specialists."
            action={<Link to="/doctors" className="btn btn-primary btn-sm">Find a doctor</Link>} />
        ) : (
          <div className="next-appt-body">
            <div className="next-appt-when">
              <span>{formatDate(a.date, { weekday: 'long' })}</span>
              <strong>{formatDate(a.date, { day: 'numeric', month: 'long' })}</strong>
              <span className="next-appt-time"><Icon name="clock" size={14} /> {formatTime(a.timeSlot)}</span>
            </div>
            <div className="next-appt-info">
              <h3>{a.doctorName}</h3>
              {a.specialty && <span className="badge badge-primary">{titleCase(a.specialty)}</span>}
              {a.reason && <p className="muted">{a.reason}</p>}
              <Link to="/appointments" className="btn btn-secondary btn-sm">Manage</Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
