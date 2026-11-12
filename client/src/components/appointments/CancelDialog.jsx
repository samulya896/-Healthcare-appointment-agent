import { useState } from 'react';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';
import { Alert } from '../common/States.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { cancelAppointment } from '../../services/api.js';
import { formatDate, formatTime } from '../../utils/format.js';

export default function CancelDialog({ appointment: a, onClose, onCancelled }) {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const confirm = async () => {
    setBusy(true);
    setError('');
    try {
      await cancelAppointment(a.bookingId, user.id);
      onCancelled(a);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <Modal
      title="Cancel this appointment?"
      onClose={busy ? () => {} : onClose}
      maxWidth={460}
      footer={<>
        <Button variant="secondary" onClick={onClose} disabled={busy}>Keep appointment</Button>
        <Button variant="danger" onClick={confirm} loading={busy}>Yes, cancel it</Button>
      </>}
    >
      <p>
        Your visit with <strong>{a.doctorName}</strong> on <strong>{formatDate(a.date, { weekday: 'long', day: 'numeric', month: 'long' })}</strong> at <strong>{formatTime(a.timeSlot)}</strong> will be cancelled and the slot released.
      </p>
      {error && <div style={{ marginTop: 14 }}><Alert type="error">{error}</Alert></div>}
    </Modal>
  );
}
