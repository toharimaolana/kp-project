import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import { getGaleri } from '@/services/cmsClient';

const ActivityGallery = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchGallery = async () => {
      try {
        const data = await getGaleri();
        if (mounted) {
          setGallery(data || []);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching gallery:', error);
        if (mounted) setLoading(false);
      }
    };

    fetchGallery();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  // Sembunyikan section jika CMS belum ada data galeri
  if (gallery.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-[100px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[100px] opacity-40 pointer-events-none" />

      <div className="container mx-auto px-6 sm:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Galeri Kegiatan</h2>
          <p className="text-gray-600">Mendokumentasikan berbagai aktivitas pembelajaran, ekstrakurikuler, dan acara spesial siswa-siswi SDN Rengas.</p>
        </div>

        {/* Masonry-style Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {gallery.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index % 3) * 0.15, duration: 0.5 }}
              className="break-inside-avoid group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 bg-white"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 sm:p-8">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-white font-black text-xl mb-2">{item.title}</h3>
                  {item.caption && <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">{item.caption}</p>}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActivityGallery;
