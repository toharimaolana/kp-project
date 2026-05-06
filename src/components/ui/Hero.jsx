import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Award,
  ChevronRight,
  GraduationCap,
  BookOpen,
  Users,
  ArrowUpRight
} from 'lucide-react';
import { getProfilSekolah } from '@/services/cmsClient';

const Hero = () => {
  const [profil, setProfil] = useState(null);
  const [loadingProfil, setLoadingProfil] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchProfil = async () => {
      try {
        const data = await getProfilSekolah();
        if (mounted) setProfil(data);
      } catch (e) {
        if (mounted) setProfil(null);
      } finally {
        if (mounted) setLoadingProfil(false);
      }
    };
    fetchProfil();
    return () => { mounted = false; };
  }, []);

  const stats = useMemo(() => [
    {
      label: 'Akreditasi',
      value: profil?.akreditasi ?? '—',
      icon: Award,
      color: 'text-amber-400'
    },
    {
      label: 'Siswa',
      value: profil?.jumlahSiswa ?? '0',
      icon: GraduationCap,
      color: 'text-blue-400'
    },
    {
      label: 'Guru & Staf',
      value: profil?.jumlahGuruPegawai ?? '0',
      icon: Users,
      color: 'text-emerald-400'
    },
  ], [profil]);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-12 overflow-hidden bg-[#020617]">
      {/* 1. Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] shadow-inner" />
      </div>

      <div className="container mx-auto px-6 z-10">
        <div className="max-w-5xl mx-auto text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-ping" />
            INDONESIA EMAS 2045
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-7xl font-black text-white leading-[1.1] tracking-tight mb-8"
          >
            Membangun Karakter di <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-600">
              Era Digital Terdepan.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            SDN Rengas menghadirkan ekosistem pendidikan cerdas yang menggabungkan adab, kreativitas, dan inovasi teknologi untuk masa depan anak bangsa.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Link
              to="/literasi"
              className="group w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/25"
            >
              <BookOpen size={20} /> Pusat Literasi
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/profil"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all backdrop-blur-md"
            >
              Kenali Kami <ArrowUpRight size={18} />
            </Link>
          </motion.div>

          {/* Stats Cards - Bottom Layout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="group relative p-6 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl hover:bg-white/[0.06] hover:border-blue-500/30 transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-xl bg-white/5 ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                  <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-1/2 group-hover:w-full transition-all duration-700" />
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-black text-white">
                    {loadingProfil ? <span className="animate-pulse">...</span> : stat.value}
                  </h3>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;