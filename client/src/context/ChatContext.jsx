import { createContext, useContext, useState, useCallback, useEffect } from 'react';

import { useAuth } from './AuthContext.jsx';
import { sendChatMessage, resetChatSession } from '../services/api.js';
import { firstName } from '../utils/format.js';

const ChatContext = createContext(null);

const greeting = (user) => ({
  id: 'welcome',
  role: 'assistant',
  text: `Hello ${firstName(user.name)}, I'm your healthcare scheduling assistant. I can help you find a doctor, check availability, book or cancel appointments, and point you to the right specialist. What can I help you with today?`,
});

/** Chat state lives above the router so the conversation survives page navigation. */
export function ChatProvider({ children }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setMessages(user ? [greeting(user)] : []);
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const send = useCallback(
    async (text) => {
      const clean = text.trim();
      if (!clean || sending) return;
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: 'user', text: clean }]);
      setSending(true);
      try {
        const reply = await sendChatMessage(clean, user);
        setMessages((m) => [...m, { id: crypto.randomUUID(), role: 'assistant', text: reply }]);
      } catch (err) {
        setMessages((m) => [
          ...m,
          { id: crypto.randomUUID(), role: 'assistant', text: err.message, error: true, retryText: clean },
        ]);
      } finally {
        setSending(false);
      }
    },
    [sending, user]
  );

  const reset = useCallback(() => {
    resetChatSession();
    setMessages(user ? [greeting(user)] : []);
  }, [user]);

  return <ChatContext.Provider value={{ messages, sending, send, reset }}>{children}</ChatContext.Provider>;
}

export const useChat = () => useContext(ChatContext);
