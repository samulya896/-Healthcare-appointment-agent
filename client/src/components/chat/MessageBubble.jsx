import ReactMarkdown from 'react-markdown';
import Icon from '../common/Icon.jsx';
import Avatar from '../common/Avatar.jsx';
import Button from '../common/Button.jsx';

const CAL_RE = /https:\/\/calendar\.google\.com\/calendar\/render[^\s)>\]]*/;

function ConfirmationCard({ link }) {
  return (
    <div className="chat-confirm">
      <span className="chat-confirm-icon"><Icon name="check" size={16} strokeWidth={2.4} /></span>
      <div>
        <strong>Appointment confirmed</strong>
        <span>Added to your appointments. Save it to your calendar:</span>
      </div>
      <a className="btn btn-secondary btn-sm" href={link} target="_blank" rel="noreferrer">
        <Icon name="calendar" size={14} /> Add to calendar
      </a>
    </div>
  );
}

export default function MessageBubble({ message, userName, onRetry }) {
  const isUser = message.role === 'user';
  const calendarLink = !isUser && !message.error ? message.text.match(CAL_RE)?.[0] : null;

  return (
    <div className={`msg ${isUser ? 'msg-user' : 'msg-bot'}`}>
      {isUser ? <Avatar name={userName} tone="blue" /> : <span className="msg-bot-avatar"><Icon name="sparkles" size={16} /></span>}
      <div className="msg-col">
        <div className={`bubble ${message.error ? 'bubble-error' : ''}`}>
          {isUser ? (
            <p>{message.text}</p>
          ) : message.error ? (
            <>
              <p><Icon name="alert" size={14} /> {message.text}</p>
              {onRetry && <Button variant="secondary" size="sm" icon="refresh" onClick={() => onRetry(message.retryText)} style={{ marginTop: 8 }}>Retry</Button>}
            </>
          ) : (
            <ReactMarkdown components={{ a: ({ node, ...p }) => <a {...p} target="_blank" rel="noreferrer" /> }}>
              {message.text}
            </ReactMarkdown>
          )}
        </div>
        {calendarLink && <ConfirmationCard link={calendarLink} />}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="msg msg-bot" aria-live="polite" aria-label="Assistant is typing">
      <span className="msg-bot-avatar"><Icon name="sparkles" size={16} /></span>
      <div className="bubble typing"><i /><i /><i /></div>
    </div>
  );
}
