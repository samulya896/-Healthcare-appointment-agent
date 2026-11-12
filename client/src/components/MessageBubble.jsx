import React from 'react';
import ReactMarkdown from 'react-markdown';
import './MessageBubble.css';

function formatTime(date) {
  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export default function MessageBubble({ message }) {
  const { text, sender, timestamp, isError } = message;
  const isUser = sender === 'user';

  return (
    <div className={`message-row ${isUser ? 'user' : 'bot'}`}>
      {!isUser && <div className="bot-avatar">✚</div>}
      <div className={`bubble ${isUser ? 'bubble-user' : 'bubble-bot'} ${isError ? 'bubble-error' : ''}`}>
        {isUser ? (
          <p className="bubble-text">{text}</p>
        ) : (
          <div className="bubble-markdown">
            <ReactMarkdown
              components={{
                a: ({ node, children, ...props }) => (
                  <a {...props} target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
              }}
            >
              {text}
            </ReactMarkdown>
          </div>
        )}
        <span className="timestamp">{formatTime(timestamp)}</span>
      </div>
    </div>
  );
}
