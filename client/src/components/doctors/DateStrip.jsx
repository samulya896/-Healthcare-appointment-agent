import { dayParts } from '../../utils/format.js';

export default function DateStrip({ dates, value, onChange }) {
  return (
    <div className="date-strip" role="listbox" aria-label="Available dates">
      {dates.map((d) => {
        const p = dayParts(d);
        return (
          <button key={d} role="option" aria-selected={d === value} className={`date-chip ${d === value ? 'active' : ''}`} onClick={() => onChange(d)}>
            <span>{p.weekday}</span>
            <strong>{p.day}</strong>
            <span>{p.month}</span>
          </button>
        );
      })}
    </div>
  );
}
