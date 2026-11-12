import { useState } from 'react';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';
import Field from '../common/Field.jsx';
import Avatar from '../common/Avatar.jsx';
import { Alert, EmptyState } from '../common/States.jsx';
import DateStrip from './DateStrip.jsx';
import SlotGrid from './SlotGrid.jsx';
import BookingConfirmation from './BookingConfirmation.jsx';
import useAsync from '../../hooks/useAsync.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { getAvailability, bookAppointment } from '../../services/api.js';
import { formatTime, formatFee, titleCase } from '../../utils/format.js';

/** Booking flow: date -> slots (from backend) -> reason -> confirm. */
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

  const pickDate = (d) => {
    setDate(d);
    setSlot(null);
    setBookError('');
  };

  const confirm = async () => {
    setSubmitting(true);
    setBookError('');
    try {
      // Success is shown only after the backend confirms the booking.
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

  if (confirmed) return <BookingConfirmation appointment={confirmed} onClose={onClose} />;

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
          <DateStrip dates={doctor.availableDates} value={date} onChange={pickDate} />

          <h4 className="book-label">2. Select a time <span className="faint">(Asia/Karachi)</span></h4>
          <SlotGrid availability={availability} value={slot} onChange={setSlot} />

          <h4 className="book-label">3. Reason for visit <span className="faint">(optional)</span></h4>
          <Field as="textarea" value={reason} maxLength={300} placeholder="e.g. Follow-up for blood pressure" onChange={(e) => setReason(e.target.value)} />

          {bookError && <div style={{ marginTop: 14 }}><Alert type="error">{bookError}</Alert></div>}
        </>
      )}
    </Modal>
  );
}
