import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Award,
  ChevronRight,
  GraduationCap,
  BookOpen,
  Users,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Info,
  Download,
  Check,
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
  const [activeTab, setActiveTab] = useState('spmb'); // Default ke SPMB agar 'hidup' dan informatif
  const [spmbSubTab, setSpmbSubTab] = useState('jadwal'); // 'jadwal' atau 'persyaratan'

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

  const statusInfo = useMemo(() => {
    const now = new Date();
    const pendaftaranStart = new Date('2026-06-08T00:00:00');
    const pendaftaranEnd = new Date('2026-06-19T23:59:59');
    const pengumumanDate = new Date('2026-06-26T23:59:59');
    const daftarUlangEnd = new Date('2026-07-03T23:59:59');

    if (now < pendaftaranStart) {
      const diffMs = pendaftaranStart - now;
      const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
      if (diffHours <= 24) {
        return {
          status: 'Pendaftaran Dibuka Besok!',
          color: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
          badgeColor: 'bg-amber-400',
          subtext: 'Pendaftaran resmi dibuka besok pagi, 8 Juni 2026.'
        };
      }
      return {
        status: 'Persiapan Pendaftaran',
        color: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
        badgeColor: 'bg-blue-400',
        subtext: 'Pendaftaran dibuka mulai 8 Juni 2026.'
      };
    } else if (now >= pendaftaranStart && now <= pendaftaranEnd) {
      const diffMs = pendaftaranEnd - now;
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return {
        status: 'Pendaftaran Sedang Berlangsung',
        color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
        badgeColor: 'bg-emerald-400',
        subtext: `Segera daftar! Sisa ${diffDays} hari lagi.`
      };
    } else if (now > pendaftaranEnd && now < pengumumanDate) {
      return {
        status: 'Proses Seleksi Berkas',
        color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
        badgeColor: 'bg-indigo-400',
        subtext: 'Hasil seleksi diumumkan pada 26 Juni 2026.'
      };
    } else if (now >= pengumumanDate && now < new Date('2026-07-01T00:00:00')) {
      return {
        status: 'Pengumuman Hasil Kelulusan',
        color: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
        badgeColor: 'bg-purple-400',
        subtext: 'Silakan cek status penerimaan Anda.'
      };
    } else if (now >= new Date('2026-07-01T00:00:00') && now <= daftarUlangEnd) {
      return {
        status: 'Masa Daftar Ulang',
        color: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
        badgeColor: 'bg-teal-400',
        subtext: 'Batas daftar ulang hingga 3 Juli 2026.'
      };
    } else {
      return {
        status: 'SPMB TA 2026/2027 Selesai',
        color: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
        badgeColor: 'bg-slate-500',
        subtext: 'Tahun Ajaran Baru dimulai 13 Juli 2026.'
      };
    }
  }, []);

  const timelineItems = useMemo(() => {
    const now = new Date();
    const sosialisasiEnd = new Date('2026-06-02T23:59:59');
    const pendaftaranStart = new Date('2026-06-08T00:00:00');
    const pendaftaranEnd = new Date('2026-06-19T23:59:59');
    const pengumumanDate = new Date('2026-06-26T23:59:59');
    const daftarUlangEnd = new Date('2026-07-03T23:59:59');

    return [
      {
        label: 'Sosialisasi',
        date: '4 Mei - 2 Juni 2026',
        status: now > sosialisasiEnd ? 'selesai' : 'aktif',
        desc: 'Penyebaran info penerimaan'
      },
      {
        label: 'Pelaksanaan Penerimaan',
        date: '8 - 19 Juni 2026',
        status: now > pendaftaranEnd 
          ? 'selesai' 
          : (now >= pendaftaranStart && now <= pendaftaranEnd) 
            ? 'aktif' 
            : (now < pendaftaranStart && pendaftaranStart - now <= 24 * 60 * 60 * 1000) 
              ? 'segera' 
              : 'mendatang',
        desc: 'Jalur Afirmasi, Domisili, Mutasi, Anak Guru'
      },
      {
        label: 'Pengumuman Hasil',
        date: '26 Juni 2026',
        status: now > pengumumanDate 
          ? 'selesai' 
          : (now.toDateString() === new Date('2026-06-26').toDateString()) 
            ? 'aktif' 
            : 'mendatang',
        desc: 'Pengumuman hasil seleksi'
      },
      {
        label: 'Daftar Ulang',
        date: '1 - 3 Juli 2026',
        status: now > daftarUlangEnd 
          ? 'selesai' 
          : (now >= new Date('2026-07-01T00:00:00') && now <= daftarUlangEnd) 
            ? 'aktif' 
            : 'mendatang',
        desc: 'Pemberkasan ulang calon murid'
      },
      {
        label: 'Hari Pertama & MPLS',
        date: '13 - 17 Juli 2026',
        status: now > new Date('2026-07-17T23:59:59') 
          ? 'selesai' 
          : (now >= new Date('2026-07-13T00:00:00') && now <= new Date('2026-07-17T23:59:59')) 
            ? 'aktif' 
            : 'mendatang',
        desc: 'Masa Pengenalan Lingkungan Sekolah'
      }
    ];
  }, []);

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
              onClick={() => setActiveTab('spmb')}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] cursor-pointer transition-all duration-300 ${
                activeTab === 'spmb'
                  ? 'border-blue-400/20 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20'
                  : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
              }`}
            >
              <span className={`h-2 w-2 rounded-full animate-pulse ${
                activeTab === 'spmb' ? 'bg-blue-400' : 'bg-emerald-400'
              }`} />
              {activeTab === 'spmb' 
                ? 'Sedang Dilihat: SPMB TA 2026/2027' 
                : `SPMB 2026: ${statusInfo.status}`}
              <ChevronRight size={12} className="opacity-70" />
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
            className="relative w-full max-w-lg mx-auto lg:max-w-none"
          >
            {/* Tab Header Container */}
            <div className="flex gap-2 p-1 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-md mb-4 max-w-xs">
              {['galeri', 'spmb'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative flex-1 py-2 text-xs font-bold rounded-full transition-colors cursor-pointer ${
                    activeTab === tab ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeHeroTab"
                      className="absolute inset-0 bg-blue-600 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      style={{ zIndex: -1 }}
                    />
                  )}
                  {tab === 'galeri' ? '📸 Foto Sekolah' : '📅 SPMB 2026'}
                </button>
              ))}
            </div>

            {/* Main Content Box */}
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-3 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl min-h-[440px] sm:min-h-[500px] lg:min-h-[560px] flex flex-col">
              <AnimatePresence mode="wait">
                {activeTab === 'galeri' ? (
                  <motion.div
                    key="galeri"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 flex flex-col justify-between"
                  >
                    <div className="overflow-hidden rounded-[22px]">
                      <img
                        src="/footage-sdnrengas.jpeg"
                        alt="Lingkungan belajar SDN Rengas"
                        className="h-[300px] w-full object-cover sm:h-[360px] lg:h-[420px] rounded-[22px]"
                      />
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
                ) : (
                  <motion.div
                    key="spmb"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 flex flex-col justify-between p-4"
                  >
                    {/* Event Status Header */}
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4 mb-4">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">
                            Kegiatan Berlangsung
                          </span>
                          <h3 className="text-lg font-black text-white mt-0.5">
                            SPMB TA 2026/2027
                          </h3>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold ${statusInfo.color}`}>
                          <Clock size={11} className="animate-spin [animation-duration:3s]" />
                          {statusInfo.status}
                        </span>
                      </div>

                      {/* Sub-Tabs: Jadwal vs Persyaratan */}
                      <div className="flex gap-4 border-b border-white/5 pb-2.5 mb-4">
                        {['jadwal', 'persyaratan'].map((subTab) => (
                          <button
                            key={subTab}
                            onClick={() => setSpmbSubTab(subTab)}
                            className={`relative text-[11px] font-bold uppercase tracking-wider pb-1 transition-colors cursor-pointer ${
                              spmbSubTab === subTab ? 'text-white' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {spmbSubTab === subTab && (
                              <motion.div
                                layoutId="activeSpmbSubTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                              />
                            )}
                            {subTab === 'jadwal' ? 'Jadwal & Alur' : 'Persyaratan Usia'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dynamic Body content */}
                    <div className="flex-1 flex flex-col justify-center min-h-[220px]">
                      <AnimatePresence mode="wait">
                        {spmbSubTab === 'jadwal' ? (
                          <motion.div
                            key="jadwal"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-4 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                          >
                            {timelineItems.map((item, idx) => {
                              let bulletColor = 'bg-slate-800 border-slate-700 text-slate-500';
                              let textColor = 'text-slate-500';
                              let labelColor = 'text-slate-400';
                              let lineActive = false;

                              if (item.status === 'selesai') {
                                bulletColor = 'bg-blue-600/20 border-blue-500/30 text-blue-400';
                                textColor = 'text-slate-500';
                                labelColor = 'text-slate-500';
                                lineActive = true;
                              } else if (item.status === 'aktif') {
                                bulletColor = 'bg-emerald-500 border-emerald-400 text-white ring-4 ring-emerald-500/20';
                                textColor = 'text-emerald-400';
                                labelColor = 'text-white font-bold';
                              } else if (item.status === 'segera') {
                                bulletColor = 'bg-amber-500 border-amber-400 text-white ring-4 ring-amber-500/20 animate-pulse';
                                textColor = 'text-amber-400';
                                labelColor = 'text-white font-bold';
                              }

                              return (
                                <div key={idx} className="relative flex gap-4 pl-7">
                                  {idx < timelineItems.length - 1 && (
                                    <div className={`absolute left-[11px] top-5 bottom-0 w-[2px] ${
                                      lineActive ? 'bg-blue-500/20' : 'bg-slate-800'
                                    }`} />
                                  )}
                                  <div className={`absolute left-0 top-1 h-[22px] w-[22px] rounded-full border flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${bulletColor}`}>
                                    {item.status === 'selesai' ? (
                                      <Check size={10} className="stroke-[3]" />
                                    ) : (
                                      idx + 1
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5">
                                      <h4 className={`text-xs ${labelColor}`}>{item.label}</h4>
                                      <span className={`text-[10px] font-semibold tracking-wide ${textColor}`}>
                                        {item.date}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </motion.div>
                        ) : (
                          <motion.div
                            key="persyaratan"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-3 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                          >
                            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-colors">
                              <div className="flex items-start gap-2.5">
                                <div className="mt-0.5 p-1 rounded bg-blue-500/10 text-blue-400">
                                  <CheckCircle2 size={13} className="stroke-[2.5]" />
                                </div>
                                <div>
                                  <h5 className="text-[10px] uppercase tracking-wider text-blue-400 font-extrabold">
                                    Prioritas Utama (Usia 7+)
                                  </h5>
                                  <p className="text-xs text-white mt-0.5 font-semibold">
                                    Harus berusia 7 tahun pada 1 Juli 2026
                                  </p>
                                  <p className="text-[10px] text-slate-400 mt-0.5">
                                    Diprioritaskan penuh dalam kuota penerimaan kelas 1 SD.
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-colors">
                              <div className="flex items-start gap-2.5">
                                <div className="mt-0.5 p-1 rounded bg-emerald-500/10 text-emerald-400">
                                  <CheckCircle2 size={13} className="stroke-[2.5]" />
                                </div>
                                <div>
                                  <h5 className="text-[10px] uppercase tracking-wider text-emerald-400 font-extrabold">
                                    Batas Usia Standar (Usia 6+)
                                  </h5>
                                  <p className="text-xs text-white mt-0.5 font-semibold">
                                    Paling rendah berusia 6 tahun per 1 Juli 2026
                                  </p>
                                  <p className="text-[10px] text-slate-400 mt-0.5">
                                    Dapat mendaftar secara umum sesuai prosedur SPMB.
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-colors">
                              <div className="flex items-start gap-2.5">
                                <div className="mt-0.5 p-1 rounded bg-amber-500/10 text-amber-400">
                                  <Info size={13} className="stroke-[2.5]" />
                                </div>
                                <div>
                                  <h5 className="text-[10px] uppercase tracking-wider text-amber-400 font-extrabold">
                                    Pengecualian Khusus (5 Tahun 6 Bulan)
                                  </h5>
                                  <p className="text-xs text-white mt-0.5 font-semibold">
                                    Bakat Istimewa & Kesiapan Psikis
                                  </p>
                                  <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                                    Dikecualikan paling rendah 5.5 tahun jika memiliki potensi kecerdasan istimewa/bakat & kesiapan psikis (rekomendasi psikolog profesional).
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* SPMB CTA Buttons */}
                    <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-4 mt-4">
                      <a
                        href="#ppdb"
                        className="group flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white transition-all duration-300 hover:bg-blue-500 shadow-md shadow-blue-500/10 cursor-pointer"
                      >
                        <FileText size={13} />
                        Alur Pendaftaran
                      </a>
                      <a
                        href="#contact"
                        className="group flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-bold text-white transition-all duration-300 hover:bg-white/10 cursor-pointer"
                      >
                        <Download size={13} />
                        Unduh Brosur
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;