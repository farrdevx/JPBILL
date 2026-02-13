
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, Terminal } from 'lucide-react';
import { getAIAssistance } from '../services/gemini';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: "Systems online. PteroAssistant ready for deployment. How can I assist with your infrastructure today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);
    const response = await getAIAssistance(userMessage, "Professional mode enabled. Focus on technical server management.");
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'bot', text: response }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="surface w-80 sm:w-96 h-[500px] rounded-2xl border-zinc-700 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white">
                 <Terminal size={16} />
              </div>
              <div>
                <span className="block font-bold text-sm text-white">PteroAI Expert</span>
                <span className="block text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Active System</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-zinc-800 rounded transition-colors text-zinc-500">
              <X size={18} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-300'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-zinc-900 border-t border-zinc-800 flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for technical assistance..."
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-600 transition-all text-zinc-200"
            />
            <button 
              onClick={handleSend}
              disabled={isTyping}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white shadow-lg shadow-indigo-600/10 disabled:opacity-50 transition-all"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20 hover:-translate-y-1 active:scale-95 transition-all group"
        >
          <MessageSquare size={24} />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 border-2 border-[#09090b] rounded-full"></div>
        </button>
      )}
    </div>
  );
};

export default AIChat;
