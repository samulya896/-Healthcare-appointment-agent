import Avatar from '../common/Avatar.jsx';
import Button from '../common/Button.jsx';
import Icon from '../common/Icon.jsx';
import { formatDate, formatTime, titleCase } from '../../utils/format.js';

export default function AppointmentCard({ appointment: a, onCancel, past = false }) {
  const day = formatDate(a.date, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  return (
    <article className="card appt-card">
      <div className="appt-date" aria-hidden="true">
        <span>{formatDate(a.date, { month: 'short' })}</span>
        <strong>{formatDate(a.date, { day: 'numeric' })}</strong>
      </div>
      <div className="appt-main">
        <div className="appt-title">
          <h3>{a.doctorName}</h3>
          {a.specialty && <span className="badge badge-primary">{titleCase(a.specialty)}</span>}
          <span className={`badge ${past ? '' : 'badge-success'}`}>{past ? 'Completed' : a.status || 'Confirmed'}</span>
        </div>
        <p className="appt-meta">
          <span><Icon name="calendar" size={14} /> {day}</span>
          <span><Icon name="clock" size={14} /> {formatTime(a.timeSlot)}</span>
        </p>
        {a.reason && <p className="muted appt-reason">{a.reason}</p>}
      </div>
      {!past && (
        <div className="appt-actions">
          {a.calendarLink && (
            <a className="btn btn-secondary btn-sm" href={a.calendarLink} target="_blank" rel="noreferrer">
              <Icon name="external" size={14} /> Calendar
            </a>
          )}
          <Button variant="danger" size="sm" icon="x" onClick={() => onCancel(a)}>Cancel</Button>
        </div>
      )}
    </article>
  );
}

export function AppointmentMini({ appointment: a }) {
  return (
    <li className="mini-appt">
      <Avatar name={a.doctorName} tone="blue" />
      <div>
        <strong>{a.doctorName}</strong>
        <span className="muted">{formatDate(a.date)} · {formatTime(a.timeSlot)}</span>
      </div>
    </li>
  );
}
