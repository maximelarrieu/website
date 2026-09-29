import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, Sparkles, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getChatResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useLanguage } from './LanguageContext';

export const AIChat: React.FC = () => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const QUICK_PROMPTS = language === 'en' ? [
    "What are your projects?",
    "What technologies do you like?",
    "What is your availability?"
  ] : [
    "Quels sont tes projets ?",
    "Qu’aimes-tu comme technologies ?",
    "Quelles sont tes disponibilités ?"
  ];

  // Reset messages when language changes to match greeting language
  useEffect(() => {
    setMessages([
      { role: 'model', text: t('chat.greetings'), timestamp: Date.now() }
    ]);
  }, [language]);

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
      const historyItems = messages.map(m => ({ role: m.role, text: m.text }));
      const responseText = await getChatResponse(messageToSend, language, historyItems);
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
            initial={{ opacity: 0, y: 15, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[90vw] md:w-[380px] h-[540px] bg-white border border-brand-200/80 rounded-2xl shadow-xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-brand-200/60 bg-brand-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent-soft rounded-lg text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-brand-900 tracking-tight">{t('chat.title')}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <p className="text-[10px] uppercase tracking-wider text-brand-500 font-bold">{t('chat.status')}</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-brand-200/50 rounded-full transition-colors text-brand-500 hover:text-brand-900">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-brand-50/50">
              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3 px-4 rounded-xl text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-accent-soft text-white rounded-br-none' 
                        : 'bg-white text-brand-900 border border-brand-200/60 rounded-bl-none'
                    }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 px-4 rounded-xl rounded-bl-none border border-brand-200/60 flex items-center gap-2.5 shadow-sm">
                    <Loader2 className="w-3.5 h-3.5 text-accent-soft animate-spin" />
                    <span className="text-xs text-brand-500">{t('chat.thinking')}</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-4 py-2 flex gap-1.5 overflow-x-auto scrollbar-hide bg-white border-t border-brand-100">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="whitespace-nowrap px-3 py-1.5 bg-brand-100 hover:bg-brand-200/50 border border-brand-200 rounded-full text-[10px] text-brand-500 font-medium transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-brand-200/60 bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend('')}
                  placeholder={t('chat.placeholder')}
                  className="flex-1 bg-brand-50 border border-brand-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-soft focus:border-accent-soft transition-all placeholder:text-brand-500 text-brand-900"
                />
                <button 
                  onClick={() => handleSend('')}
                  disabled={isLoading || !input.trim()}
                  className="p-2.5 bg-accent-soft hover:bg-accent-hover disabled:opacity-50 rounded-xl transition-all text-white shadow-sm flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
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
        className="fixed bottom-8 right-8 w-14 h-14 bg-accent-soft text-white rounded-full shadow-lg shadow-accent-soft/20 z-50 flex items-center justify-center transition-colors ring-4 ring-accent-soft/15"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </>
  );
};
