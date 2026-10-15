"use client"

import { useState, useMemo } from "react"
import { Calendar, Clock, CheckCircle2, AlertCircle, ArrowRight, Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TimelineItem {
  id: number
  gelombang: "Gelombang 1" | "Gelombang 2" | "Pascasarjana"
  fase: string
  tanggal: string
  deskripsi: string
  status: "selesai" | "aktif" | "akan-datang"
  statusLabel: string
}

const TIMELINE_DATA: TimelineItem[] = [
  {
    id: 1,
    gelombang: "Gelombang 1",
    fase: "Pendaftaran Online & Upload Berkas Gelombang I",
    tanggal: "15 Januari s.d. 30 April 2025",
    deskripsi: "Pendaftaran akun portal PMB, pengisian biodata diri, dan pengunggahan berkas rapor semester 1 s.d. 5.",
    status: "selesai",
    statusLabel: "Selesai",
  },
  {
    id: 2,
    gelombang: "Gelombang 1",
    fase: "Ujian CBT & Pengumuman Hasil Gelombang I",
    tanggal: "5 Mei 2025",
    deskripsi: "Pelaksanaan tes potensi skolastik dan pengumuman kelulusan serta penawaran beasiswa prestasi.",
    status: "selesai",
    statusLabel: "Selesai",
  },
  {
    id: 3,
    gelombang: "Gelombang 2",
    fase: "Pendaftaran & Pembayaran Formulir Gelombang II",
    tanggal: "1 Mei s.d. 30 Juli 2025",
    deskripsi: "Pendaftaran jalur mandiri dan seleksi nilai UTBK / Rapor. Pembayaran formulir via Virtual Account.",
    status: "aktif",
    statusLabel: "Sedang Berlangsung",
  },
  {
    id: 4,
    gelombang: "Gelombang 2",
    fase: "Pelaksanaan Ujian Mandiri Komputer (CBT)",
    tanggal: "2 s.d. 4 Agustus 2025",
    deskripsi: "Pelaksanaan ujian seleksi berbasis komputer secara daring (online) dengan pengawasan kamera terpadu.",
    status: "akan-datang",
    statusLabel: "Akan Datang",
  },
  {
    id: 5,
    gelombang: "Gelombang 2",
    fase: "Pengumuman Kelulusan Gelombang II",
    tanggal: "8 Agustus 2025",
    deskripsi: "Hasil seleksi kelulusan dan rincian penetapan kelompok UKT dapat dilihat langsung di Dashboard akun.",
    status: "akan-datang",
    statusLabel: "Akan Datang",
  },
  {
    id: 6,
    gelombang: "Gelombang 2",
    fase: "Masa Registrasi Ulang & Cetak KTM Sementara",
    tanggal: "10 s.d. 20 Agustus 2025",
    deskripsi: "Pembayaran UKT semester 1 dan pengunggahan berkas fisik asli untuk validasi Nomor Induk Mahasiswa (NIM).",
    status: "akan-datang",
    statusLabel: "Akan Datang",
  },
  {
    id: 7,
    gelombang: "Pascasarjana",
    fase: "Seleksi Wawancara & TPA Magister (S2)",
    tanggal: "15 Juli s.d. 10 Agustus 2025",
    deskripsi: "Ujian TPA Bappenas dan tes wawancara proposal tesis bagi calon mahasiswa program magister.",
    status: "akan-datang",
    statusLabel: "Akan Datang",
  },
]

export function JadwalPMB() {
  const [activeFilter, setActiveFilter] = useState<string>("Semua")

  const filteredTimeline = useMemo(() => {
    if (activeFilter === "Semua") return TIMELINE_DATA
    return TIMELINE_DATA.filter((item) => item.gelombang === activeFilter)
  }, [activeFilter])

  return (
    <section id="jadwal" className="bg-secondary/30 py-20 sm:py-28 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
              Agenda & Linimasa Seleksi
            </p>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-foreground leading-snug mb-3">
              Jadwal Resmi Penerimaan Mahasiswa Baru 2025/2026
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Pantau batas waktu tiap tahapan seleksi agar tidak terlewat batas pengunggahan dokumen, pelaksanaan ujian tulis, maupun registrasi ulang.
            </p>
          </div>

          {/* Active Period Highlight Card */}
          <div className="bg-card border border-primary/20 rounded-xl p-4 shadow-xs shrink-0 max-w-xs">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                Tahap Saat Ini: Aktif
              </span>
            </div>
            <p className="font-semibold text-xs sm:text-sm text-foreground">
              Gelombang II Sedang Dibuka
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Batas akhir pendaftaran: 30 Juli 2025
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1" aria-label="Filter Gelombang Jadwal">
          {["Semua", "Gelombang 1", "Gelombang 2", "Pascasarjana"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={cn(
                "px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors shrink-0",
                activeFilter === tab
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {tab === "Semua" ? "Semua Gelombang" : tab}
            </button>
          ))}
        </div>

        {/* Timeline List */}
        <div className="relative border-l-2 border-border ml-3 sm:ml-6 pl-6 sm:pl-8 space-y-6">
          {filteredTimeline.map((item, idx) => {
            const isActive = item.status === "aktif"
            const isCompleted = item.status === "selesai"

            return (
              <div key={item.id} className="relative group">
                {/* Node icon */}
                <div
                  className={cn(
                    "absolute -left-[31px] sm:-left-[39px] top-2 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground shadow-xs ring-4 ring-primary/10"
                      : isCompleted
                      ? "border-emerald-600 bg-emerald-50 text-emerald-600"
                      : "border-border bg-card text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : isActive ? (
                    <Clock className="h-3.5 w-3.5" />
                  ) : (
                    <span className="text-[10px] font-mono font-bold">{idx + 1}</span>
                  )}
                </div>

                {/* Content Box */}
                <div
                  className={cn(
                    "rounded-xl border p-5 sm:p-6 transition-all",
                    isActive
                      ? "bg-card border-primary/40 shadow-xs ring-1 ring-primary/20"
                      : "bg-card border-border hover:border-primary/20"
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] font-mono py-0.5">
                        {item.gelombang}
                      </Badge>
                      <h3 className="font-serif font-bold text-sm sm:text-base text-foreground">
                        {item.fase}
                      </h3>
                    </div>

                    <Badge
                      variant={isActive ? "default" : isCompleted ? "secondary" : "outline"}
                      className={cn(
                        "text-xs font-medium",
                        isCompleted && "bg-emerald-50 text-emerald-700 border-emerald-200"
                      )}
                    >
                      {item.statusLabel}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mb-2 font-mono">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{item.tanggal}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.deskripsi}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
