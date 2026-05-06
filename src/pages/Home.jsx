import React from 'react';
import Hero from '../components/ui/Hero';
import NewsPortal from '../components/features/profil/NewsPortal';
import TeacherDirectory from '../components/features/profil/TeacherDirectory';
import PPDBStepper from '../components/features/profil/PPDBStepper';
import ExtracurricularFilter from '../components/features/profil/ExtracurricularFilter';
import ContactForm from '../components/features/profil/ContactForm';
import VisionMission from '../components/features/profil/VisionMission';

const Home = () => (
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

    <section id="ppdb">
      <PPDBStepper />
    </section>

    <section id="ekskul">
      <ExtracurricularFilter />
    </section>

    <section id="teachers">
      <TeacherDirectory />
    </section>

    <section id="contact">
      <ContactForm />
    </section>
  </main>
);

export default Home;
