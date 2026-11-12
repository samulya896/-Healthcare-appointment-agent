import { Link } from 'react-router-dom';
import Icon from '../common/Icon.jsx';

export default function RecentSymptoms({ symptoms = [] }) {
  return (
    <section className="card">
      <div className="card-head">
        <h2><Icon name="activity" size={18} /> Current symptoms</h2>
        <Link to="/symptoms" className="link-sm">Relief guide</Link>
      </div>
      <div className="card-body">
        {symptoms.length === 0 ? (
          <p className="muted">No symptoms recorded. You can add them from your health profile.</p>
        ) : (
          <ul className="symptom-list">
            {symptoms.map((s) => <li key={s}>{s}</li>)}
          </ul>
        )}
      </div>
    </section>
  );
}
