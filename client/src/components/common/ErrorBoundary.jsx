import { Component } from 'react';
import Icon from './Icon.jsx';

/** Catches render errors so a single broken view never blanks the whole app. */
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('UI error:', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="fatal">
        <div className="glass fatal-card">
          <span className="state-icon" style={{ background: 'var(--danger-soft)', color: 'var(--danger)' }}>
            <Icon name="alert" size={22} />
          </span>
          <h2>Something went wrong</h2>
          <p className="muted">An unexpected error occurred. Reloading usually fixes it.</p>
          <button className="btn btn-primary" onClick={() => window.location.assign('/')}>Reload app</button>
        </div>
      </div>
    );
  }
}
