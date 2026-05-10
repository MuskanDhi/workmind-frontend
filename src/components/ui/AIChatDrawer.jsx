import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Sparkles, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';

const AIChatDrawer = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const storageKey = `workmind_drawer_chat_${user?._id || 'guest'}`;

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [
      { role: 'bot', text: 'Hello! I am your WorkMind AI assistant. I have analyzed your company\'s recent wellness surveys. How can I help you understand your team better today?' }
    ];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const { data } = await api.post('/api/surveys/ai-chat', { question: userMsg });
      setMessages(prev => [...prev, { role: 'bot', text: data.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'I apologize, but I encountered an error processing your request. Please try again in a moment.' }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear your chat history?')) {
      const initialMsg = [
        { role: 'bot', text: 'Hello! I am your WorkMind AI assistant. I have analyzed your company\'s recent wellness surveys. How can I help you understand your team better today?' }
      ];
      setMessages(initialMsg);
      localStorage.setItem(storageKey, JSON.stringify(initialMsg));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-navy/20 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-navy text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-brand rounded-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold">WorkMind AI Chat</h3>
              <p className="text-[10px] text-brandLight font-medium uppercase tracking-widest">Powered by Mistral</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {messages.length > 1 && (
              <button 
                onClick={clearChat} 
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Clear chat"
              >
                <Trash2 className="w-5 h-5 text-white/70 hover:text-white" />
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
                <div className={`p-2 rounded-lg shrink-0 ${msg.role === 'user' ? 'bg-navy ml-3' : 'bg-brand mr-3'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-navy text-white rounded-tr-none shadow-md' 
                    : 'bg-white text-gray-700 rounded-tl-none shadow-sm border border-gray-100'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-brand mr-3">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex space-x-1">
                  <div className="w-2 h-2 bg-brand rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-brand rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-brand rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-6 border-t border-gray-100 bg-white">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI about company wellness..."
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-3 bg-brand text-white rounded-xl hover:bg-brand/90 disabled:opacity-50 transition-all shadow-lg shadow-brand/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-4 text-[10px] text-gray-400 text-center flex items-center justify-center">
            <Sparkles className="w-3 h-3 mr-1 text-brand" />
            AI uses data from your latest 10 surveys to answer.
          </p>
        </form>
      </div>
    </div>
  );
};


export default AIChatDrawer;
