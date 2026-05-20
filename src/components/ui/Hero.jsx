import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Award,
  ChevronRight,
  GraduationCap,
  BookOpen,
  Users,
  ArrowUpRight,
} from 'lucide-react';
import { getProfilSekolah } from '@/services/cmsClient';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

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

    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(
    () => [
      {
        label: 'Akreditasi',
        value: profil?.akreditasi ?? '—',
        icon: Award,
      },
      {
        label: 'Siswa',
        value: profil?.jumlahSiswa ?? '0',
        icon: GraduationCap,
      },
      {
        label: 'Guru & Staf',
        value: profil?.jumlahGuruPegawai ?? '0',
        icon: Users,
      },
    ],
    [profil]
  );

  return (
    <section className="relative overflow-hidden bg-[#020617] pt-28 pb-16 md:pt-32 md:pb-24">
      {/* background */}
      <div className="absolute inset-0">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left */}
          <div className="max-w-xl">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.05}
              className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-300"
            >
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              Indonesia Emas 2045
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.12}
              className="mt-6 text-4xl font-black leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl"
            >
              Pendidikan Dasar yang
              <span className="block text-slate-300">
                Hangat, Modern, dan Bermakna.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.2}
              className="mt-6 text-base leading-8 text-slate-400 md:text-lg"
            >
              SDN Rengas membangun lingkungan belajar yang menumbuhkan
              karakter, rasa ingin tahu, dan kesiapan siswa menghadapi era
              digital dengan pendekatan yang positif dan adaptif.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.28}
              className="mt-8 flex flex-col gap-4 sm:flex-row"
            >
              <Link
                to="/"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-500"
              >
                Kenali Kami
                <ChevronRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/literasi"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/10"
              >
                <BookOpen size={18} />
                Pusat Literasi
                <ArrowUpRight
                  size={17}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </motion.div>

            {/* simple stats */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.36}
              className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6"
            >
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="flex items-center gap-2 text-slate-500">
                    <stat.icon size={15} />
                    <span className="text-[11px] uppercase tracking-[0.14em]">
                      {stat.label}
                    </span>
                  </div>
                  <p className="mt-2 text-xl font-bold text-white md:text-2xl">
                    {loadingProfil ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      stat.value
                    )}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.18}
            className="relative"
          >
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-3 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div className="overflow-hidden rounded-[22px]">
                <img
                  src="/footage-sdnrengas.jpeg"
                  alt="Lingkungan belajar SDN Rengas"
                  className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[520px]"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur-md">
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                  Lingkungan Belajar
                </p>
                <p className="mt-1 text-sm font-medium text-white">
                  Aman, nyaman, dan mendukung tumbuh kembang siswa
                </p>
              </div>
              <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-300 sm:flex">
                <ArrowUpRight size={18} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;