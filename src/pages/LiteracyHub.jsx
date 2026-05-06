import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Clock,
  Flame,
  GraduationCap,
  Loader2,
  Sparkles,
  TrendingUp,
  Video,
  FileText,
} from 'lucide-react';
import CategoryFilter from '@/components/features/literacy/CategoryFilter';
import { getLiteracyHubBadgesByMaterialSlug } from '@/services/analytics';
import { getMateriLiterasi, isCMSConfigured } from '@/services/cmsClient';
import { isSupabaseConfigured } from '@/services/supabase';

const MotionHeader = motion.header;
const MotionSection = motion.section;
const MotionUl = motion.ul;
const MotionLi = motion.li;

const typeMeta = {
  flipbook: { label: 'Flipbook', Icon: BookOpen },
  video: { label: 'Video', Icon: Video },
  artikel: { label: 'Artikel', Icon: FileText },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 26 } },
};

const MaterialCard = ({ item, analyticsBadge }) => {
  const meta = typeMeta[item.materialType] || { label: item.materialType || 'Materi', Icon: Sparkles };
  const { label, Icon } = meta;

  return (
    <MotionLi variants={cardVariants} className="h-full list-none">
      <Link to={`/literasi/${item.slug}`} className="group block h-full">
        <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-600/10">
          <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
            <img
              src={item.thumbnail || 'https://via.placeholder.com/640x400?text=Materi+Literasi'}
              alt={item.title ? `Thumbnail: ${item.title}` : 'Thumbnail materi literasi'}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {analyticsBadge === 'popular' ? (
              <div className="absolute right-3 top-3 z-10">
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-white shadow-md shadow-amber-600/30 ring-2 ring-white/90">
                  <Flame className="h-3.5 w-3.5" aria-hidden />
                  Terpopuler
                </span>
              </div>
            ) : null}
            {analyticsBadge === 'trend' ? (
              <div className="absolute right-3 top-3 z-10">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-white shadow-md shadow-emerald-900/20 ring-2 ring-white/90">
                  <TrendingUp className="h-3.5 w-3.5" aria-hidden />
                  Trend
                </span>
              </div>
            ) : null}
            <div className="absolute left-3 top-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
                <GraduationCap className="h-3.5 w-3.5" aria-hidden />
                Kelas {item.grade}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-slate-800 shadow-sm ring-1 ring-slate-200/80">
                <Icon className="h-3.5 w-3.5 text-blue-600" aria-hidden />
                {label}
              </span>
            </div>
          </div>
          <div className="flex flex-1 flex-col p-5">
            {item.theme ? (
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
                {item.theme}
              </p>
            ) : null}
            <h2 className="mb-2 text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-600 line-clamp-2">
              {item.title}
            </h2>
            {item.excerpt ? (
              <p className="mb-4 text-sm leading-relaxed text-slate-600 line-clamp-3">{item.excerpt}</p>
            ) : (
              <p className="mb-4 text-sm text-slate-500">Materi literasi digital SDN Rengas.</p>
            )}
            <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
              {item.durationMinutes != null ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  ±{item.durationMinutes} menit
                </span>
              ) : (
                <span className="text-xs text-slate-400">Tanpa estimasi durasi</span>
              )}
              <span className="inline-flex items-center gap-1 text-sm font-bold text-blue-600">
                Buka materi
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </div>
          </div>
        </article>
      </Link>
    </MotionLi>
  );
};

const LiteracyHub = () => {
  const [grade, setGrade] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slugBadges, setSlugBadges] = useState({});

  useEffect(() => {
    let alive = true;

    const loadBadges = async () => {
      if (!isSupabaseConfigured) return;
      const map = await getLiteracyHubBadgesByMaterialSlug();
      if (!alive) return;
      setSlugBadges(Object.fromEntries(map));
    };

    loadBadges();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      if (!isCMSConfigured) {
        if (alive) {
          setItems([]);
          setLoading(false);
          setError(null);
        }
        return;
      }

      try {
        if (alive) {
          setLoading(true);
          setError(null);
        }
        const data = await getMateriLiterasi(grade);
        if (alive) {
          setItems(data || []);
        }
      } catch {
        if (alive) {
          setError('Gagal memuat materi. Coba lagi nanti.');
          setItems([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, [grade]);

  return (
    <main className="min-h-screen bg-slate-50 pb-16 pt-24 md:pt-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <MotionHeader
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-10 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-600/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Pusat Digital Literasi
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Jelajahi materi untuk{' '}
            <span className="text-blue-600">semua kelas</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Buku digital, video pembelajaran, dan artikel dipilih untuk mendukung literasi siswa SDN Rengas.
            Semua konten diambil dari sistem manajemen konten sekolah.
          </p>
        </MotionHeader>

        <MotionSection
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="mb-10 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
        >
          <CategoryFilter value={grade} onChange={setGrade} />
        </MotionSection>

        {!isCMSConfigured && (
          <div
            className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900"
            role="status"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            <div>
              <p className="font-bold">CMS belum dikonfigurasi</p>
              <p className="mt-1 text-sm text-amber-900/90">
                Tambahkan <code className="rounded bg-amber-100/80 px-1.5 py-0.5 text-xs">VITE_SANITY_PROJECT_ID</code>{' '}
                di lingkungan pengembangan, lalu publikasikan materi di Sanity Studio.
              </p>
            </div>
          </div>
        )}

        {isCMSConfigured && loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-slate-600">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" aria-hidden />
            <p className="text-sm font-semibold">Memuat materi…</p>
          </div>
        )}

        {isCMSConfigured && error && !loading && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-900" role="alert">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {isCMSConfigured && !loading && !error && items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 px-6 py-16 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-slate-300" aria-hidden />
            <p className="mt-4 text-lg font-bold text-slate-800">Belum ada materi yang dipublikasikan</p>
            <p className="mt-2 text-sm text-slate-600">
              Tambahkan dokumen <strong>Materi Literasi</strong> di Sanity dan aktifkan opsi{' '}
              <strong>Dipublikasikan</strong>.
            </p>
          </div>
        )}

        {isCMSConfigured && !loading && !error && items.length > 0 && (
          <MotionUl
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3"
          >
            {items.map((item) => (
              <MaterialCard
                key={item.id}
                item={item}
                analyticsBadge={slugBadges[item.slug]}
              />
            ))}
          </MotionUl>
        )}
      </div>
    </main>
  );
};

export default LiteracyHub;
