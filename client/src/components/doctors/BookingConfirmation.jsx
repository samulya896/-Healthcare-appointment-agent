import { Link } from 'react-router-dom';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';
import Icon from '../common/Icon.jsx';
import { formatDate, formatTime } from '../../utils/format.js';

export default function BookingConfirmation({ appointment: a, onClose }) {
  return (
    <Modal
      title="Appointment confirmed"
      onClose={onClose}
      footer={<>
        <Button variant="secondary" onClick={onClose}>Close</Button>
        <Link to="/appointments" className="btn btn-primary" onClick={onClose}>View my appointments</Link>
      </>}
    >
      <div className="confirm-box">
        <span className="confirm-check"><Icon name="check" size={28} strokeWidth={2.4} /></span>
        <h3>You're booked with {a.doctorName}</h3>
        <p className="muted">
          {formatDate(a.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} at {formatTime(a.timeSlot)}
        </p>
        <p className="faint" style={{ fontSize: 13 }}>Reference {a.bookingId.slice(0, 8)}</p>
        {a.calendarLink && (
          <a className="btn btn-secondary btn-sm" href={a.calendarLink} target="_blank" rel="noreferrer">
            <Icon name="calendar" size={14} /> Add to Google Calendar
          </a>
        )}
      </div>
    </Modal>
  );
}
