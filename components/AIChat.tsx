import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Loader2, Sparkles, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getChatResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const QUICK_PROMPTS = [
  "Tell me about the EDF project",
  "Preferred tech stack?",
  "Blockchain expertise?",
  "Availability?"
];

export const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello. I am Maximus. How can I enlighten you on his industrial expertise or technical achievements?", timestamp: Date.now() }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (text: string) => {
    const messageToSend = text || input;
    if (!messageToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: messageToSend, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    if (!text) setInput('');
    setIsLoading(true);

    try {
      const responseText = await getChatResponse(messageToSend);
      setMessages(prev => [...prev, { role: 'model', text: responseText, timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[600px] bg-slate-900/95 backdrop-blur-2xl border border-slate-700/50 rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden ring-1 ring-white/10"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/5 bg-gradient-to-r from-indigo-600/20 to-transparent flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/20">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Maximus</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Online</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-lg shadow-indigo-600/20' 
                        : 'bg-slate-800/80 text-slate-200 border border-white/5 rounded-bl-none'
                    }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800/50 p-4 rounded-2xl rounded-bl-none border border-white/5 flex items-center gap-3">
                    <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                    <span className="text-xs text-slate-400 font-medium">Analyzing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-6 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="whitespace-nowrap px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[11px] text-slate-300 transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-white/5 bg-slate-950/50">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend('')}
                  placeholder="Ask a technical question..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600 text-white"
                />
                <button 
                  onClick={() => handleSend('')}
                  disabled={isLoading || !input.trim()}
                  className="p-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-2xl transition-all text-white shadow-lg shadow-indigo-600/30"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl shadow-indigo-500/40 z-50 flex items-center justify-center transition-colors ring-4 ring-indigo-500/20"
      >
        {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
      </motion.button>
    </>
  );
};
