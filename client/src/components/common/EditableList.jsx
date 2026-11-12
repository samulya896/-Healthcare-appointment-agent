import { useState } from 'react';
import Icon from './Icon.jsx';
import Button from './Button.jsx';

/** List of text items with optional add/remove controls (controlled). */
export default function EditableList({ items, onChange, editing, placeholder, emptyText, error, onClearError }) {
  const [draft, setDraft] = useState('');

  const add = () => {
    const value = draft.trim();
    if (!value) return;
    onChange([...items, value]);
    setDraft('');
  };

  return (
    <div>
      {items.length === 0 ? (
        <p className="faint" style={{ fontSize: 14 }}>{emptyText}</p>
      ) : (
        <ul className="tag-list">
          {items.map((item, i) => (
            <li key={`${item}-${i}`} className="tag-item">
              <span>{item}</span>
              {editing && (
                <button
                  type="button"
                  className="tag-remove"
                  aria-label={`Remove ${item}`}
                  onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                >
                  <Icon name="x" size={14} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {editing && (
        <>
          <div className="tag-add">
            <input
              className="input"
              value={draft}
              maxLength={200}
              placeholder={placeholder}
              aria-label={placeholder}
              onChange={(e) => {
                setDraft(e.target.value);
                onClearError?.();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  add();
                }
              }}
            />
            <Button variant="secondary" icon="plus" onClick={add} disabled={!draft.trim()}>
              Add
            </Button>
          </div>
          {error && <p className="error-text" style={{ marginTop: 6, color: 'var(--danger)', fontSize: 12 }}>{error}</p>}
        </>
      )}
    </div>
  );
}
