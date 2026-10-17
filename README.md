# 🎓 Sistem Penerimaan Mahasiswa Baru (PMB) & Student Portal App

Aplikasi web modern dan komprehensif untuk portal informasi kampus, sistem seleksi Penerimaan Mahasiswa Baru (PMB), dan dashboard manajemen mahasiswa serta administrator institusi pendidikan tinggi.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

---

## 📌 Gambaran Umum

Aplikasi ini dirancang sebagai solusi terpadu (one-stop solution) untuk perguruan tinggi dalam menyelenggarakan proses penerimaan mahasiswa baru dari tahap promosi kampus hingga registrasi ulang, lengkap dengan asisten interaktif dan panel kendali manajemen data calon mahasiswa secara real-time.

---

## ✨ Fitur Utama

### 1. 🌐 Landing Page & Informasi Kampus
- **Hero & Metrik Pendaftaran**: Tampilan interaktif periode gelombang aktif, akreditasi, biaya registrasi, dan fasilitas kampus.
- **Profil Kampus & Fasilitas**: Informasi visi, misi, sarana prasarana, serta lingkungan perkuliahan.
- **Eksplorasi Fakultas & Prodi**: Katalog program studi lengkap dengan jenjang, deskripsi, akreditasi, dan prospek karir.
- **Biaya Kuliah & Jalur Masuk**: Informasi skema UKT, biaya pendidikan, serta jalur seleksi (Prestasi, Rapor, CBT/Mandiri).
- **Jadwal & Unduhan**: Jadwal lengkap tahapan seleksi dan unduhan brosur/panduan registrasi.
- **Berita & Pengumuman**: Artikel serta pengumuman penting seputar kampus dan seleksi mahasiswa baru.
- **FAQ & Bantuan Cepat**: Jawaban atas pertanyaan umum seputar pendaftaran.

### 2. 👨‍🎓 Portal Calon Mahasiswa (Student Dashboard)
- **Pengisian Biodata Lengkap**: Formulir data pribadi, kontak, data orang tua/wali, dan asal sekolah.
- **Riwayat Nilai Rapor**: Input nilai semester untuk jalur seleksi rapor.
- **Unggah Dokumen (Berkas)**: Pengunggahan scan ijazah, KK, KTP, pas foto, serta sertifikat prestasi.
- **Sistem Pembayaran**: Konfirmasi dan pelacakan status pembayaran pendaftaran (Virtual Account / Transfer Bank).
- **Tracking Status Seleksi**: Pemantauan tahapan pendaftaran (Verifikasi Berkas, Jadwal Ujian, Pengumuman Kelulusan).
- **Cetak Dokumen**: Cetak Kartu Peserta Ujian PMB dan Bukti Registrasi resmi dalam format cetak/PDF.
- **Informasi Perkuliahan**: Panduan orientasi dan registrasi ulang pasca pengumuman.

### 3. 🤖 Fitur AI & Konsultasi Interaktif
- **Rekomendasi Program Studi**: Tes minat dan analisis kecocokan jurusan untuk calon mahasiswa.
- **Chatbot Asisten PMB**: Layanan tanya jawab otomatis 24/7 untuk menjawab kendala dan alur pendaftaran secara cepat.

### 4. 🛡️ Dashboard Administrator & Eksekutif (Admin Panel)
- **Statistik & Metrik Real-time**: Grafik pendaftar berdasarkan fakultas, jalur seleksi, dan status pembayaran.
- **Manajemen Pendaftar (Registrants)**: Validasi dan verifikasi dokumen calon mahasiswa secara cepat.
- **Manajemen Gelombang & Jalur PMB**: Pengaturan kuota, periode aktif, dan konfigurasi seleksi.
- **Sistem Check-in Ujian**: Verifikasi kehadiran peserta ujian seleksi secara digital.
- **Pusat Pengumuman & Notifikasi**: Pembuatan dan publikasi pengumuman hasil seleksi.
- **Laporan Eksekutif**: Ringkasan data untuk pimpinan kampus dan ekspor laporan.

---

## 🛠️ Teknologi yang Digunakan

| Kategori | Teknologi |
| --- | --- |
| **Framework** | [Next.js](https://nextjs.org/) (App Router, Server & Client Components) |
| **Bahasa** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/), Radix UI Primitives, Lucide Icons |
| **Backend & Database** | [Supabase](https://supabase.com/) (PostgreSQL & Authentication) |
| **Data Visualization** | [Recharts](https://recharts.org/) |
| **Form & Validasi** | [React Hook Form](https://react-hook-form.com/), Zod, Input OTP |
| **Notifikasi & UI Feedback** | [Sonner Toast](https://sonner.emilkowal.ski/) |
| **Tema** | Light Mode & Dark Mode dengan [next-themes](https://github.com/pacocoursey/next-themes) |

---

## 📁 Struktur Direktori

```text
student-portal-app/
├── app/
│   ├── admin/             # Panel manajemen admin PMB & eksekutif
│   │   ├── announcements/ # Manajemen pengumuman
│   │   ├── check-in/      # Check-in kehadiran ujian
│   │   ├── registrants/   # Data pendaftar & verifikasi berkas
│   │   └── reports/       # Laporan & analitik
│   ├── auth/              # Halaman autentikasi (login, register, OTP)
│   ├── chatbot/           # Halaman asisten virtual / chatbot PMB
│   ├── dashboard/         # Portal mandiri calon mahasiswa
│   │   ├── berkas/        # Upload dokumen & verifikasi
│   │   ├── biodata/       # Formulir data diri & nilai rapor
│   │   ├── cetak/         # Halaman cetak kartu & bukti
│   │   ├── pembayaran/    # Tagihan & riwayat transaksi
│   │   └── status/        # Status kelulusan / seleksi
│   ├── rekomendasi/       # Kuis rekomendasi program studi
│   ├── layout.tsx         # Root layout aplikasi
│   └── page.tsx           # Halaman utama (Landing Page)
├── components/            # Komponen antarmuka modular
│   ├── admin/             # Komponen khusus panel admin
│   ├── auth/              # Komponen form login & OTP
│   ├── biodata/           # Komponen formulir biodata & rapor
│   ├── dashboard/         # Komponen sidebar & widget mahasiswa
│   ├── landing/           # Bagian-bagian landing page kampus
│   └── ui/                # Komponen UI dasar (Buttons, Dialogs, Cards, dll.)
├── contexts/              # Context API global (Autentikasi & State)
├── lib/                   # Utilitas & inisialisasi Supabase client
├── public/                # Aset statis (gambar fasilitas, logo, dll.)
└── types/                 # Definisi tipe TypeScript
```

---

## 🚀 Panduan Memulai (Getting Started)

### Prasyarat
- **Node.js** versi 18.18+ atau versi lebih baru
- **npm**, **pnpm**, atau **yarn**
- Akun dan project **Supabase** (opsional untuk sinkronisasi database)

### Langkah Instalasi

1. **Clone repositori**:
   ```bash
   git clone https://github.com/rayyanbabab/aplikasi-pendaftaran-kampus.git
   cd aplikasi-pendaftaran-kampus
   ```

2. **Install dependensi**:
   ```bash
   npm install
   # atau
   pnpm install
   ```

3. **Konfigurasi Environment Variables**:
   Buat file `.env.local` di direktori utama proyek dan tambahkan variabel berikut:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Jalankan server pengembangan (Development Server)**:
   ```bash
   npm run dev
   ```

5. **Buka di peramban (browser)**:
   Akses `http://localhost:3000` untuk melihat aplikasi yang sedang berjalan.

---

## 📦 Build untuk Produksi

Untuk membuat build produksi aplikasi:

```bash
npm run build
npm run start
```

---

## 📝 Lisensi

Aplikasi ini dikembangkan untuk kebutuhan pendaftaran dan sistem informasi kampus. Bebas dikustomisasi sesuai kebutuhan institusi pendidikan masing-masing.
