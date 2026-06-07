import { Calendar, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const TIMELINE = [
  {
    fase: "Pendaftaran Online",
    tanggal: "1 Maret – 30 Juni 2025",
    deskripsi: "Buka akun, isi formulir, dan upload berkas persyaratan di portal PMB.",
    status: "selesai",
    items: ["Pendaftaran akun portal", "Pengisian biodata", "Upload dokumen persyaratan"],
  },
  {
    fase: "Pembayaran Biaya Pendaftaran",
    tanggal: "1 Maret – 2 Juli 2025",
    deskripsi: "Lakukan pembayaran biaya pendaftaran melalui virtual account bank mitra.",
    status: "selesai",
    items: ["Biaya pendaftaran Rp 250.000", "Pembayaran via BNI / BRI / Mandiri", "Konfirmasi otomatis sistem"],
  },
  {
    fase: "Seleksi & Ujian Tulis",
    tanggal: "5 – 20 Juli 2025",
    deskripsi: "Ujian tulis mandiri dilaksanakan di kampus atau secara daring.",
    status: "aktif",
    items: ["Ujian Kemampuan Dasar (UKD)", "Ujian Kemampuan Sains & Teknologi", "Ujian Kemampuan Sosial-Humaniora"],
  },
  {
    fase: "Pengumuman Kelulusan",
    tanggal: "31 Juli 2025",
    deskripsi: "Hasil seleksi diumumkan melalui portal PMB dan email terdaftar.",
    status: "akan-datang",
    items: ["Cek portal PMB dengan akun", "Notifikasi email & SMS", "Konsultasi hasil via WhatsApp"],
  },
  {
    fase: "Daftar Ulang & Registrasi",
    tanggal: "1 – 15 Agustus 2025",
    deskripsi: "Peserta yang diterima melakukan daftar ulang dan pembayaran awal.",
    status: "akan-datang",
    items: ["Upload ulang dokumen asli", "Bayar uang pangkal / UKT", "Pemilihan mata kuliah awal"],
  },
  {
    fase: "Orientasi Mahasiswa Baru",
    tanggal: "18 – 22 Agustus 2025",
    deskripsi: "Kegiatan pengenalan kampus, fasilitas, dan komunitas akademik.",
    status: "akan-datang",
    items: ["Pengenalan kampus & fasilitas", "Pertemuan dengan dosen wali", "Kegiatan keakraban angkatan"],
  },
  {
    fase: "Awal Perkuliahan",
    tanggal: "1 September 2025",
    deskripsi: "Perkuliahan semester ganjil tahun akademik 2025/2026 dimulai.",
    status: "akan-datang",
    items: ["Masuk kelas perdana", "Pengenalan silabus", "Akses LMS kampus"],
  },
]

const STATUS_CONFIG = {
  selesai: { label: "Selesai", className: "bg-muted text-muted-foreground" },
  aktif: { label: "Berlangsung", className: "bg-emerald-100 text-emerald-700" },
  "akan-datang": { label: "Akan Datang", className: "bg-secondary text-muted-foreground border border-border" },
}

export function JadwalPMB() {
  return (
    <section id="jadwal" className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="section-badge mb-4 inline-flex">Timeline</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-foreground text-balance mt-4">
            Jadwal PMB{" "}
            <span
              style={{
                background: "linear-gradient(135deg, var(--primary), oklch(0.55 0.20 275))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              2025/2026
            </span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-[0.9375rem] leading-relaxed">
            Pantau seluruh tahapan penerimaan mahasiswa baru agar tidak melewatkan satu pun jadwal penting.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line - gradient */}
          <div
            className="absolute left-4 sm:left-8 top-0 bottom-0 w-0.5 hidden sm:block"
            style={{ background: "linear-gradient(to bottom, var(--primary), oklch(0.55 0.20 275) 60%, transparent)" }}
          />

          <div className="flex flex-col gap-6">
            {TIMELINE.map((item, idx) => {
              const conf = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG]
              const isActive = item.status === "aktif"
              return (
                <div key={item.fase} className="relative sm:pl-20">
                  {/* Circle on timeline */}
                  <div className={`absolute left-2 sm:left-5 top-4 h-7 w-7 rounded-full border-2 flex items-center justify-center shrink-0 hidden sm:flex z-10 ${
                    isActive
                      ? "bg-primary border-primary"
                      : item.status === "selesai"
                      ? "bg-muted border-border"
                      : "bg-card border-border"
                  }`}>
                    {isActive ? (
                      <div className="h-2.5 w-2.5 rounded-full bg-white" />
                    ) : (
                      <span className="text-xs font-bold text-muted-foreground">{idx + 1}</span>
                    )}
                  </div>

                  <div className={`rounded-2xl border p-5 transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/25"
                      : "bg-card border-border hover:border-primary/20 hover:shadow-md"
                  }`}>
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <h3 className={`font-serif font-bold text-base ${isActive ? "text-primary-foreground" : "text-foreground"}`}>
                        {item.fase}
                      </h3>
                      <Badge className={conf.className}>{conf.label}</Badge>
                    </div>

                    <div className={`flex items-center gap-1.5 text-xs mb-2 ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      <Calendar className="h-3.5 w-3.5" />
                      {item.tanggal}
                    </div>

                    <p className={`text-sm leading-relaxed mb-3 ${isActive ? "text-primary-foreground/85" : "text-muted-foreground"}`}>
                      {item.deskripsi}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {item.items.map((it) => (
                        <span key={it} className={`text-xs px-2.5 py-1 rounded-full ${
                          isActive ? "bg-white/15 text-primary-foreground" : "bg-secondary text-foreground border border-border"
                        }`}>
                          {it}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
