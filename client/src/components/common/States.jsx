import Icon from './Icon.jsx';
import Button from './Button.jsx';

export function LoadingBlock({ lines = 3, height = 18 }) {
  return (
    <div aria-busy="true" aria-label="Loading" style={{ display: 'grid', gap: 10 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height, width: i === lines - 1 ? '60%' : '100%' }} />
      ))}
    </div>
  );
}

export function EmptyState({ icon = 'info', title, message, action }) {
  return (
    <div className="state-box">
      <span className="state-icon"><Icon name={icon} size={22} /></span>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ error, onRetry, title = 'Something went wrong' }) {
  const offline = error?.network;
  return (
    <div className="state-box is-error" role="alert">
      <span className="state-icon"><Icon name={offline ? 'wifiOff' : 'alert'} size={22} /></span>
      <h3>{offline ? 'Server unreachable' : title}</h3>
      <p>{error?.message || 'An unexpected error occurred.'}</p>
      {onRetry && <Button variant="secondary" size="sm" icon="refresh" onClick={onRetry}>Try again</Button>}
    </div>
  );
}

export function Alert({ type = 'info', icon, children }) {
  const defaults = { error: 'alert', warning: 'alert', info: 'info', success: 'check' };
  return (
    <div className={`alert alert-${type}`} role={type === 'error' ? 'alert' : undefined}>
      <Icon name={icon || defaults[type]} size={16} />
      <div>{children}</div>
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', color: 'var(--primary)' }}>
      <span className="spinner" style={{ width: 28, height: 28 }} />
    </div>
  );
}
