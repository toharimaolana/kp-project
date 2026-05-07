import React, { useState, useEffect } from 'react';
import { Menu, X, School, Settings } from 'lucide-react';

const getSanityStudioUrl = () => {
  const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
  const customUrl = import.meta.env.VITE_ADMIN_DASHBOARD_URL;
  if (customUrl) return customUrl;
  if (projectId) return `https://${projectId}.sanity.studio`;
  return '';
};

const ADMIN_DASHBOARD_URL = getSanityStudioUrl();

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Berita', href: '/#news' },
    { name: 'Galeri', href: '/#galeri' },
    // { name: 'PPDB', href: '/#ppdb' },
    { name: 'Guru', href: '/#teachers' },
    { name: 'Ekskul', href: '/#ekskul' },
    { name: 'Kontak', href: '/#contact' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'
      }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <School size={24} />
          </div>
          <span className={`font-black text-xl tracking-tight ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
            SDN RENGAS
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-sm font-bold transition-colors hover:text-blue-500 ${isScrolled ? 'text-gray-600' : 'text-white/90'
                }`}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-gray-900"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className={isScrolled ? 'text-gray-900' : 'text-white'} /> : <Menu className={isScrolled ? 'text-gray-900' : 'text-white'} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 w-full shadow-xl border-t border-gray-100 p-4 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="block text-gray-700 font-bold px-4 py-2 hover:bg-blue-50 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
