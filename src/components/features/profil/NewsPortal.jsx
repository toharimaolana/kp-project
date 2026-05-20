import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { getBerita, urlFor } from '@/services/cmsClient';
import { fetchNews as fetchMockNews } from '@/services/cmsService';

const NewsCard = ({ news, index }) => (
  /* 1. Gunakan 'slug' yang konsisten untuk navigasi */
  <Link to={`/berita/${news.slug}`} className="block h-full group">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 flex flex-col h-full hover:shadow-lg transition-all duration-300"
    >
      <div className="h-48 overflow-hidden relative">
        <img
          src={news.thumbnail ? (typeof news.thumbnail === 'string' ? news.thumbnail : urlFor(news.thumbnail).url()) : 'https://via.placeholder.com/400x250?text=No+Image'}
          alt={news.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {news.date ? new Date(news.date).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }) : 'Tanggal tidak tersedia'}
          </div>
          {news.category && (
            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
              {news.category}
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {news.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {news.excerpt}
        </p>
        <div className="mt-auto pt-4 border-t border-gray-50">
          <span className="text-blue-600 font-semibold text-sm flex items-center group-hover:gap-2 transition-all">
            Baca Selengkapnya <ArrowRight className="ml-1 h-4 w-4" />
          </span>
        </div>
      </div>
    </motion.div>
  </Link>
);

const NewsPortal = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 2. AbortController untuk mencegah memory leak jika komponen unmount
    let isMounted = true;

    const getNews = async () => {
      try {
        setLoading(true);
        // Pastikan VITE_SANITY_PROJECT_ID ada di .env
        const useSanity = import.meta.env.VITE_SANITY_PROJECT_ID;
        
        let data;
        if (useSanity) {
          data = await getBerita();
        } else {
          data = await fetchMockNews();
        }

        if (isMounted) {
          setNewsList(data || []);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        if (isMounted) {
          setError('Gagal memuat berita terbaru.');
          // Fallback ke mock data jika Sanity gagal
          const fallbackData = await fetchMockNews();
          setNewsList(fallbackData);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getNews();
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-white">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">Menghubungkan ke Portal Berita...</p>
      </div>
    );
  }

  return (
    <section className="py-20 bg-gray-50/50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
              Portal Berita & Artikel
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Dapatkan informasi terkini mengenai kegiatan, prestasi, dan pengumuman di SDN Rengas.
            </p>
          </div>
          <button className="px-8 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-full font-bold hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm active:scale-95">
            Liat Semua Berita
          </button>
        </div>

        {/* 3. Empty State Handling */}
        {newsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsList.map((item, index) => (
              <NewsCard key={item.id || index} news={item} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500">Belum ada berita yang diterbitkan.</p>
          </div>
        )}

        {error && (
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg border border-amber-200 text-sm italic">
              <AlertCircle size={16} />
              <span>{error} Menampilkan data cadangan offline.</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsPortal;