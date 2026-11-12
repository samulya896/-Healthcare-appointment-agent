import React, { useEffect, useState } from 'react';
import { getPatientAppointments } from '../services/api.js';
import './AppointmentsList.css';

export default function AppointmentsList({ user, onBookNew }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const list = await getPatientAppointments(user.id);
      setAppointments(list);
    } catch (err) {
      setError(err.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user.id]);

  return (
    <div className="appointments-container">
      <div className="appointments-header">
        <div>
          <h2>📅 My Appointments</h2>
          <p className="subtitle">View and manage your scheduled doctor consultations</p>
        </div>
        <button className="btn-book-new" onClick={onBookNew}>
          + Schedule New Appointment
        </button>
      </div>

      {loading ? (
        <div className="appointments-loading">Loading scheduled appointments...</div>
      ) : error ? (
        <div className="appointments-error">⚠️ {error}</div>
      ) : appointments.length === 0 ? (
        <div className="empty-appointments-card">
          <div className="empty-icon">🩺</div>
          <h3>No Appointments Scheduled Yet</h3>
          <p>You haven't scheduled any appointments. Use our AI healthcare assistant to find an available doctor and pick a time slot.</p>
          <button className="btn-book-cta" onClick={onBookNew}>
            Find a Doctor & Book Now
          </button>
        </div>
      ) : (
        <div className="appointments-grid">
          {appointments.map((appt, idx) => (
            <div key={appt.bookingId || idx} className="appointment-card">
              <div className="appointment-status-bar">
                <span className="status-badge confirmed">✓ Confirmed</span>
                <span className="appt-id">Ref: {appt.bookingId || `BK-${idx + 1}`}</span>
              </div>

              <div className="doctor-section">
                <div className="doc-avatar">👨‍⚕️</div>
                <div>
                  <h4 className="doc-name">{appt.doctorName}</h4>
                  <span className="doc-specialty">{appt.specialty || 'Specialist'}</span>
                </div>
              </div>

              <div className="appt-schedule-box">
                <div className="schedule-item">
                  <span className="label">Date:</span>
                  <span className="val">🗓️ {appt.date || 'Scheduled'}</span>
                </div>
                <div className="schedule-item">
                  <span className="label">Time:</span>
                  <span className="val">⏰ {appt.timeSlot || 'Confirmed Time'} (PKT)</span>
                </div>
                <div className="schedule-item">
                  <span className="label">Reason:</span>
                  <span className="val">{appt.reason || 'Medical consultation'}</span>
                </div>
              </div>

              {appt.calendarLink && (
                <div className="appt-action-row">
                  <a
                    href={appt.calendarLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-calendar-sync"
                  >
                    📅 Add to Google Calendar
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
