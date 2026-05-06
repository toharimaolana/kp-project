import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { fetchFAQ } from '@/services/cmsService';

const VirtualAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Halo! Saya Asisten Virtual SDN Rengas. Ada yang bisa saya bantu?", sender: 'bot' }
  ]);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    fetchFAQ().then(data => setFaqs(data));
  }, []);

  const handleFaqClick = (faq) => {
    setMessages(prev => [
      ...prev,
      { id: Date.now(), text: faq.question, sender: 'user' },
      { id: Date.now() + 1, text: faq.answer, sender: 'bot' }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 mb-4 overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="bg-blue-600 p-4 flex justify-between items-center">
              <div className="flex items-center text-white">
                <Bot className="h-6 w-6 mr-2" />
                <div>
                  <h3 className="font-bold text-sm">Virtual Assistant</h3>
                  <p className="text-xs text-blue-100">SD Negeri Rengas</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white hover:bg-blue-700 rounded-full p-1 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Suggestions */}
            <div className="p-4 border-t border-gray-100 bg-white">
              <p className="text-xs text-gray-500 mb-2">Pilih pertanyaan populer:</p>
              <div className="flex flex-wrap gap-2">
                {faqs.map((faq, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleFaqClick(faq)}
                    className="text-xs bg-gray-100 hover:bg-blue-100 hover:text-blue-700 text-gray-700 px-3 py-2 rounded-full transition-colors duration-200"
                  >
                    {faq.question}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>
    </div>
  );
};

export default VirtualAssistant;
