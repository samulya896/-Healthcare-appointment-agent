import React, { useState } from 'react';
import { updatePatientProfile } from '../services/api.js';
import './PatientPortal.css';

export default function PatientPortal({ user, onUpdateUser, onGoToChat }) {
  const [newSymptom, setNewSymptom] = useState('');
  const [newHistoryItem, setNewHistoryItem] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleAddSymptom = async (e) => {
    e.preventDefault();
    if (!newSymptom.trim()) return;

    const updatedSymptoms = [...(user.commonSymptoms || []), newSymptom.trim()];
    setIsSaving(true);
    try {
      const updated = await updatePatientProfile(user.id, {
        commonSymptoms: updatedSymptoms,
      });
      onUpdateUser(updated);
      setNewSymptom('');
      setSuccessMsg('Symptom added successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert('Failed to update symptoms: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveSymptom = async (indexToRemove) => {
    const updatedSymptoms = user.commonSymptoms.filter((_, idx) => idx !== indexToRemove);
    setIsSaving(true);
    try {
      const updated = await updatePatientProfile(user.id, {
        commonSymptoms: updatedSymptoms,
      });
      onUpdateUser(updated);
    } catch (err) {
      alert('Failed to remove symptom: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddHistory = async (e) => {
    e.preventDefault();
    if (!newHistoryItem.trim()) return;

    const updatedHistory = [...(user.pastMedicalHistory || []), newHistoryItem.trim()];
    setIsSaving(true);
    try {
      const updated = await updatePatientProfile(user.id, {
        pastMedicalHistory: updatedHistory,
      });
      onUpdateUser(updated);
      setNewHistoryItem('');
      setSuccessMsg('Medical history updated!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert('Failed to update medical history: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="portal-container">
      {/* Top Banner / Welcome */}
      <div className="portal-header-card">
        <div className="patient-avatar-large">
          {user.name.split(' ').map((n) => n[0]).join('')}
        </div>
        <div className="patient-main-info">
          <div className="patient-title-row">
            <h2>{user.name}</h2>
            <span className="blood-badge">Blood: {user.bloodGroup || 'N/A'}</span>
            <span className="gender-badge">{user.gender}</span>
          </div>
          <p className="patient-id-tag">Patient ID: {user.id}</p>

          <div className="patient-quick-contact">
            <span>📧 {user.email}</span>
            <span>📞 {user.phone}</span>
            <span>🎂 Age: {user.age || '30'} ({user.dob || 'N/A'})</span>
          </div>
        </div>

        <div className="portal-cta-box">
          <button className="btn-chat-launch" onClick={onGoToChat}>
            💬 Book Appointment with AI Assistant
          </button>
        </div>
      </div>

      {successMsg && <div className="portal-alert-success">✓ {successMsg}</div>}

      <div className="portal-grid">
        {/* Card 1: Major Personal & Emergency Details */}
        <div className="portal-card">
          <div className="card-header">
            <h3>👤 Personal & Emergency Details</h3>
          </div>
          <div className="card-body details-list">
            <div className="detail-item">
              <span className="detail-label">Full Name:</span>
              <span className="detail-value">{user.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{user.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Primary Phone:</span>
              <span className="detail-value">{user.phone}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Date of Birth:</span>
              <span className="detail-value">{user.dob || 'Not provided'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Blood Type:</span>
              <span className="detail-value highlight-red">{user.bloodGroup || 'Unknown'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Residential Address:</span>
              <span className="detail-value">{user.address || 'Gulberg, Lahore'}</span>
            </div>
            <div className="detail-item emergency-box">
              <span className="detail-label">🚨 Emergency Contact:</span>
              <span className="detail-value">
                {user.emergencyContact?.name} ({user.emergencyContact?.relation || 'Relative'}) - {user.emergencyContact?.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Common Symptoms & Current Concerns */}
        <div className="portal-card">
          <div className="card-header">
            <h3>🩺 Common Symptoms & Current Concerns</h3>
          </div>
          <div className="card-body">
            <p className="section-desc">
              List any frequent, ongoing, or recent symptoms. The AI assistant uses this to recommend the right doctor specialty.
            </p>

            <div className="symptoms-list">
              {(!user.commonSymptoms || user.commonSymptoms.length === 0) ? (
                <div className="empty-state-text">No common symptoms recorded.</div>
              ) : (
                user.commonSymptoms.map((symp, index) => (
                  <div key={index} className="symptom-chip">
                    <span className="symptom-text">• {symp}</span>
                    <button
                      type="button"
                      className="btn-chip-remove"
                      onClick={() => handleRemoveSymptom(index)}
                      title="Remove symptom"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>

            <form className="add-item-form" onSubmit={handleAddSymptom}>
              <input
                type="text"
                placeholder="e.g. Mild headache, joint stiffness..."
                value={newSymptom}
                onChange={(e) => setNewSymptom(e.target.value)}
              />
              <button type="submit" disabled={isSaving || !newSymptom.trim()}>
                + Add Symptom
              </button>
            </form>
          </div>
        </div>

        {/* Card 3: Past Medical History & Surgeries */}
        <div className="portal-card">
          <div className="card-header">
            <h3>📋 Past Medical History & Surgeries</h3>
          </div>
          <div className="card-body">
            <div className="history-list">
              {(!user.pastMedicalHistory || user.pastMedicalHistory.length === 0) ? (
                <div className="empty-state-text">No medical history on record.</div>
              ) : (
                user.pastMedicalHistory.map((item, index) => (
                  <div key={index} className="history-item">
                    <span className="bullet">✔</span>
                    <span className="history-text">{item}</span>
                  </div>
                ))
              )}
            </div>

            <form className="add-item-form" onSubmit={handleAddHistory}>
              <input
                type="text"
                placeholder="Add condition or past surgery (e.g. Appendectomy 2018)..."
                value={newHistoryItem}
                onChange={(e) => setNewHistoryItem(e.target.value)}
              />
              <button type="submit" disabled={isSaving || !newHistoryItem.trim()}>
                + Add History
              </button>
            </form>
          </div>
        </div>

        {/* Card 4: Allergies & Current Medications */}
        <div className="portal-card">
          <div className="card-header">
            <h3>⚠️ Allergies & Active Medications</h3>
          </div>
          <div className="card-body">
            <h4 className="sub-heading">Known Allergies</h4>
            <div className="allergies-container">
              {(!user.allergies || user.allergies.length === 0) ? (
                <span className="tag-safe">No known allergies</span>
              ) : (
                user.allergies.map((all, i) => (
                  <span key={i} className="allergy-tag">⚠️ {all}</span>
                ))
              )}
            </div>

            <h4 className="sub-heading" style={{ marginTop: '20px' }}>Current Medications</h4>
            <div className="medications-list">
              {(!user.currentMedications || user.currentMedications.length === 0) ? (
                <div className="empty-state-text">No current medications recorded.</div>
              ) : (
                user.currentMedications.map((med, i) => (
                  <div key={i} className="medication-item">
                    <span className="pill-icon">💊</span>
                    <span>{med}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
