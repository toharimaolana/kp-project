import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Target, Heart, Leaf, Lightbulb, Users, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

const VisionMission = () => {
  const missions = [
    { text: "Membentuk peserta didik yang beriman, bertakwa, berakhlak mulia, disiplin, dan bertanggung jawab.", icon: CheckCircle2 },
    { text: "Mengembangkan minat dan bakat peserta didik lebih kreatif, inovatif, mandiri, dan berprestasi sesuai dengan era globalisasi", icon: Lightbulb },
    { text: "Membiasakan sikap toleransi dan peduli terhadap sesama dan lingkungan", icon: Heart },
    { text: "Menciptakan sekolah yang ASRI (Aman, Sejuk, Rindang, dan Indah).", icon: Leaf },
    { text: "Mengoptimalkan pelayanan pendidikan dan pembelajaran yang kreatif, inovatif, efektif, efisien, dan bermutu bagi peserta didik", icon: Target },
    { text: "Mengembangkan potensi peserta didik untuk berkompetisi di dalam dan di luar satuan pendidikan", icon: Award },
    { text: "Menjalin kerja sama antara semua elemen penanggung jawab pendidikan untuk mewujudkan program sekolah", icon: Users },
  ];

  return (
    <section id="vision-mission" className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Visi Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-blue-600 font-bold tracking-widest uppercase mb-4">Visi Kami</h2>
          <p className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
            "Mewujudkan generasi yang unggul, religius, berwawasan global melalui kolaborasi berdasarkan nilai-nilai pancasila menuju Indonesia Emas"
          </p>
        </motion.div>

        {/* Misi Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-blue-600 hover:text-white group transition-all duration-300 shadow-sm"
            >
              <item.icon className="w-10 h-10 mb-4 text-blue-600 group-hover:text-white transition-colors" />
              <p className="text-slate-700 group-hover:text-blue-50 leading-relaxed font-medium">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VisionMission;