"use client"

import { useState } from "react"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"

const TESTIMONIALS = [
  {
    nama: "Sari Dewi Rahayu",
    prodi: "Teknik Informatika, 2019",
    jabatan: "Software Engineer at Gojek",
    foto: "/images/alumni-1.png",
    rating: 5,
    teks: "Kuliah di Universitas Nusantara benar-benar mengubah hidup saya. Kurikulum yang relevan dengan industri dan dosen-dosen yang berpengalaman membuat saya siap kerja sejak hari pertama lulus. Saya berhasil masuk ke Gojek bahkan sebelum wisuda!",
  },
  {
    nama: "Budi Santoso",
    prodi: "Manajemen, 2018",
    jabatan: "Co-Founder Startup Fintech",
    foto: "/images/alumni-2.png",
    rating: 5,
    teks: "Ekosistem kewirausahaan di kampus ini luar biasa. Dari inkubator bisnis, mentor, hingga jaringan alumni yang kuat — semua mendukung saya membangun startup sendiri. Kini perusahaan kami sudah melayani 500.000+ pengguna aktif.",
  },
  {
    nama: "Rizky Amalia",
    prodi: "Hukum Bisnis, 2020",
    jabatan: "Legal Counsel at BUMN",
    foto: "/images/alumni-3.png",
    rating: 5,
    teks: "Fasilitas perpustakaan hukum dan klinik hukum kampus sangat membantu proses belajar. Program magang yang difasilitasi kampus membuka pintu karir saya di BUMN. Saya bangga bisa berkontribusi untuk Indonesia dari posisi ini.",
  },
  {
    nama: "Ahmad Fauzi",
    prodi: "Pendidikan Dokter, 2017",
    jabatan: "Dokter Spesialis Anak, RSUD",
    foto: "/images/alumni-2.png",
    rating: 5,
    teks: "Fasilitas laboratorium dan rumah sakit pendidikan di sini setara dengan universitas terbaik nasional. Pembimbing klinis yang penuh dedikasi membentuk saya menjadi dokter yang tidak hanya kompeten, tapi juga memiliki empati tinggi.",
  },
]

export function Testimoni() {
  const [current, setCurrent] = useState(0)
  const prev = () => setCurrent((c) => (c === 0 ? TESTIMONIALS.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === TESTIMONIALS.length - 1 ? 0 : c + 1))
  const t = TESTIMONIALS[current]

  return (
    <section className="relative bg-primary py-24 sm:py-32 overflow-hidden">
      {/* Decorative mesh orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
            style={{
              background: "oklch(1 0 0 / 0.12)",
              color: "oklch(0.76 0.155 70)",
              border: "1px solid oklch(1 0 0 / 0.18)",
            }}
          >
            Alumni Berbicara
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-primary-foreground text-balance mt-4">
            Cerita Sukses{" "}
            <span
              style={{
                background: "linear-gradient(90deg, oklch(0.76 0.155 70), oklch(0.92 0.12 60))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Alumni Kami
            </span>
          </h2>
          <p className="text-primary-foreground/65 mt-4 max-w-xl mx-auto text-[0.9375rem] leading-relaxed">
            Ribuan alumni kami kini berkarir di perusahaan terkemuka dalam dan luar negeri.
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-2xl p-8 shadow-2xl relative border border-white/5">
            {/* Quote mark */}
            <div className="text-6xl text-accent/30 font-serif leading-none absolute top-6 left-8 select-none">
              &ldquo;
            </div>

            <div className="pt-6">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>

              <p className="text-foreground text-base sm:text-lg leading-relaxed italic mb-6">
                &ldquo;{t.teks}&rdquo;
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={t.foto}
                  alt={t.nama}
                  className="h-14 w-14 rounded-full object-cover border-2 border-accent"
                />
                <div>
                  <p className="font-bold text-foreground">{t.nama}</p>
                  <p className="text-muted-foreground text-sm">{t.prodi}</p>
                  <p className="text-accent text-xs font-semibold mt-0.5">{t.jabatan}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              aria-label="Testimonial sebelumnya"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === current ? "w-6 bg-accent" : "w-2 bg-white/30"
                  }`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              aria-label="Testimonial berikutnya"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Bottom Grid Mini Testimonials */}
        <div className="grid sm:grid-cols-4 gap-4 mt-10">
          {TESTIMONIALS.map((item, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                i === current
                  ? "bg-white/15 border-white/30"
                  : "bg-white/5 border-transparent hover:bg-white/10"
              }`}
            >
              <img
                src={item.foto}
                alt={item.nama}
                className="h-9 w-9 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="text-primary-foreground font-semibold text-xs truncate">{item.nama}</p>
                <p className="text-primary-foreground/60 text-xs truncate">{item.jabatan}</p>
              </div>
            </button>
          ))}
        </div>
        </div>
    </section>
  )
}
