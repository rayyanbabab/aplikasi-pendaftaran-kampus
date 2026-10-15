"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Quote, Award } from "lucide-react"

const TESTIMONIALS = [
  {
    nama: "Sari Dewi Rahayu",
    prodi: "Alumni Teknik Informatika",
    angkatan: "Lulusan 2023",
    karir: "Software Engineer di Perusahaan Teknologi Nasional",
    foto: "/images/alumni-1.png",
    kutipan: "Kurikulum berbasis proyek dan keterlibatan dosen praktisi industri memberikan bekal konkret sejak semester awal. Pengalaman riset dan magang yang terfasilitasi kampus membuka jalan karir langsung sebelum upacara wisuda.",
  },
  {
    nama: "Budi Santoso",
    prodi: "Alumni Manajemen Bisnis",
    angkatan: "Lulusan 2022",
    karir: "Founder & CEO Rintisan Edukasi Digital",
    foto: "/images/alumni-2.png",
    kutipan: "Inkubator bisnis kampus memberikan bimbingan intensif mulai dari validasi ide produk hingga tata kelola finansial. Dukungan jaringan dosen dan sesama rekan mahasiswa sangat berharga dalam membangun usaha rintisan.",
  },
  {
    nama: "Rizky Amalia",
    prodi: "Alumni Ilmu Hukum",
    angkatan: "Lulusan 2023",
    karir: "Legal Officer di Badan Usaha Milik Negara",
    foto: "/images/alumni-3.png",
    kutipan: "Fasilitas peradilan semu (moot court) dan klinik bantuan hukum kampus melatih argumentasi hukum secara riil. Pengalaman tersebut memberi kepercayaan diri tinggi saat menjalani proses seleksi profesional.",
  },
  {
    nama: "Ahmad Fauzi",
    prodi: "Alumni Pendidikan Dokter",
    angkatan: "Lulusan 2021",
    karir: "Dokter Residen RSUD Pendidikan",
    foto: "/images/alumni-2.png",
    kutipan: "Rumah sakit pendidikan utama dan jejaring puskesmas binaan memberikan paparan klinis yang luas dan kaya empati. Bimbingan para dokter konsulen membentuk integritas kerja medis yang kokoh.",
  },
]

export function Testimoni() {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((c) => (c === 0 ? TESTIMONIALS.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === TESTIMONIALS.length - 1 ? 0 : c + 1))
  const activeTestimonial = TESTIMONIALS[current]

  return (
    <section className="bg-secondary/40 text-foreground py-20 sm:py-28 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-md bg-secondary border border-border px-3.5 py-1 text-xs font-semibold tracking-wider uppercase mb-4 text-foreground/80">
            <Award className="h-3.5 w-3.5 text-primary" />
            Jejaring Alumni
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-foreground leading-snug mb-3">
            Kiprah Lulusan dan Pengalaman Belajar
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Mendengar langsung refleksi pengalaman akademik dan persiapan karir dari para lulusan Universitas Nusantara.
          </p>
        </div>

        {/* Featured Testimonial Card */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-card text-foreground rounded-xl p-8 sm:p-10 shadow-lg border border-border relative">
            <Quote className="h-8 w-8 text-primary/20 mb-4" />

            <p className="text-foreground text-base sm:text-lg leading-relaxed italic mb-8">
              &ldquo;{activeTestimonial.kutipan}&rdquo;
            </p>

            <div className="flex items-center justify-between flex-wrap gap-4 pt-6 border-t border-border">
              <div className="flex items-center gap-3.5">
                <img
                  src={activeTestimonial.foto}
                  alt={activeTestimonial.nama}
                  className="h-12 w-12 rounded-full object-cover border border-primary/20"
                />
                <div>
                  <p className="font-bold text-sm sm:text-base text-foreground">
                    {activeTestimonial.nama}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activeTestimonial.prodi} ({activeTestimonial.angkatan})
                  </p>
                  <p className="text-xs font-medium text-primary mt-0.5">
                    {activeTestimonial.karir}
                  </p>
                </div>
              </div>

              {/* Slider Controls */}
              <div className="flex items-center gap-2" aria-label="Navigasi testimoni">
                <button
                  onClick={prev}
                  className="h-9 w-9 rounded-lg border border-border flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
                  aria-label="Testimoni sebelumnya"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs text-muted-foreground font-mono px-1">
                  {current + 1} / {TESTIMONIALS.length}
                </span>
                <button
                  onClick={next}
                  className="h-9 w-9 rounded-lg border border-border flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
                  aria-label="Testimoni berikutnya"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Alumni Selector Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {TESTIMONIALS.map((item, idx) => (
              <button
                key={item.nama}
                onClick={() => setCurrent(idx)}
                className={`p-3 rounded-lg border text-left transition-all text-xs ${
                  idx === current
                    ? "bg-card border-primary text-foreground font-semibold shadow-xs"
                    : "bg-card/60 border-border text-muted-foreground hover:text-foreground hover:bg-card"
                }`}
              >
                <p className="truncate font-semibold">{item.nama}</p>
                <p className="truncate text-[11px] opacity-75">{item.prodi}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
