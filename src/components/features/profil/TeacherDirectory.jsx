import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Loader2 } from 'lucide-react';
import { getGuru, urlFor } from '@/services/cmsClient';
import data from '@/data/mockData.json';

const TeacherCard = ({ teacher, index }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ delay: index * 0.05 }}
    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
  >
    <div className="aspect-square relative overflow-hidden bg-gray-200">
      <img
        src={teacher.image ? (typeof teacher.image === 'string' ? teacher.image : urlFor(teacher.image).url()) : 'https://via.placeholder.com/300x300?text=No+Photo'}
        alt={teacher.name}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="p-4">
      <h3 className="font-bold text-lg text-gray-800">{teacher.name}</h3>
      <p className="text-blue-600 font-medium text-sm">{teacher.subject}</p>
      {teacher.position && (
        <p className="text-gray-500 text-xs mt-1">{teacher.position}</p>
      )}
    </div>
  </motion.div>
);

const TeacherDirectory = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);

        if (import.meta.env.VITE_SANITY_PROJECT_ID) {
          const data = await getGuru();
          setTeachers(data);
        } else {
          setTeachers(data.teachers);
        }
      } catch (err) {
        console.error('Error fetching teachers:', err);
        setError('Gagal memuat data guru.');
        setTeachers(data.teachers);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Memuat Data Guru...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Direktori Guru & Staf</h2>
          <p className="text-gray-600">Mengenal lebih dekat para pendidik hebat di SD Negeri Rengas.</p>

          <div className="mt-8 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Cari nama guru atau mata pelajaran..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredTeachers.map((teacher, index) => (
              <TeacherCard key={teacher.id} teacher={teacher} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredTeachers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-gray-500"
          >
            <User className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p>Tidak ada guru atau staf yang ditemukan.</p>
          </motion.div>
        )}

        {error && (
          <div className="mt-4 text-center text-amber-600 text-sm">
            <p>Menampilkan data sementara.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TeacherDirectory;
