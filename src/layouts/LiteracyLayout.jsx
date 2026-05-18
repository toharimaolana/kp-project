import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { BookOpen, Home, Sparkles } from 'lucide-react';

const LiteracyLayout = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-slate-50 font-sans text-slate-900">
            <header className="fixed inset-x-0 top-0 z-50 border-b border-blue-100 bg-white/80 backdrop-blur-xl">
                <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <Link to="/literasi" className="group flex items-center gap-3">
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
        </div>
    );
};

export default LiteracyLayout;