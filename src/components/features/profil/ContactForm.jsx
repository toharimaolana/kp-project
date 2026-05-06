import React, { useState } from 'react';
import { Send, MapPin, Phone, Mail, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulasi integrasi Web3Forms/Formspree
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6 leading-tight">Hubungi Kami & Buku Tamu</h2>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Punya pertanyaan seputar sekolah atau ingin menjadwalkan kunjungan? 
              Silakan isi formulir di samping, tim kami akan merespons sesegera mungkin.
            </p>

            <div className="space-y-8">
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-xl mr-4">
                  <MapPin className="text-blue-600 h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Alamat Sekolah</h4>
                  <p className="text-gray-600 text-sm">Jl. Raya Rengas No. 123, Tangerang Selatan</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 p-3 rounded-xl mr-4">
                  <Phone className="text-green-600 h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Telepon</h4>
                  <p className="text-gray-600 text-sm">(021) 7401234 / 0812-3456-7890</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-purple-100 p-3 rounded-xl mr-4">
                  <Mail className="text-purple-600 h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Email</h4>
                  <p className="text-gray-600 text-sm">info@sdnrengas.sch.id</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-sm">
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="text-green-600 h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pesan Terkirim!</h3>
                <p className="text-gray-600 mb-6">Terima kasih telah menghubungi kami. Kami akan segera menghubungi Anda kembali.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Kirim pesan lain
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Nama Lengkap</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="Contoh: Budi Santoso"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Email / WhatsApp</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="email@anda.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Subjek</label>
                  <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer">
                    <option>Pertanyaan PPDB</option>
                    <option>Kerjasama & Sponsor</option>
                    <option>Saran & Kritik</option>
                    <option>Lainnya</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Pesan Anda</label>
                  <textarea
                    required
                    rows="5"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                    placeholder="Tuliskan pesan Anda di sini..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sedang Mengirim...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Kirim Pesan <Send size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
