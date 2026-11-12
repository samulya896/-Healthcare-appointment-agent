import React, { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from './components/Header.jsx';
import LoginPage from './components/LoginPage.jsx';
import PatientPortal from './components/PatientPortal.jsx';
import AppointmentsList from './components/AppointmentsList.jsx';
import SymptomReliefGuide from './components/SymptomReliefGuide.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import InputBar from './components/InputBar.jsx';
import { sendMessage, getCurrentUser, setCurrentUser } from './services/api.js';
import './App.css';

export default function App() {
  const [user, setUser] = useState(getCurrentUser());
  const [activeTab, setActiveTab] = useState('portal'); // 'portal' | 'relief' | 'chat' | 'appointments'
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('hc_theme') || 'light');

  // Synchronize data-theme on document root and persist in localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hc_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Initialize personalized welcome message when user logs in
  useEffect(() => {
    if (user) {
      setMessages([
        {
          id: 'welcome',
          text: `Hello **${user.name}**! I'm your healthcare scheduling assistant. I have your patient profile on record. How can I help you today? You can ask me to find a doctor, check appointment slots, or schedule a visit.`,
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    }
  }, [user?.id]);

  const handleLogout = () => {
    setCurrentUser(null);
    setUser(null);
    setActiveTab('portal');
  };

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setActiveTab('portal');
  };

  const handleSend = useCallback(async (text) => {
    const userMsg = {
      id: uuidv4(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Pass patient context so AI assistant knows user details and medical history
      const reply = await sendMessage(text, user);
      const botMsg = {
        id: uuidv4(),
        text: reply,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = {
        id: uuidv4(),
        text: `⚠️ ${err.message || 'Something went wrong. Please check your backend server logs.'}`,
        sender: 'bot',
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Handle direct consultation request from Relief Guide
  const handleConsultSpecialist = (specialty, conditionTitle) => {
    setActiveTab('chat');
    const promptText = `I am experiencing symptoms related to ${conditionTitle}. Could you help me find an available ${specialty}?`;
    handleSend(promptText);
  };

  // If user is not logged in, show Login / Register page
  if (!user) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  return (
    <div className="app">
      <Header
        user={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="app-main">
        {activeTab === 'portal' && (
          <PatientPortal
            user={user}
            onUpdateUser={setUser}
            onGoToChat={() => setActiveTab('chat')}
          />
        )}

        {activeTab === 'relief' && (
          <SymptomReliefGuide
            user={user}
            onSelectSpecialtyForChat={handleConsultSpecialist}
          />
        )}

        {activeTab === 'chat' && (
          <div className="chat-view-wrapper">
            <div className="chat-context-banner">
              <span className="badge">Active Patient</span>
              <span><strong>{user.name}</strong> ({user.gender}, {user.age || '30'} yrs) • Blood {user.bloodGroup}</span>
              <button className="btn-small-link" onClick={() => setActiveTab('portal')}>
                View Full Health Record →
              </button>
            </div>
            <div className="chat-container">
              <ChatWindow messages={messages} isLoading={isLoading} />
              <InputBar onSend={handleSend} disabled={isLoading} />
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <AppointmentsList
            user={user}
            onBookNew={() => setActiveTab('chat')}
          />
        )}
      </main>
    </div>
  );
}
