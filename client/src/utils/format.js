const TZ = 'Asia/Karachi'; // doctors' clinic timezone (+05:00)

export const initials = (name = '') =>
  name
    .replace(/^Dr\.?\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('') || '?';

export const titleCase = (s = '') => s.replace(/\b\w/g, (c) => c.toUpperCase());

export const firstName = (name = '') => name.split(/\s+/)[0] || '';

export const todayISO = () => new Date().toLocaleDateString('en-CA', { timeZone: TZ });

export function formatDate(dateStr, opts = { weekday: 'short', day: 'numeric', month: 'short' }) {
  const d = new Date(`${dateStr}T12:00:00+05:00`);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-GB', { ...opts, timeZone: TZ });
}

export function formatTime(timeSlot) {
  if (!timeSlot) return '—';
  const [h, m] = timeSlot.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${suffix}`;
}

export const formatFee = (fee) =>
  typeof fee === 'number' ? `PKR ${fee.toLocaleString('en-US')}` : '—';

export function formatDob(dob) {
  return /^\d{4}-\d{2}-\d{2}$/.test(dob || '')
    ? formatDate(dob, { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';
}

export const appointmentDate = (a) => new Date(a.startTime);

export const isUpcoming = (a) => appointmentDate(a).getTime() >= Date.now();

export const sortByTime = (list) =>
  [...list].sort((a, b) => appointmentDate(a) - appointmentDate(b));

/** Next 14 days is rendered by the backend's availableDates; this makes a short label pair. */
export function dayParts(dateStr) {
  return {
    weekday: formatDate(dateStr, { weekday: 'short' }),
    day: formatDate(dateStr, { day: 'numeric' }),
    month: formatDate(dateStr, { month: 'short' }),
  };
}
