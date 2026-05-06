import React from 'react'

export const Footer = () => {
  return (
    <div>
        <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-2xl font-black mb-6">UPTD SD Negeri Rengas</h2>
              <p className="text-gray-400 max-w-sm mb-6">
                Mencetak generasi cerdas, berakhlak mulia, dan siap menghadapi tantangan masa depan.
              </p>
              <div className="flex space-x-4">
                {/* Social Icons Placeholder */}
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 cursor-pointer transition-colors">fb</div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 cursor-pointer transition-colors">tw</div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 cursor-pointer transition-colors">ig</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6 uppercase text-sm tracking-widest">Tautan Cepat</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Visi & Misi</a></li>
                <li><a href="#news" className="hover:text-white transition-colors">Pengumuman</a></li>
                <li><a href="#ppdb" className="hover:text-white transition-colors">Panduan PPDB</a></li>
                <li><a href="#teachers" className="hover:text-white transition-colors">Staf Pengajar</a></li>
                <li><a href="#teachers" className="hover:text-white transition-colors">Admin</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 uppercase text-sm tracking-widest">Kontak Resmi</h4>
              <p className="text-gray-400 text-sm mb-4">
                Jl. Teratai Putih Rt. 006/009, Kel. Rengas, Kec. Ciputat Timur, Kota Tangerang Selatan, Prov. Banten. NPSN 20602762.
              </p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-xs">
            <p>&copy; 2026 SD Negeri Rengas. All rights reserved. Crafted by SD Negeri Rengas.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
