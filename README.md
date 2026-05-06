# SDN Rengas Portal & Digital Literacy Hub 🚀

Proyek ini adalah platform digital terintegrasi untuk **SDN Rengas**, yang menggabungkan Website Profil Sekolah dan Pusat Literasi Digital interaktif. Dibangun dengan arsitektur modern untuk memastikan performa tinggi dan kemudahan pengelolaan konten.

## 📂 Struktur Proyek (Monorepo)

- **`/` (Root)**: Frontend utama menggunakan React + Vite.
- **`/portal-rengas`**: Backend & CMS menggunakan Sanity Studio.
- **`/src`**: Source code frontend (Components, Pages, Services, Layouts).

## 🛠️ Teknologi Utama

- **Frontend**: React 19, Vite, Tailwind CSS 4, Framer Motion.
- **CMS**: Sanity.io (Headless CMS).
- **Database & Analytics**: Supabase.
- **Icons**: Lucide React.
- **PDF Engine**: React-PDF & PDF.js.

## 🚀 Cara Menjalankan Secara Lokal

### 1. Persiapan
Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/).

### 2. Jalankan Frontend
```bash
# Instal dependensi di root
npm install

# Buat file .env dan masukkan API Keys (Sanity & Supabase)
# Jalankan server pengembangan
npm run dev
