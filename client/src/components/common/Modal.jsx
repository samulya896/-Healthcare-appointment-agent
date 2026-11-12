import { useEffect } from 'react';
import Icon from './Icon.jsx';

export default function Modal({ title, subtitle, onClose, children, footer, maxWidth }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} style={maxWidth ? { maxWidth } : undefined}>
        <div className="modal-head">
          <div>
            <h2>{title}</h2>
            {subtitle && <p className="muted" style={{ marginTop: 2, fontSize: 14 }}>{subtitle}</p>}
          </div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose} aria-label="Close">
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}
