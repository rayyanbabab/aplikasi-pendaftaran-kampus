"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Download,
  Building,
  GraduationCap,
  ShieldCheck,
  FileCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const ADMISSION_METRICS = [
  {
    kategori: "Periode Pendaftaran",
    nilai: "Gelombang II",
    keterangan: "1 Mei s.d. 30 Juni 2025",
    utama: true,
  },
  {
    kategori: "Akreditasi Institusi",
    nilai: "Unggul (A)",
    keterangan: "BAN-PT No. 123/SK/2023",
    utama: false,
  },
  {
    kategori: "Biaya Registrasi",
    nilai: "Rp 250.000",
    keterangan: "Maks. 3 pilihan program studi",
    utama: false,
  },
  {
    kategori: "Metode Seleksi",
    nilai: "CBT & Rapor",
    keterangan: "Ujian daring atau seleksi nilai",
    utama: false,
  },
]

const FASILITAS_SHOWCASE = [
  {
    id: "rektorat",
    nama: "Gedung Rektorat & Layanan PMB",
    foto: "/images/hero-campus.png",
    lokasi: "Kampus Utama Jakarta",
    keterangan: "Pusat verifikasi berkas fisik, loket administrasi mahasiswa baru, dan ruang bimbingan karir.",
    fitur: ["Loket Terpadu PMB", "Ruang Sidang Akademik", "Klinik Kesehatan Kampus"],
  },
  {
    id: "perpustakaan",
    nama: "Perpustakaan Pusat & Riset",
    foto: "/images/campus-profile.png",
    lokasi: "Gedung Grha Pustaka Lantai 1-4",
    keterangan: "Akses 120.000+ buku teks, jurnal internasional terindeks Scopus, serta 40 ruang diskusi komunal.",
    fitur: ["Akses Jurnal Digital 24/7", "Silent Study Pods", "Pusat Restorasi Arsip"],
  },
  {
    id: "lab",
    nama: "Laboratorium Komputasi & Rekayasa",
    foto: "/images/virtual-tour.png",
    lokasi: "Gedung Riset Sains Terpadu",
    keterangan: "32 laboratorium komputasi awan, robotika industri, kecerdasan artifisial, dan teknik biomedis.",
    fitur: ["32 Lab Komputasi Modern", "Cluster Server AI", "Studio Multimedia Digital"],
  },
]

export function Hero() {
  const [activeFasilitasIndex, setActiveFasilitasIndex] = useState(0)
  const activeFasilitas = FASILITAS_SHOWCASE[activeFasilitasIndex]

  return (
    <section id="beranda" className="bg-background border-b border-border py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* ========================================================= */}
          {/* LEFT: EDITORIAL COPY & VERIFIED ADMISSION HIGHLIGHTS      */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 space-y-6">
            {/* Official University Header */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                Penerimaan Mahasiswa Baru Tahun Akademik 2025/2026
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-[1.16] tracking-tight">
                Membuka Gerbang Pendidikan Tinggi Berkualitas dan Beretika
              </h1>
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              Selamat datang di portal pendaftaran resmi Universitas Nusantara. Kami menyelenggarakan pendidikan Sarjana (S1) dan Vokasi (D4) pada 8 fakultas dengan kurikulum berbasis capaian pembelajaran Outcome-Based Education (OBE), tenaga pengajar berkualifikasi doktor, serta beasiswa penuh KIP-Kuliah dan prestasi.
            </p>

            {/* Functional Call-to-Action Group */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-5 sm:px-6 h-11 rounded-lg gap-2 shadow-xs text-xs sm:text-sm"
                >
                  Daftar PMB Online 2025/2026
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <a href="#unduhan">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border text-foreground hover:bg-secondary h-11 px-4 sm:px-5 rounded-lg gap-2 text-xs sm:text-sm"
                >
                  <Download className="h-4 w-4 text-muted-foreground" />
                  Unduh Panduan PMB (PDF)
                </Button>
              </a>

              <a
                href="#fakultas"
                className="text-xs sm:text-sm font-semibold text-primary hover:underline px-2 py-2"
              >
                Katalog Program Studi & Kuota &rarr;
              </a>
            </div>

            {/* Admissions Facts Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-border">
              {ADMISSION_METRICS.map((item) => (
                <div
                  key={item.kategori}
                  className="p-3.5 rounded-lg border border-border bg-card/60"
                >
                  <p className="text-[11px] font-medium text-muted-foreground">
                    {item.kategori}
                  </p>
                  <p
                    className={`font-serif font-bold text-base sm:text-lg mt-0.5 ${
                      item.utama ? "text-emerald-700 dark:text-emerald-400" : "text-foreground"
                    }`}
                  >
                    {item.nilai}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                    {item.keterangan}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT: INTERACTIVE CAMPUS FACILITY SWITCHER               */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 space-y-3">
            {/* Facility Tab Switcher */}
            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-secondary/80 border border-border">
              {FASILITAS_SHOWCASE.map((fasilitas, idx) => (
                <button
                  key={fasilitas.id}
                  onClick={() => setActiveFasilitasIndex(idx)}
                  className={`flex-1 py-1.5 px-2 rounded-md text-[11px] font-medium transition-colors text-center truncate ${
                    activeFasilitasIndex === idx
                      ? "bg-card text-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {fasilitas.id === "rektorat"
                    ? "Rektorat"
                    : fasilitas.id === "perpustakaan"
                    ? "Perpustakaan"
                    : "Laboratorium"}
                </button>
              ))}
            </div>

            {/* Photo Card */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
              <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                <img
                  src={activeFasilitas.foto}
                  alt={activeFasilitas.nama}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                <div className="absolute top-3 right-3">
                  <Badge className="bg-background/95 text-foreground backdrop-blur-sm border border-border text-xs font-semibold px-2.5 py-1">
                    {activeFasilitas.lokasi}
                  </Badge>
                </div>
              </div>

              {/* Informative Body */}
              <div className="p-5 space-y-3.5">
                <div>
                  <h3 className="font-serif font-bold text-base text-foreground">
                    {activeFasilitas.nama}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {activeFasilitas.keterangan}
                  </p>
                </div>

                {/* Facility Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3 border-t border-border text-[11px]">
                  {activeFasilitas.fitur.map((item) => (
                    <div key={item} className="flex items-center gap-1.5 text-foreground font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-1">
                  <Link href="/auth/register" className="block w-full">
                    <Button variant="secondary" className="w-full text-xs font-semibold h-9 rounded-lg">
                      Buat Akun Calon Mahasiswa Baru
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
