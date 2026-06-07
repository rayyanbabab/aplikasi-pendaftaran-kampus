"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const FAQS = [
  {
    q: "Apa saja jalur pendaftaran yang tersedia di Universitas Nusantara?",
    a: "Terdapat 4 jalur pendaftaran: (1) SNBT — melalui nilai UTBK nasional, (2) SNBP — melalui nilai rapor & prestasi, (3) Jalur Prestasi — untuk peraih medali/juara olimpiade, atlet, dan hafiz Quran, serta (4) Jalur Mandiri — ujian tulis yang diselenggarakan langsung oleh universitas.",
  },
  {
    q: "Berapa biaya pendaftaran dan apakah bisa dicicil?",
    a: "Biaya pendaftaran adalah Rp 250.000 (satu kali bayar, non-refundable). Adapun biaya kuliah (UKT) dapat dibayar secara cicilan hingga 3 tahap per semester untuk memudahkan mahasiswa.",
  },
  {
    q: "Apakah ada beasiswa untuk mahasiswa baru?",
    a: "Ya, tersedia berbagai beasiswa: Beasiswa KIP-Kuliah (gratis biaya kuliah + uang saku), Beasiswa Prestasi Akademik (potongan 30–70%), Beasiswa Atlet & Seni, serta Beasiswa Hafiz Quran. Informasi lengkap tersedia di portal PMB.",
  },
  {
    q: "Dokumen apa saja yang diperlukan untuk mendaftar?",
    a: "Dokumen yang dibutuhkan: ijazah/SKHUN SMA/sederajat (atau surat keterangan lulus), rapor semester 1–5, KTP/Kartu Keluarga, pas foto terbaru, dan dokumen pendukung sesuai jalur yang dipilih (mis. sertifikat prestasi untuk jalur prestasi).",
  },
  {
    q: "Bagaimana cara mengikuti virtual tour kampus?",
    a: "Virtual tour dapat diakses melalui tombol 'Virtual Tour Kampus' di halaman utama ini. Anda juga dapat menjadwalkan kunjungan langsung ke kampus setiap hari kerja pukul 08.00–15.00 WIB dengan menghubungi panitia PMB melalui WhatsApp.",
  },
  {
    q: "Kapan pengumuman hasil seleksi diumumkan?",
    a: "Pengumuman kelulusan untuk Jalur Mandiri dijadwalkan pada 31 Juli 2025. Peserta yang diterima akan menerima notifikasi melalui email terdaftar dan dapat mengecek status di portal PMB menggunakan akun masing-masing.",
  },
  {
    q: "Apakah ada asrama mahasiswa?",
    a: "Ya, tersedia asrama mahasiswa berkapasitas 2.000 kamar dengan fasilitas lengkap (AC, WiFi, laundry, kafetaria). Asrama diprioritaskan untuk mahasiswa baru dari luar kota. Biaya asrama mulai dari Rp 800.000/bulan.",
  },
  {
    q: "Bagaimana prospek kerja lulusan Universitas Nusantara?",
    a: "92% lulusan kami terserap di dunia kerja dalam 6 bulan setelah wisuda. Kami memiliki Career Center yang aktif memfasilitasi job fair, magang, dan rekrutmen melalui kemitraan dengan 500+ perusahaan nasional dan multinasional.",
  },
]

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <section id="faq" className="bg-secondary py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="section-badge mb-4 inline-flex">
            Pertanyaan Umum
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-foreground text-balance mt-4">
            Pertanyaan yang Sering{" "}
            <span
              style={{
                background: "linear-gradient(135deg, var(--primary), oklch(0.55 0.20 275))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Ditanyakan
            </span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-[0.9375rem] leading-relaxed">
            Tidak menemukan jawaban yang kamu cari? Hubungi kami langsung via WhatsApp.
          </p>
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-3">
          {FAQS.map((item, idx) => {
            const isOpen = openIdx === idx
            return (
              <div
                key={idx}
                className={cn(
                  "rounded-xl border bg-card overflow-hidden transition-all duration-200",
                  isOpen ? "border-primary/40 shadow-md shadow-primary/5" : "border-border hover:border-primary/20"
                )}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                >
                  <span className={cn("font-semibold text-sm sm:text-base pr-4", isOpen ? "text-primary" : "text-foreground")}>
                    {item.q}
                  </span>
                  <ChevronDown className={cn("h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180 text-primary")} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5">
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
