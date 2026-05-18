import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2 } from 'lucide-react';

export default function ReadingTimer({ formattedTime, onFinish }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 z-40 bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl border border-white/40 p-4 flex flex-row items-center justify-between gap-4 md:w-auto"
    >
      <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
        <Clock className="w-5 h-5 text-blue-600 animate-pulse" />
        <span className="text-blue-700 font-mono font-bold text-xl tracking-wider">
          {formattedTime}
        </span>
      </div>
      
      <button
        onClick={onFinish}
        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-md shadow-emerald-500/20"
      >
        <CheckCircle2 className="w-4 h-4" />
        Selesai Membaca
      </button>
    </motion.div>
  );
}
