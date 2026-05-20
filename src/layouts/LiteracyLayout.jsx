import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Home, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LiteracyLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showExitModal, setShowExitModal] = useState(false);
    const [pendingPath, setPendingPath] = useState(null);

    const handleNavClick = (e, path) => {
        // Deteksi apakah kita ada di halaman membaca (bukan halaman utama literasi)
        const isReadingPage = location.pathname.startsWith('/literasi/') && location.pathname !== '/literasi';
        
        let hasActiveSession = false;
        try {
            const sessionData = localStorage.getItem('reading_session');
            if (sessionData) {
                const parsed = JSON.parse(sessionData);
                if (parsed.endTime > Date.now()) {
                    hasActiveSession = true;
                }
            }
        } catch (err) {
            console.error('Error parsing session:', err);
        }

        // Jika user sedang di halaman baca & timer aktif, cegah pindah halaman
        if (isReadingPage && hasActiveSession) {
            e.preventDefault();
            setPendingPath(path);
            setShowExitModal(true);
        }
    };

    const confirmExit = () => {
        localStorage.removeItem('reading_session');
        setShowExitModal(false);
        if (pendingPath) {
            navigate(pendingPath);
        }
    };

    const cancelExit = () => {
        setShowExitModal(false);
        setPendingPath(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-slate-50 font-sans text-slate-900">
            <header className="fixed inset-x-0 top-0 z-50 border-b border-blue-100 bg-white/80 backdrop-blur-xl">
                <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <Link 
                        to="/literasi" 
                        onClick={(e) => handleNavClick(e, '/literasi')}
                        className="group flex items-center gap-3"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 transition-transform group-hover:scale-105">
                            <BookOpen className="h-5 w-5" aria-hidden />
                        </div>

                        <div>
                            <p className="text-base font-black leading-none text-slate-950">
                                Pusat Digital Literasi
                            </p>
                            <p className="mt-1 text-xs font-semibold text-slate-500">
                                SDN Rengas
                            </p>
                        </div>
                    </Link>

                    <Link
                        to="/"
                        onClick={(e) => handleNavClick(e, '/')}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                        <Home className="h-4 w-4" aria-hidden />
                        <span className="hidden sm:inline">Beranda</span>
                    </Link>
                </nav>
            </header>

            <main className="relative overflow-hidden">
                <div className="pointer-events-none fixed left-[-120px] top-20 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
                <div className="pointer-events-none fixed right-[-120px] top-64 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />

                <div className="relative">
                    <Outlet />
                </div>
            </main>

            <footer className="border-t border-slate-200 bg-white/70 py-6 backdrop-blur">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-center text-sm text-slate-500 sm:flex-row sm:px-6 lg:px-8">
                    <p className="font-semibold">
                        © {new Date().getFullYear()} Pusat Digital Literasi SDN Rengas
                    </p>

                    <p className="text-xs">
                        Dibuat untuk mendukung pembelajaran literasi digital siswa.
                    </p>
                </div>
            </footer>

            {/* Navigation Confirmation Modal Guard */}
            <AnimatePresence>
                {showExitModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={cancelExit}
                        />
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
                        >
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                                <AlertCircle className="h-8 w-8 text-amber-600" />
                            </div>
                            
                            <h2 className="mb-3 text-center text-xl font-black text-slate-900">
                                Yakin Ingin Keluar?
                            </h2>
                            
                            <p className="mb-8 text-center text-sm leading-relaxed text-slate-600">
                                Wah, kamu sedang asyik membaca! 📖 Jika kamu keluar sekarang, catatan membaca kamu hari ini tidak akan tersimpan. Apakah kamu yakin ingin keluar?
                            </p>
                            
                            <div className="flex flex-col-reverse gap-3 sm:flex-row">
                                <button
                                    onClick={cancelExit}
                                    className="flex-1 rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200 active:scale-95"
                                >
                                    Batal, Lanjutkan Membaca
                                </button>
                                <button
                                    onClick={confirmExit}
                                    className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-sm font-bold text-white shadow-md shadow-red-500/20 transition hover:bg-red-600 active:scale-95"
                                >
                                    Ya, Keluar
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LiteracyLayout;