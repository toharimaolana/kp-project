import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowRight, Heart } from 'lucide-react';

export default function SuccessModal({ isOpen, onHomeRedirect, isLiked, onLike }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center"
          >
            <div className="mx-auto w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Trophy className="w-10 h-10 text-amber-500" />
            </div>
            
            <h2 className="text-2xl font-black text-slate-800 mb-2">Luar Biasa! 🎉</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Terima kasih sudah membaca! Data literasimu telah dicatat dengan baik.
            </p>

            <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-sm font-semibold text-slate-700 mb-3">Apakah kamu menyukai modul bacaan ini?</p>
              <button 
                onClick={onLike}
                disabled={isLiked}
                className={`mx-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all ${
                  isLiked 
                    ? 'bg-red-50 text-red-500 cursor-not-allowed shadow-inner'
                    : 'bg-white border-2 border-red-100 text-slate-600 hover:border-red-300 hover:text-red-500 hover:bg-red-50 shadow-sm'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                {isLiked ? 'Sudah Disukai' : 'Suka Modul Ini'}
              </button>
            </div>
            
            <button
              onClick={onHomeRedirect}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-blue-600/30"
            >
              Kembali ke Beranda
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
