import { useEffect } from 'react';

/**
 * Custom hook to dynamically manage page SEO tags.
 * 
 * @param {Object} seoOptions
 * @param {string} seoOptions.title - The title of the page (without suffix).
 * @param {string} [seoOptions.description] - Page description.
 * @param {string} [seoOptions.keywords] - Comma-separated keywords.
 */
export function useSEO({ title, description, keywords }) {
  useEffect(() => {
    // 1. Update Title
    const baseTitle = "SDN Rengas";
    if (title) {
      document.title = `${title} | ${baseTitle}`;
    } else {
      document.title = "SDN Rengas - Website Resmi Sekolah Dasar Negeri Rengas";
    }

    // 2. Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    if (description) {
      metaDesc.content = description;
    } else {
      metaDesc.content = "Website Resmi SDN Rengas. Menampilkan profil sekolah, visi misi, daftar guru, pendaftaran PPDB online, berita sekolah, galeri kegiatan, serta platform Hub Literasi digital siswa.";
    }

    // 3. Update Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    if (keywords) {
      metaKeywords.content = keywords;
    } else {
      metaKeywords.content = "SDN Rengas, Sekolah Dasar Negeri Rengas, SD Rengas, Website Sekolah SDN Rengas, Profil SDN Rengas, Literasi SDN Rengas, PPDB SDN Rengas";
    }
  }, [title, description, keywords]);
}
