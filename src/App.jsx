import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LiteracyLayout from './layouts/LiteracyLayout';
import Home from './pages/Home';
import NewsDetail from './pages/NewsDetail';
import LiteracyHub from './pages/LiteracyHub';
import ReaderPage from './pages/ReaderPage';

function App() {
  return (
    <Router>
      <div className="antialiased text-gray-900">
        <Routes>
          {/* GROUP 1: Layout Profil Sekolah */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/berita/:slug" element={<NewsDetail />} />
          </Route>

          {/* GROUP 2: Layout Pusat Literasi (Eksklusif) */}
          <Route path="/literasi" element={<LiteracyLayout />}>
            <Route index element={<LiteracyHub />} />
            <Route path=":slug" element={<ReaderPage />} />
          </Route>

          {/* Dashboard bisa ditambah layout sendiri lagi nanti */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;