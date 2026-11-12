import { EmptyState, ErrorState, LoadingBlock } from '../common/States.jsx';
import { formatTime } from '../../utils/format.js';

/** Time-slot picker with its own loading / error / empty states. */
export default function SlotGrid({ availability, value, onChange }) {
  const { data, loading, error, reload } = availability;
  const slots = data?.availableSlots || [];

  if (loading) return <LoadingBlock lines={2} height={36} />;
  if (error) return <ErrorState error={error} onRetry={reload} title="Could not load slots" />;
  if (slots.length === 0) {
    return <EmptyState icon="clock" title="No slots on this date" message="Pick a different date to see more times." />;
  }
  return (
    <div className="slot-grid">
      {slots.map((s) => (
        <button key={s} className={`slot ${s === value ? 'active' : ''}`} onClick={() => onChange(s)} aria-pressed={s === value}>
          {formatTime(s)}
        </button>
      ))}
    </div>
  );
}
