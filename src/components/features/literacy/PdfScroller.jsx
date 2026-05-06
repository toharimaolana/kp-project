import React, { useState, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Loader2, Maximize2, Minimize2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Inisialisasi PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const PdfScroller = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [containerWidth, setContainerWidth] = useState(null);

  // Resize listener agar PDF merender sesuai ukuran layar (Mobile Friendly)
  const onContainerResize = useCallback((node) => {
    if (node !== null) {
      const updateWidth = () => {
        // Beri sedikit padding (32px) jika di layar kecil, agar tidak terlalu mentok
        setContainerWidth(node.getBoundingClientRect().width - 32);
      };
      
      updateWidth();
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const onDocumentLoadError = (err) => {
    console.error('PDF Load Error:', err);
    setError('Gagal memuat modul PDF. Silakan coba lagi nanti.');
    setLoading(false);
  };

  // Kunci scroll body utama saat Mode Fokus aktif
  useEffect(() => {
    if (isFocusMode) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFocusMode]);

  const ViewerContent = (
    <div className={`flex flex-col items-center w-full ${isFocusMode ? 'h-full overflow-y-auto' : ''}`}>
      {/* Header / Navigasi Kontrol */}
      <div className={`flex items-center justify-between w-full p-4 border-b border-slate-200 bg-white/95 backdrop-blur-sm sticky top-0 z-20 transition-all ${isFocusMode ? 'shadow-sm' : 'rounded-t-2xl'}`}>
        <div className="flex items-center gap-3">
          <p className="text-sm font-semibold text-slate-700">
            {loading ? 'Menyiapkan Dokumen...' : `Total ${numPages || 0} Halaman`}
          </p>
        </div>

        <button
          onClick={() => setIsFocusMode(!isFocusMode)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-semibold hover:bg-blue-100 transition-colors"
          title={isFocusMode ? "Keluar Mode Fokus" : "Mode Fokus"}
        >
          {isFocusMode ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          <span className="hidden sm:inline">{isFocusMode ? 'Keluar Fokus' : 'Fokus Baca'}</span>
        </button>
      </div>

      {/* Area Baca PDF */}
      <div 
        ref={onContainerResize}
        className={`relative w-full flex flex-col items-center bg-slate-100 ${isFocusMode ? 'py-8' : 'rounded-b-2xl py-6'} px-2 sm:px-6 min-h-[50vh]`}
      >
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
            <p className="text-blue-700 font-medium animate-pulse">Menyiapkan Modul...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center p-8 text-center text-red-500">
            <AlertCircle className="w-12 h-12 mb-3 text-red-400" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null}
          className="flex flex-col items-center gap-6 sm:gap-8 w-full max-w-4xl"
        >
          {Array.from(new Array(numPages), (el, index) => (
            <div key={`page_${index + 1}`} className="relative bg-white shadow-md overflow-hidden ring-1 ring-slate-200 transition-transform duration-300">
              <Page
                pageNumber={index + 1}
                width={containerWidth ? Math.min(containerWidth, 900) : 300}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="pdf-page"
              />
              <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-lg backdrop-blur-md">
                Hal {index + 1}
              </div>
            </div>
          ))}
        </Document>
      </div>
    </div>
  );

  return (
    <>
      {/* Tampilan Inline Default */}
      {!isFocusMode && (
        <div className="w-full border border-slate-200 rounded-2xl shadow-sm bg-white overflow-hidden">
          {ViewerContent}
        </div>
      )}

      {/* Mode Fokus (Full Screen Overlay) */}
      <AnimatePresence>
        {isFocusMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-slate-100 flex flex-col items-center overflow-hidden"
          >
            {ViewerContent}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PdfScroller;