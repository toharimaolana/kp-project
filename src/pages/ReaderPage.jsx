import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Loader2, AlertCircle, Eye, Heart } from 'lucide-react';
import { getMateriLiterasiBySlug, isCMSConfigured } from '@/services/cmsClient';
import { insertReadingLog, insertEngagementEvent, getEngagementMetrics } from '@/services/readingLogService';
import { useReadingTimer } from '@/hooks/useReadingTimer';
import GuestCheckInModal from '@/components/features/literacy/GuestCheckInModal';
import ReadingTimer from '@/components/features/literacy/ReadingTimer';
import SuccessModal from '@/components/features/literacy/SuccessModal';

const MotionDiv = motion.div;

const PdfScroller = lazy(() => import('@/components/features/literacy/PdfScroller'));
const YoutubePlayer = lazy(() => import('@/components/features/literacy/YoutubePlayer'));

/**
 * Halaman detail materi — pemutar flipbook/video mengikuti tahap berikutnya (.cursorrules Phase 2).
 */
const ReaderPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [metrics, setMetrics] = useState({ views: 0, likes: 0 });
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!slug) return;
    getEngagementMetrics(slug).then(data => setMetrics(data));
    
    if (localStorage.getItem(`liked_${slug}`)) {
      setIsLiked(true);
    }
  }, [slug]);

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

  const duration = item?.duration_minutes || 15;

  const handleFinishSession = async (sessionData, status) => {
    const { success, error } = await insertReadingLog({
      student_name: sessionData.name,
      student_class: sessionData.class,
      module_slug: sessionData.moduleSlug,
      status: status
    });
    
    if (!success) {
      console.error("Gagal menyimpan data ke database:", error);
    }
    
    setShowSuccess(true);
  };

  const { session, formattedTime, startSession, finishSession } = useReadingTimer(
    slug,
    duration,
    handleFinishSession
  );

  const handleCheckIn = (name, studentClass) => {
    startSession(name, studentClass);
  };

  const handleGoHome = () => {
    navigate('/literasi');
  };

  const hasActiveSession = !!session;

  useEffect(() => {
    if (hasActiveSession && slug) {
      const viewKey = `viewed_${slug}`;
      if (!sessionStorage.getItem(viewKey)) {
        insertEngagementEvent(slug, 'view');
        sessionStorage.setItem(viewKey, 'true');
        setMetrics(prev => ({ ...prev, views: prev.views + 1 }));
      }
    }
  }, [hasActiveSession, slug]);

  const handleLike = async () => {
    if (isLiked || !slug) return;
    
    setIsLiked(true);
    setMetrics(prev => ({ ...prev, likes: prev.likes + 1 }));
    localStorage.setItem(`liked_${slug}`, 'true');
    
    await insertEngagementEvent(slug, 'like');
  };

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
    <main className="min-h-screen bg-slate-50 pb-40 pt-24 md:pt-28">
      <GuestCheckInModal 
        isOpen={!hasActiveSession && !showSuccess} 
        onSubmit={handleCheckIn}
        onCancel={handleGoHome}
      />
      
      <SuccessModal 
        isOpen={showSuccess} 
        onHomeRedirect={handleGoHome} 
        isLiked={isLiked}
        onLike={handleLike}
      />

      {hasActiveSession && !showSuccess && (
        <ReadingTimer 
          formattedTime={formattedTime} 
          onFinish={finishSession} 
        />
      )}

      <div className={`mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 ${!hasActiveSession || showSuccess ? 'blur-sm pointer-events-none opacity-50 select-none' : ''}`}>
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
                alt={item.title ? `Ilustrasi: ${item.title}` : 'Ilustrasi materi literasi'}
                className="aspect-video w-full object-cover"
              />
            ) : (
              <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50">
                <BookOpen className="h-16 w-16 text-blue-200" aria-hidden="true" />
              </div>
            )}
            <div className="p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Kelas {item.grade}
                {item.theme ? ` · ${item.theme}` : ''}
              </p>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">{item.title}</h1>
              {item.excerpt ? <p className="mt-4 text-slate-600 leading-relaxed">{item.excerpt}</p> : null}

              {/* Engagement Metrics */}
              <div className="mt-6 flex items-center gap-6 border-t border-b border-slate-100 py-3">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-500">
                  <Eye className="w-4 h-4" />
                  <span>{metrics.views} Views</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-500">
                  <Heart className={`w-4 h-4 ${metrics.likes > 0 ? 'text-red-500 fill-current' : ''}`} />
                  <span>{metrics.likes} Likes</span>
                </div>
              </div>

              {/* Player Area */}
              <div className="mt-8 w-full">
                {item.materialType === 'flipbook' && item.pdfUrl ? (
                  <Suspense
                    fallback={
                      <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-2xl border border-slate-100">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
                        <p className="text-sm font-medium text-slate-600">Menyiapkan PDF Viewer...</p>
                      </div>
                    }
                  >
                    <PdfScroller fileUrl={item.pdfUrl} />
                  </Suspense>
                ) : item.materialType === 'video' && item.youtubeUrl ? (
                  <Suspense
                    fallback={
                      <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-2xl border border-slate-100">
                        <Loader2 className="w-8 h-8 text-red-600 animate-spin mb-3" />
                        <p className="text-sm font-medium text-slate-600">Menyiapkan Video Player...</p>
                      </div>
                    }
                  >
                    <YoutubePlayer youtubeUrl={item.youtubeUrl} title={item.title} />
                  </Suspense>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-red-50 p-8 text-center text-red-600 border border-red-100">
                    <AlertCircle className="h-10 w-10 text-red-400" aria-hidden />
                    <p className="font-semibold">
                      Tipe materi "<span className="text-red-700">{item.materialType}</span>" tidak dikenali atau tidak didukung oleh sistem.
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
