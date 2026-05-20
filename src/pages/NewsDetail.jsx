import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PortableText } from '@portabletext/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Tag, AlertCircle, Loader2, Share2 } from 'lucide-react';
import { getBeritaBySlug, urlFor } from '../services/cmsClient';

// ==========================================
// 1. UI COMPONENTS (Loading & Error States)
// ==========================================

const SkeletonLoader = () => (
  <div className="min-h-screen bg-slate-50 animate-pulse pb-16">
    <div className="w-full h-[34vh] min-h-[220px] bg-gradient-to-br from-blue-100 via-slate-100 to-slate-200" />
    <div className="mx-auto -mt-10 w-full max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10 sm:-mt-16">
      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200/70 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8 md:p-12">
        <div className="mb-6 flex flex-wrap gap-3">
          <div className="h-8 w-28 rounded-full bg-slate-200" />
          <div className="h-8 w-40 rounded-full bg-slate-200" />
        </div>
        <div className="mb-10 space-y-4">
          <div className="h-10 w-full rounded-2xl bg-slate-200" />
          <div className="h-10 w-11/12 rounded-2xl bg-slate-200" />
          <div className="h-10 w-8/12 rounded-2xl bg-slate-200" />
        </div>
        <div className="mb-8 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-slate-200" />
          <div className="space-y-2">
            <div className="h-4 w-28 rounded bg-slate-200" />
            <div className="h-3 w-20 rounded bg-slate-200" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-4 w-full rounded bg-slate-200" />
          <div className="h-4 w-full rounded bg-slate-200" />
          <div className="h-4 w-10/12 rounded bg-slate-200" />
          <div className="h-4 w-full rounded bg-slate-200" />
          <div className="h-4 w-9/12 rounded bg-slate-200" />
        </div>
      </div>
    </div>
  </div>
);

const ErrorState = ({ icon: Icon, title, message, actionText, actionLink, onAction }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex min-h-screen items-center justify-center bg-slate-50 px-4"
  >
    <div className="w-full max-w-md rounded-[1.75rem] border border-slate-200/80 bg-white p-8 text-center shadow-lg shadow-slate-200/70 sm:p-10">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 ring-8 ring-blue-50/60">
        <Icon className="h-10 w-10 text-blue-600" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-3">{title}</h1>
      <p className="text-slate-500 mb-8 leading-relaxed">{message}</p>
      
      {actionLink ? (
        <Link 
          to={actionLink} 
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-medium text-white transition-all hover:bg-blue-700 active:scale-95"
        >
          <ArrowLeft size={18} />
          {actionText}
        </Link>
      ) : (
        <button 
          onClick={onAction}
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-medium text-white transition-all hover:bg-blue-700 active:scale-95"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          {actionText}
        </button>
      )}
    </div>
  </motion.div>
);

// ==========================================
// 2. PORTABLE TEXT CONFIGURATION
// ==========================================

const ptComponents = {
  types: {
    image: ({ value }) => {
      const { alt, caption } = value || {};
      return (
        <figure className="my-10 w-full">
          <div className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-slate-50 shadow-md shadow-slate-200/60">
            <img 
              src={value ? urlFor(value).url() : '/placeholder-image.png'}
              alt={alt || 'Gambar konten'}
              className="h-auto max-h-[520px] w-full object-cover"
              loading="lazy"
            />
          </div>
          {caption && (
            <figcaption className="mt-4 text-center text-sm italic text-slate-500">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h1: ({ children }) => <h1 className="mb-6 mt-12 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">{children}</h1>,
    h2: ({ children }) => <h2 className="mb-5 mt-10 text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">{children}</h2>,
    h3: ({ children }) => <h3 className="mb-4 mt-8 text-xl font-semibold text-slate-900 sm:text-2xl">{children}</h3>,
    normal: ({ children }) => <p className="mb-6 text-base leading-8 text-slate-700 sm:text-lg">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="my-8 rounded-2xl border border-blue-100 bg-blue-50/80 px-5 py-4 text-base italic leading-8 text-slate-700 sm:px-6 sm:text-lg">
        <div className="border-l-4 border-blue-600 pl-4">{children}</div>
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mb-6 ml-6 list-disc space-y-2 text-base leading-8 text-slate-700 sm:text-lg">{children}</ul>,
    number: ({ children }) => <ol className="mb-6 ml-6 list-decimal space-y-2 text-base leading-8 text-slate-700 sm:text-lg">{children}</ol>,
  },
  marks: {
    link: ({ value, children }) => {
      const isExternal = value?.href?.startsWith('http');
      return (
        <a 
          href={value?.href} 
          target={isExternal ? '_blank' : undefined} 
          rel={isExternal ? 'noopener noreferrer' : undefined} 
          className="font-semibold text-blue-700 underline decoration-blue-200 underline-offset-4 transition-colors hover:text-blue-800 hover:decoration-blue-400"
        >
          {children}
        </a>
      );
    },
    bold: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
  },
};

// ==========================================
// 3. MAIN COMPONENT
// ==========================================

const NewsDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!slug) throw new Error('slug_kosong');

        const data = await getBeritaBySlug(slug);
        if (!data) throw new Error('berita_tidak_ditemukan');
        
        setNews(data);
      } catch (err) {
        console.error('Error fetching berita detail:', err);
        setError(err.message === 'slug_kosong' || err.message === 'berita_tidak_ditemukan' 
          ? 'not_found' 
          : 'fetch_error');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    window.scrollTo(0, 0);
  }, [slug]);

  // --- Render States ---
  if (loading) return <SkeletonLoader />;

  if (error === 'not_found') {
    return (
      <ErrorState 
        icon={AlertCircle}
        title="Berita Tidak Ditemukan"
        message="Maaf, artikel yang Anda cari mungkin telah dihapus atau URL tidak valid."
        actionText="Kembali ke Beranda"
        actionLink="/"
      />
    );
  }

  if (error === 'fetch_error') {
    return (
      <ErrorState 
        icon={AlertCircle}
        title="Gagal Memuat Data"
        message="Terjadi gangguan jaringan saat mengambil artikel. Silakan coba beberapa saat lagi."
        actionText="Coba Lagi"
        onAction={() => window.location.reload()}
      />
    );
  }

  if (!news) return null;

  // --- Data Preparation ---
  const formattedDate = new Date(news.date).toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  
  const categoryName = news.category || (Array.isArray(news.categories) && news.categories[0]) || 'Berita Umum';
  const heroImage = news.thumbnail ? (typeof news.thumbnail === 'string' ? news.thumbnail : urlFor(news.thumbnail).url()) : '/placeholder-hero.jpg';

  return (
    <motion.article 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-50 pb-16"
    >
      <div className="relative w-full overflow-hidden bg-slate-900 h-[34vh] min-h-[240px] sm:h-[40vh] lg:h-[46vh]">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={heroImage} 
          alt={news.title}
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-900/55 to-slate-950/85" />
      </div>

      <main className="relative z-10 mx-auto -mt-14 w-full max-w-5xl px-4 sm:-mt-20 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
          className="overflow-hidden rounded-[1.75rem] border border-slate-200/70 bg-white shadow-xl shadow-slate-200/70"
        >
          <header className="border-b border-slate-100 px-5 pb-8 pt-6 sm:px-8 sm:pt-8 md:px-12 md:pb-10">
            <div className="mb-6 flex items-center justify-between gap-3">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                <ArrowLeft size={16} />
                Kembali
              </button>

              <button 
                onClick={() => navigator.share?.({ title: news.title, url: window.location.href })}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                title="Bagikan Artikel"
              >
                <Share2 size={16} />
                <span className="hidden sm:inline">Bagikan</span>
              </button>
            </div>

            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                <Tag size={14} strokeWidth={2.5} />
                {categoryName}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
                <Calendar size={14} strokeWidth={2.5} />
                {formattedDate}
              </span>
            </div>

            <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {news.title}
            </h1>

            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-sm font-bold text-white">
                  {news.author ? news.author.charAt(0).toUpperCase() : 'A'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{news.author || 'Admin Sekolah'}</p>
                  <p className="text-xs text-slate-500">Dipublikasikan oleh tim sekolah</p>
                </div>
              </div>
            </div>
          </header>

          <div className="bg-white px-5 py-8 sm:px-8 md:px-12 md:py-10">
            <div className="mx-auto max-w-3xl">
              <PortableText 
                value={news.content || news.body} 
                components={ptComponents} 
              />
            </div>
          </div>
        </motion.div>
      </main>
    </motion.article>
  );
};

export default NewsDetail;