"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

const FAQS = [
  {
    q: "Apa saja jalur pendaftaran yang tersedia di Universitas Nusantara?",
    a: "Tersedia 4 jalur pendaftaran resmi: (1) Jalur SNBT (menggunakan nilai UTBK nasional), (2) Jalur SNBP (berdasarkan nilai rapor dan rekomendasi sekolah), (3) Jalur Prestasi Mandiri (kejuaraan sains, olahraga, seni, dan hafiz Quran), serta (4) Jalur Ujian Mandiri CBT (ujian seleksi mandiri berbasis komputer).",
  },
  {
    q: "Berapa biaya pendaftaran awal dan bagaimana metode pembayarannya?",
    a: "Biaya formulir pendaftaran adalah Rp 250.000 untuk maksimal 3 pilihan program studi. Pembayaran dapat dilakukan melalui transfer Virtual Account resmi (BCA, Mandiri, BNI, BRI) atau pindai kode QRIS nasional secara otomatis.",
  },
  {
    q: "Apakah Uang Kuliah Tunggal (UKT) dapat dicicil?",
    a: "Ya. Universitas menyediakan skema pembayaran UKT bertahap hingga 3 kali angsuran per semester tanpa bunga tambahan. Mahasiswa atau wali dapat mengajukan rencana cicilan sebelum masa awal perkuliahan.",
  },
  {
    q: "Bagaimana kriteria dan prosedur pengajuan beasiswa?",
    a: "Beasiswa terbagi menjadi KIP-Kuliah (pembiayaan penuh oleh pemerintah), Beasiswa Prestasi Akademik (potongan UKT 30% sampai 70%), dan Beasiswa Kemitraan. Pengajuan berkas beasiswa dilakukan bersamaan dengan pengunggahan dokumen pendaftaran.",
  },
  {
    q: "Dokumen apa saja yang wajib diunggah saat registrasi online?",
    a: "Dokumen wajib meliputi: pas foto formal berwarna terbaru, scan KTP atau Kartu Identitas Anak, scan Kartu Keluarga, dan scan Ijazah atau Surat Keterangan Lulus (SKL) sementara bagi lulusan tahun berjalan.",
  },
  {
    q: "Kapan pengumuman hasil seleksi diumumkan dan bagaimana cara mengeceknya?",
    a: "Pengumuman hasil seleksi gelombang berjalan dijadwalkan pada 31 Juli 2025. Calon mahasiswa dapat mengecek status kelulusan secara langsung di portal PMB dengan masuk ke akun masing-masing serta melalui notifikasi email resmi.",
  },
  {
    q: "Apakah kampus menyediakan asrama bagi mahasiswa baru?",
    a: "Ya, tersedia asrama mahasiswa terpadu berkapasitas 2.000 kamar dengan fasilitas pendukung (kamar berpenyejuk udara, akses internet universitas, kantin sehat, dan pengamanan 24 jam). Prioritas diberikan kepada mahasiswa tahun pertama dari luar daerah.",
  },
]

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <section id="faq" className="bg-secondary/40 py-20 sm:py-28 border-b border-border">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
            Pusat Informasi & FAQ
          </p>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-foreground leading-snug mb-3">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Rangkuman jawaban mengenai prosedur pendaftaran, biaya pendidikan, jadwal ujian, dan fasilitas akademik bagi calon mahasiswa dan wali.
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
                  "rounded-lg border bg-card overflow-hidden transition-colors",
                  isOpen ? "border-primary/40 shadow-sm" : "border-border hover:border-primary/20"
                )}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 p-5 text-left focus-visible:outline-2 focus-visible:outline-primary"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                >
                  <span className={cn("font-semibold text-sm sm:text-base pr-2", isOpen ? "text-primary" : "text-foreground")}>
                    {item.q}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180 text-primary"
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-0 border-t border-border/40 mt-1">
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed pt-3">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* WhatsApp Helpdesk Note */}
        <div className="mt-8 p-4 rounded-lg bg-card border border-border flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-primary shrink-0" />
            <p className="text-xs sm:text-sm text-foreground">
              Memiliki pertanyaan spesifik seputar persyaratan berkas Anda?
            </p>
          </div>
          <a
            href="https://wa.me/6281234567890?text=Halo%20panitia%20PMB%2C%20saya%20ingin%20bertanya%20tentang%20pendaftaran"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-primary hover:underline shrink-0"
          >
            Hubungi Panitia PMB
          </a>
        </div>
      </div>
    </section>
  )
}
