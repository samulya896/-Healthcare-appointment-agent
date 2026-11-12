import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GuideCard from '../components/symptoms/GuideCard.jsx';
import Icon from '../components/common/Icon.jsx';
import Button from '../components/common/Button.jsx';
import { Alert, EmptyState } from '../components/common/States.jsx';
import { symptomReliefGuides } from '../data/symptomReliefData.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function SymptomReliefPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const hasNsaidAllergy = user.allergies?.some((a) => /aspirin|nsaid/i.test(a));

  const guides = useMemo(() => {
    const q = search.toLowerCase();
    return symptomReliefGuides.filter(
      (g) =>
        (category === 'all' || g.id === category) &&
        (g.title.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.otcSuggestions.some((o) => o.name.toLowerCase().includes(q) || o.purpose.toLowerCase().includes(q)))
    );
  }, [search, category]);

  const ask = (guide) =>
    navigate('/assistant', {
      state: { prompt: `I am experiencing symptoms related to ${guide.title}. Could you help me find an available ${guide.specialty}?` },
    });

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Symptom relief guide</h1>
          <p>General self-care information for common, mild ailments.</p>
        </div>
        <Button variant="secondary" icon="print" onClick={() => window.print()}>Print guide</Button>
      </div>

      <div className="stack" style={{ gap: 14, marginBottom: 20 }}>
        <Alert type="info">
          <strong>Medical safety notice:</strong> The over-the-counter (OTC) medications and home-care suggestions listed below are for general informational and educational purposes only. They do not constitute a medical diagnosis, prescription, or formal treatment plan. If you have severe symptoms, allergies, are pregnant, or symptoms persist beyond 48–72 hours, please consult a qualified doctor.
        </Alert>
        {user.allergies?.length > 0 && (
          <Alert type="warning">
            <strong>Allergy alert for {user.name}:</strong> your medical file notes allergies to <strong>{user.allergies.join(', ')}</strong>.
            {hasNsaidAllergy && (
              <p style={{ marginTop: 6 }}>
                <strong>NSAID / Aspirin warning:</strong> Avoid medications containing Ibuprofen, Aspirin, or Naproxen. Use Paracetamol / Acetaminophen with caution and consult your pharmacist.
              </p>
            )}
          </Alert>
        )}
      </div>

      <div className="doctor-toolbar">
        <div className="input-wrap search-box">
          <span className="lead-icon"><Icon name="search" size={16} /></span>
          <input className="input has-lead" placeholder="Search symptoms or medications" value={search}
            onChange={(e) => setSearch(e.target.value)} aria-label="Search symptoms" />
        </div>
        <div className="chip-row">
          <button className={`chip ${category === 'all' ? 'active' : ''}`} onClick={() => setCategory('all')}>All conditions</button>
          {symptomReliefGuides.map((g) => (
            <button key={g.id} className={`chip ${category === g.id ? 'active' : ''}`} onClick={() => setCategory(g.id)}>
              {g.title.split(/[,&]/)[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {guides.length === 0 ? (
        <div className="card"><EmptyState icon="search" title="No matching conditions" message="Try words like fever, tooth, back pain or headache." /></div>
      ) : (
        <div className="guide-grid">
          {guides.map((g) => <GuideCard key={g.id} guide={g} onAsk={ask} />)}
        </div>
      )}
    </>
  );
}
