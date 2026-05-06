import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Download, FileText, Calculator } from 'lucide-react';

const steps = [
  { id: 1, title: 'Persiapan Dokumen', desc: 'Siapkan Akta, KK, dan Ijazah TK.' },
  { id: 2, title: 'Pendaftaran Online', desc: 'Mengisi formulir di website PPDB Kota.' },
  { id: 3, title: 'Verifikasi Berkas', desc: 'Membawa dokumen fisik ke sekolah.' },
  { id: 4, title: 'Pengumuman', desc: 'Melihat hasil seleksi secara online.' },
];

const PPDBStepper = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [cost, setCost] = useState({ uniform: 600000, spp: 0 });

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Informasi PPDB 2024</h2>
            <p className="text-gray-600">Alur pendaftaran siswa baru SDN Rengas yang transparan dan mudah.</p>
          </div>

          {/* Stepper UI */}
          <div className="relative mb-16">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2" />
            <div 
              className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 transition-all duration-500" 
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
            
            <div className="relative flex justify-between">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center">
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors duration-300 ${
                      currentStep >= step.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step.id ? <Check size={20} /> : step.id}
                  </button>
                  <div className="mt-4 text-center max-w-[120px]">
                    <h4 className={`text-sm font-bold ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'}`}>
                      {step.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Download Section */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-6">
                <FileText className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold">Unduh Dokumen</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors group">
                  <span className="text-sm font-medium text-gray-700">Brosur PPDB 2024.pdf</span>
                  <button className="text-blue-600 p-2 hover:bg-white rounded-full transition-all">
                    <Download size={18} />
                  </button>
                </li>
                <li className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors group">
                  <span className="text-sm font-medium text-gray-700">Formulir Pendaftaran.docx</span>
                  <button className="text-blue-600 p-2 hover:bg-white rounded-full transition-all">
                    <Download size={18} />
                  </button>
                </li>
              </ul>
            </div>

            {/* Static Calculator Section */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-6">
                <Calculator className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold">Simulasi Biaya</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Seragam & Atribut:</span>
                  <span className="font-bold">Rp {cost.uniform.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">SPP (Biaya Operasional):</span>
                  <span className="font-bold text-green-600">GRATIS</span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-bold">Total Estimasi:</span>
                  <span className="text-2xl font-black text-blue-600">Rp {cost.uniform.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-gray-400 italic mt-2">
                  *Estimasi biaya dapat berubah sewaktu-waktu sesuai kebijakan sekolah.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PPDBStepper;
