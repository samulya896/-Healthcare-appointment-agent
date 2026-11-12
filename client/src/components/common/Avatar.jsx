import { initials } from '../../utils/format.js';

export default function Avatar({ name, size, tone }) {
  return (
    <span className={`avatar ${size === 'lg' ? 'avatar-lg' : ''} ${tone === 'blue' ? 'avatar-blue' : ''}`} aria-hidden="true">
      {initials(name)}
    </span>
  );
}
