import Icon from '../common/Icon.jsx';

export default function ServerBanner({ status, onRetry }) {
  if (status === 'online') return null;
  const checking = status === 'checking';
  return (
    <div className={`server-banner ${checking ? 'is-checking' : ''}`} role="status">
      {checking ? <span className="spinner" /> : <Icon name="wifiOff" size={16} />}
      <span>
        {checking
          ? 'Connecting to the server… the free-tier backend can take up to a minute to wake up.'
          : 'The backend server is unreachable. Data may not load until it is back online.'}
      </span>
      {!checking && (
        <button className="btn btn-sm btn-secondary" onClick={onRetry}>Retry</button>
      )}
    </div>
  );
}
