import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MessageBubble, { TypingIndicator } from '../components/chat/MessageBubble.jsx';
import ChatComposer from '../components/chat/ChatComposer.jsx';
import SuggestedPrompts from '../components/chat/SuggestedPrompts.jsx';
import Button from '../components/common/Button.jsx';
import Icon from '../components/common/Icon.jsx';
import { useChat } from '../context/ChatContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function AssistantPage() {
  const { user } = useAuth();
  const { messages, sending, send, reset } = useChat();
  const endRef = useRef(null);
  const sentPrompt = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();

  // A prompt can be handed over from other pages (e.g. the symptom guide).
  useEffect(() => {
    const prompt = location.state?.prompt;
    if (prompt && !sentPrompt.current) {
      sentPrompt.current = true;
      navigate(location.pathname, { replace: true, state: null });
      send(prompt);
    }
  }, [location, navigate, send]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, sending]);

  const onlyGreeting = messages.length <= 1;

  return (
    <div className="chat-page card">
      <header className="chat-head">
        <span className="msg-bot-avatar lg"><Icon name="sparkles" size={20} /></span>
        <div>
          <h2>Healthcare assistant</h2>
          <p className="muted">Doctor discovery, availability and booking · does not give medical diagnoses</p>
        </div>
        <Button variant="ghost" size="sm" icon="refresh" onClick={reset} disabled={sending} style={{ marginLeft: 'auto' }}>
          New chat
        </Button>
      </header>

      <div className="chat-scroll" role="log" aria-live="polite">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} userName={user.name} onRetry={sending ? undefined : send} />
        ))}
        {sending && <TypingIndicator />}
        <div ref={endRef} />
      </div>

      <div className="chat-foot">
        {onlyGreeting && <SuggestedPrompts onPick={send} disabled={sending} />}
        <ChatComposer onSend={send} disabled={sending} />
        <p className="chat-note">For emergencies, call your local emergency number immediately.</p>
      </div>
    </div>
  );
}
