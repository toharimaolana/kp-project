import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Loader2, AlertCircle } from 'lucide-react';
import { getMateriLiterasiBySlug, isCMSConfigured } from '@/services/cmsClient';

const MotionDiv = motion.div;

const PdfScroller = lazy(() => import('@/components/features/literacy/PdfScroller'));

/**
 * Halaman detail materi — pemutar flipbook/video mengikuti tahap berikutnya (.cursorrules Phase 2).
 */
const ReaderPage = () => {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      if (!isCMSConfigured || !slug) {
        if (alive) {
          setNotFound(!slug);
          setItem(null);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const data = await getMateriLiterasiBySlug(slug);
        if (!alive) return;
        if (!data) {
          setNotFound(true);
          setItem(null);
        } else {
          setNotFound(false);
          setItem(data);
        }
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 pt-24 text-slate-600">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" aria-hidden />
        <p className="text-sm font-semibold">Memuat materi…</p>
      </main>
    );
  }

  if (!isCMSConfigured || notFound || !item) {
    return (
      <main className="mx-auto max-w-lg px-4 py-24 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-amber-500" aria-hidden />
        <h1 className="mt-4 text-xl font-bold text-slate-900">Materi tidak ditemukan</h1>
        <p className="mt-2 text-slate-600">
          Periksa tautan atau kembali ke pusat literasi untuk memilih materi lain.
        </p>
        <Link
          to="/literasi"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Kembali ke Pusat Literasi
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-16 pt-24 md:pt-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <MotionDiv initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <Link
            to="/literasi"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Semua materi
          </Link>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {item.thumbnail ? (
              <img
                src={item.thumbnail}
                alt={item.title ? `Ilustrasi: ${item.title}` : ''}
                className="aspect-video w-full object-cover"
              />
            ) : null}
            <div className="p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Kelas {item.grade}
                {item.theme ? ` · ${item.theme}` : ''}
              </p>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">{item.title}</h1>
              {item.excerpt ? <p className="mt-4 text-slate-600 leading-relaxed">{item.excerpt}</p> : null}

              {/* Player Area */}
              <div className="mt-8 w-full">
                {item.materialType === 'flipbook' && item.pdfUrl ? (
                  <Suspense
                    fallback={
                      <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-2xl border border-slate-100">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
                        <p className="text-sm font-medium text-slate-600">Menyiapkan buku...</p>
                      </div>
                    }
                  >
                    <PdfScroller fileUrl={item.pdfUrl} />
                  </Suspense>
                ) : (
                  <div className="flex items-start gap-3 rounded-xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
                    <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" aria-hidden />
                    <p>
                      <strong>Pemutar interaktif</strong> (video YouTube, atau artikel penuh) akan
                      ditampilkan di tahap implementasi berikutnya sesuai tipe materi:{' '}
                      <span className="font-semibold text-blue-700">{item.materialType}</span>.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </MotionDiv>
      </div>
    </main>
  );
};

export default ReaderPage;
