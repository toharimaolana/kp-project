import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, User, ArrowLeft } from 'lucide-react';

export default function GuestCheckInModal({ isOpen, onSubmit, onCancel }) {
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && studentClass.trim()) {
      onSubmit(name.trim(), studentClass.trim());
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
          >
            <div className="bg-blue-600 p-6 text-center">
              <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Mulai Membaca</h2>
              <p className="text-blue-100 mt-1 text-sm">Isi data diri sebelum membaca materi</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="name">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 block w-full rounded-xl border-slate-300 bg-slate-50 border py-3 px-4 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                      placeholder="Contoh: Budi Santoso"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="class">
                    Kelas
                  </label>
                  <select
                    id="class"
                    required
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="block w-full rounded-xl border-slate-300 bg-slate-50 border py-3 px-4 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  >
                    <option value="" disabled>Pilih Kelas</option>
                    <option value="1">Kelas 1</option>
                    <option value="2">Kelas 2</option>
                    <option value="3">Kelas 3</option>
                    <option value="4">Kelas 4</option>
                    <option value="5">Kelas 5</option>
                    <option value="6">Kelas 6</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={!name.trim() || !studentClass}
                  className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Mulai Sekarang
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-600 font-bold py-3 px-4 rounded-xl hover:bg-slate-200 hover:text-slate-800 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Kembali ke Beranda
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
