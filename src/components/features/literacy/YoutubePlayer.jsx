import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, AlertCircle, Loader2 } from 'lucide-react';

/**
 * Helper untuk mengekstrak Video ID dari berbagai format URL YouTube
 */
const getYoutubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const YoutubePlayer = ({ youtubeUrl, title }) => {
  const [videoId, setVideoId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    const id = getYoutubeId(youtubeUrl);
    setVideoId(id);
  }, [youtubeUrl]);

  if (!youtubeUrl) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50 rounded-2xl border border-red-100 text-red-500">
        <AlertCircle className="w-10 h-10 mb-3 text-red-400" />
        <p className="font-medium">URL Video tidak ditemukan.</p>
      </div>
    );
  }

  if (!videoId) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-amber-50 rounded-2xl border border-amber-100 text-amber-600">
        <AlertCircle className="w-10 h-10 mb-3 text-amber-400" />
        <p className="font-medium">Format URL YouTube tidak valid.</p>
      </div>
    );
  }

  // Menggunakan youtube-nocookie.com untuk keamanan privasi siswa sesuai .AIAGENTS
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="w-full flex flex-col items-center mt-4">
      <div className="w-full max-w-4xl bg-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-200/50 relative aspect-video group">
        
        {/* State 1: Thumbnail + Play Button (Lazy Loading Iframe) */}
        {!isPlaying ? (
          <div 
            className="absolute inset-0 w-full h-full cursor-pointer flex items-center justify-center"
            onClick={() => setIsPlaying(true)}
          >
            {/* Thumbnail Image */}
            <img 
              src={thumbnailUrl} 
              alt={title || "Video Thumbnail"} 
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-300"
              loading="lazy"
            />
            
            {/* Play Button Overlay */}
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="bg-blue-600/90 text-white rounded-full p-4 backdrop-blur-sm shadow-xl shadow-blue-900/30">
                <PlayCircle className="w-12 h-12 sm:w-16 sm:h-16" fill="currentColor" strokeWidth={1} />
              </div>
            </motion.div>
          </div>
        ) : (
          /* State 2: Active Iframe Player */
          <div className="absolute inset-0 w-full h-full bg-slate-900 flex items-center justify-center">
            {/* Loading Indicator behind iframe */}
            <div className="absolute inset-0 flex items-center justify-center">
               <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
            <iframe
              src={embedUrl}
              title={title || "YouTube video player"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full z-10 border-0"
            />
          </div>
        )}
      </div>

      <div className="mt-6 text-center max-w-2xl px-4">
        <p className="text-sm text-slate-500">
          Video diputar dalam Mode Privasi (No-Cookie) untuk melindungi data siswa.
        </p>
      </div>
    </div>
  );
};

export default YoutubePlayer;
