import { Link } from 'react-router-dom';
import Icon from '../common/Icon.jsx';
import { titleCase } from '../../utils/format.js';

export default function GuideCard({ guide, onAsk }) {
  return (
    <article className="card guide-card">
      <header className="guide-head">
        <span className="guide-emoji" aria-hidden="true">{guide.icon}</span>
        <div>
          <h3>{guide.title}</h3>
          <p className="muted">{guide.description}</p>
        </div>
      </header>

      <div className="guide-block">
        <h4><Icon name="pill" size={15} /> Over-the-counter options</h4>
        <ul className="otc-list">
          {guide.otcSuggestions.map((otc) => (
            <li key={otc.name}>
              <div className="otc-name"><strong>{otc.name}</strong><span className="badge badge-blue">OTC</span></div>
              <p>{otc.purpose}</p>
              <p className="otc-notes">{otc.notes}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="guide-block">
        <h4><Icon name="home" size={15} /> Home care</h4>
        <ul className="bullets">{guide.homeCareTips.map((t) => <li key={t}>{t}</li>)}</ul>
      </div>

      <div className="guide-block redflags">
        <h4><Icon name="alert" size={15} /> When to seek immediate medical attention</h4>
        <ul className="bullets">{guide.redFlags.map((t) => <li key={t}>{t}</li>)}</ul>
      </div>

      <footer className="guide-foot">
        <Link to={`/doctors?specialty=${encodeURIComponent(guide.specialty)}`} className="btn btn-primary btn-sm">
          <Icon name="calendar" size={14} /> Book a {titleCase(guide.specialty)}
        </Link>
        <button className="btn btn-secondary btn-sm" onClick={() => onAsk(guide)}>
          <Icon name="sparkles" size={14} /> Ask the assistant
        </button>
      </footer>
    </article>
  );
}
