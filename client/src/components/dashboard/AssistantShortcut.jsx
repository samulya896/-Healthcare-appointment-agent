import { Link } from 'react-router-dom';
import Icon from '../common/Icon.jsx';

export default function AssistantShortcut() {
  return (
    <section className="assistant-cta">
      <span className="assistant-cta-icon"><Icon name="sparkles" size={22} /></span>
      <div>
        <h2>Ask the AI assistant</h2>
        <p>Find a specialist, check availability or book a visit just by chatting.</p>
      </div>
      <Link to="/assistant" className="btn btn-primary">Open assistant <Icon name="arrowRight" size={16} /></Link>
    </section>
  );
}
