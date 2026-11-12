import Icon from './Icon.jsx';

export default function Button({
  variant = 'primary',
  size,
  icon,
  loading = false,
  block = false,
  iconOnly = false,
  className = '',
  children,
  disabled,
  type = 'button',
  ...rest
}) {
  const cls = [
    'btn',
    `btn-${variant}`,
    size && `btn-${size}`,
    block && 'btn-block',
    iconOnly && 'btn-icon',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button type={type} className={cls} disabled={disabled || loading} {...rest}>
      {loading ? <span className="spinner" aria-hidden="true" /> : icon && <Icon name={icon} size={16} />}
      {children}
    </button>
  );
}
