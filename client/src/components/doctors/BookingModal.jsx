import { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';
import Field from '../common/Field.jsx';
import Avatar from '../common/Avatar.jsx';
import Icon from '../common/Icon.jsx';
import { Alert, EmptyState, ErrorState, LoadingBlock } from '../common/States.jsx';
import useAsync from '../../hooks/useAsync.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { getAvailability, bookAppointment } from '../../services/api.js';
import { dayParts, formatDate, formatTime, formatFee, titleCase } from '../../utils/format.js';

export default function BookingModal({ doctor, onClose, onBooked }) {
  const { user } = useAuth();
  const [date, setDate] = useState(doctor.availableDates[0] || null);
  const [slot, setSlot] = useState(null);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookError, setBookError] = useState('');
  const [confirmed, setConfirmed] = useState(null);

  const availability = useAsync(
    () => (date ? getAvailability(doctor.id, date) : Promise.resolve(null)),
    [doctor.id, date]
  );
  const slots = availability.data?.availableSlots || [];

  const pickDate = (d) => {
    setDate(d);
    setSlot(null);
    setBookError('');
  };

  const confirm = async () => {
    setSubmitting(true);
    setBookError('');
    try {
      // The success state is shown only after the backend confirms the booking.
      const appointment = await bookAppointment({
        patientId: user.id,
        providerId: doctor.id,
        date,
        timeSlot: slot,
        reason: reason.trim(),
      });
      setConfirmed(appointment);
      onBooked?.(appointment);
    } catch (err) {
      setBookError(err.message);
      if (err.status === 409) {
        setSlot(null);
        availability.reload();
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <Modal title="Appointment confirmed" onClose={onClose}
        footer={<>
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Link to="/appointments" className="btn btn-primary" onClick={onClose}>View my appointments</Link>
        </>}>
        <div className="confirm-box">
          <span className="confirm-check"><Icon name="check" size={28} strokeWidth={2.4} /></span>
          <h3>You're booked with {confirmed.doctorName}</h3>
          <p className="muted">{formatDate(confirmed.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} at {formatTime(confirmed.timeSlot)}</p>
          <p className="faint" style={{ fontSize: 13 }}>Reference {confirmed.bookingId.slice(0, 8)}</p>
          {confirmed.calendarLink && (
            <a className="btn btn-secondary btn-sm" href={confirmed.calendarLink} target="_blank" rel="noreferrer">
              <Icon name="calendar" size={14} /> Add to Google Calendar
            </a>
          )}
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title="Book an appointment"
      subtitle="Choose a date and time that works for you."
      onClose={onClose}
      maxWidth={620}
      footer={<>
        <Button variant="secondary" onClick={onClose} disabled={submitting}>Cancel</Button>
        <Button onClick={confirm} loading={submitting} disabled={!slot}>
          {slot ? `Confirm ${formatTime(slot)}` : 'Select a time'}
        </Button>
      </>}
    >
      <div className="book-doctor">
        <Avatar name={doctor.name} />
        <div>
          <strong>{doctor.name}</strong>
          <div className="muted" style={{ fontSize: 13 }}>{titleCase(doctor.specialty)} · {formatFee(doctor.consultationFee)}</div>
        </div>
      </div>

      {doctor.availableDates.length === 0 ? (
        <EmptyState icon="calendar" title="No availability" message="This doctor has no open slots right now." />
      ) : (
        <>
          <h4 className="book-label">1. Select a date</h4>
          <div className="date-strip" role="listbox" aria-label="Available dates">
            {doctor.availableDates.map((d) => {
              const p = dayParts(d);
              return (
                <button key={d} role="option" aria-selected={d === date} className={`date-chip ${d === date ? 'active' : ''}`} onClick={() => pickDate(d)}>
                  <span>{p.weekday}</span><strong>{p.day}</strong><span>{p.month}</span>
                </button>
              );
            })}
          </div>

          <h4 className="book-label">2. Select a time <span className="faint">(Asia/Karachi)</span></h4>
          {availability.loading ? (
            <LoadingBlock lines={2} height={36} />
          ) : availability.error ? (
            <ErrorState error={availability.error} onRetry={availability.reload} title="Could not load slots" />
          ) : slots.length === 0 ? (
            <EmptyState icon="clock" title="No slots on this date" message="Pick a different date to see more times." />
          ) : (
            <div className="slot-grid">
              {slots.map((s) => (
                <button key={s} className={`slot ${s === slot ? 'active' : ''}`} onClick={() => setSlot(s)} aria-pressed={s === slot}>
                  {formatTime(s)}
                </button>
              ))}
            </div>
          )}

          <h4 className="book-label">3. Reason for visit <span className="faint">(optional)</span></h4>
          <Field as="textarea" value={reason} maxLength={300} placeholder="e.g. Follow-up for blood pressure" onChange={(e) => setReason(e.target.value)} />

          {bookError && <div style={{ marginTop: 14 }}><Alert type="error">{bookError}</Alert></div>}
        </>
      )}
    </Modal>
  );
}
