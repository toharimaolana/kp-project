import React from 'react';
import { Outlet } from 'react-router-dom';

const LiteracyLayout = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Di sini kamu bisa tambahkan Navbar khusus literasi yang lebih simpel */}
            <nav className="bg-blue-600 p-4 text-white font-bold shadow-md">
                Pusat Digital Literasi SDN Rengas
            </nav>

            <main>
                <Outlet />
            </main>

            {/* Footer literasi bisa dibuat lebih ringkas atau dihilangkan */}
        </div>
    );
};

export default LiteracyLayout;