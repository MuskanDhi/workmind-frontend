import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';

const STARTER_QUESTIONS = [
  'Which survey has the highest burnout risk?',
  'What is the average team mood score?',
  'What are the most common concerns?',
  'Which survey needs attention right now?',
];

const AIChat = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const storageKey = `workmind_chat_${user?._id || 'guest'}`;

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [
      {
        role: 'ai',
        text: "Hi! I'm your WorkMind AI assistant. Ask me anything about your survey data — mood trends, burnout risks, employee concerns, or what to do next.",
      },
    ];
  });
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = async (text) => {
    const q = text || input.trim();
    if (!q || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setLoading(true);

    try {
      const { data } = await api.post('/api/surveys/ask', { question: q, history: messages });
      setMessages(prev => [...prev, { role: 'ai', text: data.answer }]);
      
      // If AI performed an action (delete/close), refresh to show changes
      if (data.actionPerformed) {
        setTimeout(() => {
          window.location.reload();
        }, 1500); // Give user time to read the confirmation
      }
    } catch (err) {
      const msg = err.response?.data?.msg || "Sorry, I couldn't fetch that right now. Try again in a moment.";
      setMessages(prev => [
        ...prev,
        { role: 'ai', text: msg },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear your chat history?')) {
      const initialMsg = [
        {
          role: 'ai',
          text: "Hi! I'm your WorkMind AI assistant. Ask me anything about your survey data — mood trends, burnout risks, employee concerns, or what to do next.",
        },
      ];
      setMessages(initialMsg);
      localStorage.setItem(storageKey, JSON.stringify(initialMsg));
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-brand text-white rounded-full shadow-lg flex items-center justify-center hover:bg-brand/90 transition-all active:scale-95"
        aria-label="Open AI chat"
      >
        {open
          ? <X className="w-6 h-6" />
          : <MessageCircle className="w-6 h-6" />
        }
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 flex flex-col overflow-hidden animate-slide-in"
          style={{ maxHeight: '560px' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-brand to-brand/80 px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold text-white tracking-tight">WorkMind AI</span>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 1 && (
                <button 
                  onClick={clearChat} 
                  className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  title="Clear chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button onClick={() => setOpen(false)} className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: 200, maxHeight: 320 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] text-sm px-3.5 py-2.5 rounded-2xl leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-brand text-white rounded-br-sm shadow-sm'
                      : 'bg-gray-100 text-gray-700 rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100/80 backdrop-blur-sm text-gray-500 px-4 py-3 rounded-2xl rounded-bl-sm text-sm flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-brand/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-brand/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-brand/40 rounded-full animate-bounce" />
                  </div>
                  <span className="font-medium">Analyzing data...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Starter questions (only show when no user messages yet) */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {STARTER_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => send(q)}
                  className="text-[10px] bg-gray-50 border border-gray-200 text-gray-600 px-2.5 py-1.5 rounded-xl hover:bg-brand/10 hover:border-brand/30 hover:text-brand transition-colors text-left font-medium"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask anything about your surveys..."
              className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/40"
              maxLength={300}
              disabled={loading}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className="p-2 bg-brand text-white rounded-xl disabled:opacity-40 hover:bg-brand/90 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChat;
