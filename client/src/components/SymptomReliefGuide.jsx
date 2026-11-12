import React, { useState } from 'react';
import { symptomReliefGuides } from '../data/symptomReliefData.js';
import './SymptomReliefGuide.css';

export default function SymptomReliefGuide({ user, onSelectSpecialtyForChat }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Check if patient has NSAID or Aspirin allergy
  const hasNsaidAllergy = user?.allergies?.some(
    (a) => a.toLowerCase().includes('aspirin') || a.toLowerCase().includes('nsaid')
  );

  const filteredGuides = symptomReliefGuides.filter((guide) => {
    const matchesCategory = selectedCategory === 'all' || guide.id === selectedCategory;
    const matchesSearch =
      guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.otcSuggestions.some(
        (otc) =>
          otc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          otc.purpose.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relief-container">
      {/* Header Banner */}
      <div className="relief-header-card">
        <div className="relief-header-text">
          <h2>💊 Symptom Relief & General Medication Guide</h2>
          <p className="subtitle">
            Explore general over-the-counter (OTC) recommendations, first-aid measures, and safe home remedies for common mild ailments.
          </p>
        </div>

        <button className="btn-print-summary" onClick={() => window.print()} title="Print Health Summary">
          🖨️ Print / Save Health Summary
        </button>
      </div>

      {/* Safety & Medical Disclaimer Alert */}
      <div className="medical-disclaimer-alert">
        <span className="alert-icon">ℹ️</span>
        <div>
          <strong>Medical Safety Notice:</strong> The over-the-counter (OTC) medications and home-care suggestions listed below are for general informational and educational purposes only. They do not constitute a medical diagnosis, prescription, or formal treatment plan. If you have severe symptoms, allergies, are pregnant, or symptoms persist beyond 48–72 hours, please consult a qualified doctor.
        </div>
      </div>

      {/* Personalized Patient Allergy Banner */}
      {user?.allergies && user.allergies.length > 0 && (
        <div className="patient-allergy-notice">
          <span className="notice-icon">⚠️</span>
          <div className="notice-content">
            <strong>Personalized Allergy Alert for {user.name}:</strong>
            <span> Your medical file notes allergies to: <strong>{user.allergies.join(', ')}</strong>.</span>
            {hasNsaidAllergy && (
              <p className="nsaid-warning">
                🚨 <strong>NSAID / Aspirin Warning:</strong> Avoid medications containing Ibuprofen, Aspirin, or Naproxen. Use Paracetamol / Acetaminophen with caution and consult your pharmacist.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="relief-toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search symptoms, pain, fever, toothache, or medications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="btn-clear-search" onClick={() => setSearchTerm('')}>
              ×
            </button>
          )}
        </div>

        <div className="category-chips">
          <button
            className={`chip-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Conditions
          </button>
          {symptomReliefGuides.map((g) => (
            <button
              key={g.id}
              className={`chip-btn ${selectedCategory === g.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(g.id)}
            >
              {g.icon} {g.title.split('&')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Guides Grid */}
      <div className="guides-grid">
        {filteredGuides.length === 0 ? (
          <div className="no-results-card">
            <span className="no-results-icon">🔎</span>
            <h3>No matching conditions found</h3>
            <p>Try searching for words like "fever", "tooth", "back pain", "headache", or "antacid".</p>
          </div>
        ) : (
          filteredGuides.map((guide) => (
            <div key={guide.id} className="guide-card">
              <div className="guide-card-header">
                <div className="guide-title-block">
                  <span className="guide-icon">{guide.icon}</span>
                  <div>
                    <h3>{guide.title}</h3>
                    <p className="guide-desc">{guide.description}</p>
                  </div>
                </div>

                <div className="guide-specialty-badge">
                  <span>Suggested Doctor:</span>
                  <strong className="specialty-name">{guide.specialty}</strong>
                </div>
              </div>

              {/* Section 1: OTC Medicines Suggested */}
              <div className="guide-section">
                <h4 className="section-title">💊 Suggested Over-the-Counter (OTC) Relief</h4>
                <div className="otc-list">
                  {guide.otcSuggestions.map((otc, i) => (
                    <div key={i} className="otc-item">
                      <div className="otc-name-row">
                        <span className="otc-name">{otc.name}</span>
                        <span className="otc-badge">OTC</span>
                      </div>
                      <p className="otc-purpose"><strong>Purpose:</strong> {otc.purpose}</p>
                      <p className="otc-notes"><em>Usage Note:</em> {otc.notes}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Home Care & First Aid */}
              <div className="guide-section">
                <h4 className="section-title">🏡 Recommended Home Care & First Aid</h4>
                <ul className="home-care-list">
                  {guide.homeCareTips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>

              {/* Section 3: Red Flags (When to seek emergency/immediate care) */}
              <div className="guide-section red-flags-section">
                <h4 className="section-title text-red">🚨 When to Seek Immediate Medical Attention</h4>
                <ul className="red-flags-list">
                  {guide.redFlags.map((flag, i) => (
                    <li key={i}>{flag}</li>
                  ))}
                </ul>
              </div>

              {/* Action Button: Book Appointment with appropriate doctor */}
              <div className="guide-action-footer">
                <button
                  className="btn-book-specialist"
                  onClick={() => onSelectSpecialtyForChat(guide.specialty, guide.title)}
                >
                  📅 Consult a {guide.specialty} with AI Assistant →
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
