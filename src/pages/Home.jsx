import React from 'react';
import Hero from '../components/ui/Hero';
import NewsPortal from '../components/features/profil/NewsPortal';
import ActivityGallery from '../components/features/profil/ActivityGallery';
import TeacherDirectory from '../components/features/profil/TeacherDirectory';
import PPDBStepper from '../components/features/profil/PPDBStepper';
import ExtracurricularFilter from '../components/features/profil/ExtracurricularFilter';
import ContactForm from '../components/features/profil/ContactForm';
import VisionMission from '../components/features/profil/VisionMission';
import { useSEO } from '../hooks/useSEO';

const Home = () => {
  useSEO({
    title: "Website Resmi Sekolah Dasar Negeri Rengas",
    description: "Selamat datang di website resmi SDN Rengas. Temukan profil sekolah, visi misi, daftar guru, informasi pendaftaran siswa baru (PPDB), berita sekolah terbaru, dan galeri kegiatan.",
    keywords: "SDN Rengas, Sekolah Dasar Negeri Rengas, SD Rengas, Profil SDN Rengas, PPDB SDN Rengas, Website Resmi SDN Rengas"
  });

  return (
    <main>
      <section id="hero">
        <Hero />
      </section>

      <section id="vision-mission">
        <VisionMission />
      </section>

      <section id="news">
        <NewsPortal />
      </section>

      <section id="ekskul">
        <ExtracurricularFilter />
      </section>

      <section id="teachers">
        <TeacherDirectory />
      </section>

      <section id="galeri">
        <ActivityGallery />
      </section>

      <section id="contact">
        <ContactForm />
      </section>
    </main>
  );
};

export default Home;
