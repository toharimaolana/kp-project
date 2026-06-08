import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Bot, User, Trash2, HelpCircle } from 'lucide-react';
import { fetchFAQ } from '@/services/cmsService';

const VirtualAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Halo! Saya Asisten Virtual SDN Rengas. Ada yang bisa saya bantu hari ini?", sender: 'bot' }
  ]);
  const [faqs, setFaqs] = useState([]);
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchFAQ().then(data => setFaqs(data || []));
  }, []);

  // Auto-scroll to bottom of chat when new message is added or panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages, isOpen]);

  const handleFaqClick = (faq) => {
    setMessages(prev => [
      ...prev,
      { id: Date.now(), text: faq.question, sender: 'user' },
      { id: Date.now() + 1, text: faq.answer, sender: 'bot' }
    ]);
  };

  const handleResetChat = () => {
    setMessages([
      { id: 1, text: "Halo! Saya Asisten Virtual SDN Rengas. Ada yang bisa saya bantu hari ini?", sender: 'bot' }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white rounded-3xl shadow-2xl shadow-blue-900/15 w-85 sm:w-96 mb-5 overflow-hidden border border-slate-100 flex flex-col"
            style={{ maxHeight: '520px' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-white/15 p-2 rounded-2xl backdrop-blur-sm">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white tracking-wide">Asisten Virtual</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] text-blue-100 font-semibold uppercase tracking-wider">Online</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                {messages.length > 1 && (
                  <button 
                    onClick={handleResetChat} 
                    className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all"
                    title="Hapus Percakapan"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all"
                  title="Tutup Chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 h-80 overflow-y-auto p-4 space-y-4 bg-slate-50/70 scrollbar-thin scrollbar-thumb-slate-200">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Bot Avatar */}
                  {msg.sender === 'bot' && (
                    <div className="h-8 w-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0 shadow-sm">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                  )}

                  <div className={`max-w-[75%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-500/10'
                      : 'bg-white text-slate-800 border border-slate-200/60 rounded-bl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>

                  {/* User Avatar */}
                  {msg.sender === 'user' && (
                    <div className="h-8 w-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center shrink-0 shadow-sm">
                      <User className="h-4 w-4 text-indigo-600" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Suggestions */}
            <div className="p-4 border-t border-slate-100 bg-white shadow-inner">
              <div className="flex items-center gap-1.5 mb-2.5">
                <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pertanyaan Populer:</p>
              </div>
              <div className="flex flex-col gap-2 max-h-36 overflow-y-auto pr-1">
                {faqs.map((faq, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleFaqClick(faq)}
                    className="text-left text-xs bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-3.5 py-2.5 rounded-xl border border-slate-100 hover:border-blue-100 transition-all duration-200 shadow-sm font-medium flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    <span className="flex-1 truncate">{faq.question}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-4.5 rounded-full shadow-xl shadow-blue-600/30 transition-transform duration-300 hover:scale-110 active:scale-95 flex items-center justify-center relative group"
        title="Tanya Asisten Virtual"
      >
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>
    </div>
  );
};

export default VirtualAssistant;
