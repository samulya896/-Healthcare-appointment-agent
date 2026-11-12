import { useId, useState } from 'react';
import Icon from './Icon.jsx';

/** Labelled form field. Renders an input, select or textarea based on `as`. */
export default function Field({
  label,
  error,
  hint,
  icon,
  as = 'input',
  type = 'text',
  className = '',
  children,
  ...rest
}) {
  const id = useId();
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const Tag = as;
  const cls = [as === 'input' ? 'input' : as, icon && 'has-lead', isPassword && 'has-trail'].filter(Boolean).join(' ');

  return (
    <div className={`field ${className}`}>
      {label && <label htmlFor={id}>{label}</label>}
      <div className="input-wrap">
        {icon && (
          <span className="lead-icon">
            <Icon name={icon} size={16} />
          </span>
        )}
        <Tag
          id={id}
          className={cls}
          type={as === 'input' ? (isPassword && show ? 'text' : type) : undefined}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          {...rest}
        >
          {children}
        </Tag>
        {isPassword && (
          <button
            type="button"
            className="trail-btn"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            <Icon name={show ? 'eyeOff' : 'eye'} size={16} />
          </button>
        )}
      </div>
      {error ? (
        <span id={`${id}-err`} className="error-text" role="alert">
          {error}
        </span>
      ) : (
        hint && <span className="hint">{hint}</span>
      )}
    </div>
  );
}
