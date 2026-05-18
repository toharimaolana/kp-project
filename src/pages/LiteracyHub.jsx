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
  Eye,
  Heart
} from 'lucide-react';

import CategoryFilter from '@/components/features/literacy/CategoryFilter';
import { getLiteracyHubBadgesByMaterialSlug } from '@/services/analytics';
import { getMateriLiterasi, isCMSConfigured } from '@/services/cmsClient';
import { isSupabaseConfigured } from '@/services/supabase';
import { getAllEngagementMetrics } from '@/services/readingLogService';

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
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 26,
    },
  },
};

const MaterialCard = ({ item, analyticsBadge, metrics }) => {
  const meta = typeMeta[item.materialType] || {
    label: item.materialType || 'Materi',
    Icon: Sparkles,
  };

  const { label, Icon } = meta;

  return (
    <MotionLi variants={cardVariants} className="h-full list-none">
      <Link to={`/literasi/${item.slug}`} className="group block h-full">
        <article className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100">
          <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
            {item.thumbnail ? (
              <img
                src={item.thumbnail}
                alt={item.title ? `Thumbnail: ${item.title}` : 'Thumbnail materi literasi'}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50 transition-transform duration-700 group-hover:scale-110">
                <BookOpen className="h-12 w-12 text-blue-200" aria-hidden="true" />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />

            <div className="absolute left-3 top-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-slate-800 shadow-sm backdrop-blur">
                <GraduationCap className="h-3.5 w-3.5 text-blue-600" aria-hidden />
                Kelas {item.grade}
              </span>

              <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-bold text-white shadow-sm">
                <Icon className="h-3.5 w-3.5" aria-hidden />
                {label}
              </span>
            </div>

            {analyticsBadge && (
              <div className="absolute right-3 top-3 z-10">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-950/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm backdrop-blur">
                  {analyticsBadge === 'popular' ? (
                    <Flame className="h-3.5 w-3.5" aria-hidden />
                  ) : (
                    <TrendingUp className="h-3.5 w-3.5" aria-hidden />
                  )}
                  {analyticsBadge === 'popular' ? 'Terpopuler' : 'Trend'}
                </span>
              </div>
            )}

            <div className="absolute bottom-3 left-3 z-10">
              <span className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/20 px-3 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md">
                <span className="flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5" /> {metrics.views}
                </span>
                <span className="flex items-center gap-1.5">
                  <Heart className={`h-3.5 w-3.5 ${metrics.likes > 0 ? 'fill-current text-red-400' : ''}`} /> {metrics.likes}
                </span>
              </span>
            </div>
          </div>

          <div className="flex flex-1 flex-col p-5">
            {item.theme && (
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                {item.theme}
              </p>
            )}

            <h2 className="mb-3 text-xl font-black leading-snug text-slate-950 transition-colors group-hover:text-blue-600 line-clamp-2">
              {item.title}
            </h2>

            <p className="mb-5 text-sm leading-7 text-slate-600 line-clamp-3">
              {item.excerpt || 'Materi literasi digital SDN Rengas.'}
            </p>

            <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                {item.durationMinutes != null
                  ? `±${item.durationMinutes} menit`
                  : 'Tanpa estimasi'}
              </span>

              <span className="inline-flex items-center gap-1 text-sm font-black text-blue-600">
                Buka
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
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
  const [modulesMetrics, setModulesMetrics] = useState({});

  useEffect(() => {
    let alive = true;

    const loadBadges = async () => {
      if (!isSupabaseConfigured) return;

      const [map, metricsData] = await Promise.all([
        getLiteracyHubBadgesByMaterialSlug(),
        getAllEngagementMetrics()
      ]);

      if (!alive) return;
      setSlugBadges(Object.fromEntries(map));
      setModulesMetrics(metricsData || {});
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
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-slate-50 pb-20 pt-24 md:pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <MotionHeader
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative mb-10 overflow-hidden rounded-[2rem] border border-blue-100 bg-white/75 p-6 shadow-sm backdrop-blur md:p-10"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
              <Sparkles className="h-4 w-4" aria-hidden />
              Pusat Digital Literasi
            </div>

            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
              Jelajahi Materi Literasi yang Lebih Interaktif
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Buku digital, video pembelajaran, dan artikel pilihan untuk
              mendukung literasi siswa SDN Rengas.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 shadow-sm backdrop-blur">
                <p className="text-2xl font-black text-slate-950">
                  {items.length}
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  Materi tersedia
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 shadow-sm backdrop-blur">
                <p className="text-2xl font-black text-slate-950">3</p>
                <p className="text-xs font-semibold text-slate-500">
                  Format belajar
                </p>
              </div>
            </div>
          </div>
        </MotionHeader>

        <MotionSection
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="sticky top-20 z-20 mb-10 rounded-3xl border border-slate-200 bg-white/85 p-4 shadow-sm backdrop-blur sm:p-5"
        >
          <CategoryFilter value={grade} onChange={setGrade} />
        </MotionSection>

        {!isCMSConfigured && (
          <div
            className="flex items-start gap-3 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-900 shadow-sm"
            role="status"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            <div>
              <p className="font-black">CMS belum dikonfigurasi</p>
              <p className="mt-1 text-sm leading-6 text-amber-900/90">
                Tambahkan{' '}
                <code className="rounded bg-amber-100/80 px-1.5 py-0.5 text-xs">
                  VITE_SANITY_PROJECT_ID
                </code>{' '}
                di lingkungan pengembangan, lalu publikasikan materi di Sanity
                Studio.
              </p>
            </div>
          </div>
        )}

        {isCMSConfigured && loading && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-slate-200 bg-white/80 py-24 text-slate-600 shadow-sm backdrop-blur">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" aria-hidden />
            <p className="text-sm font-bold">Memuat materi…</p>
          </div>
        )}

        {isCMSConfigured && error && !loading && (
          <div
            className="flex items-start gap-3 rounded-3xl border border-red-200 bg-red-50 p-5 text-red-900 shadow-sm"
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {isCMSConfigured && !loading && !error && items.length === 0 && (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/80 px-6 py-20 text-center shadow-sm backdrop-blur">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
              <BookOpen className="h-8 w-8 text-blue-600" aria-hidden />
            </div>

            <p className="mt-5 text-xl font-black text-slate-900">
              Belum ada materi yang dipublikasikan
            </p>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              Tambahkan dokumen <strong>Materi Literasi</strong> di Sanity dan
              aktifkan opsi <strong>Dipublikasikan</strong>.
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
                metrics={modulesMetrics[item.slug] || { views: 0, likes: 0 }}
              />
            ))}
          </MotionUl>
        )}
      </div>
    </main>
  );
};

export default LiteracyHub;