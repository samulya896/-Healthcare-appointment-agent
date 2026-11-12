import { Link } from 'react-router-dom';
import { EmptyState } from '../components/common/States.jsx';

export default function NotFoundPage() {
  return (
    <div className="card not-found">
      <EmptyState
        icon="search"
        title="Page not found"
        message="The page you're looking for doesn't exist or has moved."
        action={<Link to="/" className="btn btn-primary btn-sm">Back to overview</Link>}
      />
    </div>
  );
}
