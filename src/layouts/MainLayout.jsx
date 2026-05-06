import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import { Footer } from '../components/ui/Footer';
import VirtualAssistant from '../components/features/profil/VirtualAssistant';

const MainLayout = () => {
    return (
        <>
            <Navbar />
            {/* Outlet adalah tempat halaman (Home/News) akan muncul */}
            <Outlet />
            <Footer />
            <VirtualAssistant />
        </>
    );
};

export default MainLayout;