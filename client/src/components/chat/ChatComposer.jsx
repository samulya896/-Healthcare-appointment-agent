import { useRef, useState } from 'react';
import Icon from '../common/Icon.jsx';

export default function ChatComposer({ onSend, disabled }) {
  const [text, setText] = useState('');
  const ref = useRef(null);

  const submit = () => {
    if (!text.trim() || disabled) return;
    onSend(text);
    setText('');
    if (ref.current) ref.current.style.height = 'auto';
  };

  return (
    <div className="composer">
      <textarea
        ref={ref}
        rows={1}
        value={text}
        maxLength={1000}
        placeholder="Ask about doctors or appointments…"
        aria-label="Message"
        onChange={(e) => {
          setText(e.target.value);
          e.target.style.height = 'auto';
          e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
      />
      <button className="composer-send" onClick={submit} disabled={disabled || !text.trim()} aria-label="Send message">
        <Icon name="send" size={18} />
      </button>
    </div>
  );
}
