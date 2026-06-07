import { ArrowRight, Calendar, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const BERITA = [
  {
    kategori: "Pengumuman",
    judul: "Pendaftaran PMB Jalur Mandiri 2025 Resmi Dibuka Hari Ini",
    ringkasan: "Universitas Nusantara resmi membuka pendaftaran jalur mandiri untuk tahun akademik 2025/2026. Calon mahasiswa dapat mendaftar melalui portal PMB hingga 30 Juni 2025.",
    tanggal: "1 Maret 2025",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  {
    kategori: "Prestasi",
    judul: "Mahasiswa UN Raih Medali Emas di Olimpiade Sains Nasional 2025",
    ringkasan: "Tim mahasiswa Universitas Nusantara berhasil meraih 3 medali emas pada ajang Olimpiade Sains Nasional 2025 di bidang Fisika, Kimia, dan Matematika.",
    tanggal: "15 Februari 2025",
    badgeColor: "bg-amber-100 text-amber-700",
  },
  {
    kategori: "Fasilitas",
    judul: "Gedung Riset & Inovasi Terbaru Resmi Diresmikan Rektor",
    ringkasan: "Kampus kini memiliki gedung riset 8 lantai berteknologi tinggi dengan laboratorium AI, bioteknologi, dan pusat inovasi untuk mendukung penelitian mahasiswa dan dosen.",
    tanggal: "10 Februari 2025",
    badgeColor: "bg-green-100 text-green-700",
  },
  {
    kategori: "Kerja Sama",
    judul: "MOU dengan 5 Perusahaan Fortune 500 untuk Magang & Rekrutmen",
    ringkasan: "Universitas Nusantara menandatangani MOU dengan 5 perusahaan Fortune 500 untuk program magang berbayar dan jalur rekrutmen khusus bagi mahasiswa dan lulusan UN.",
    tanggal: "5 Januari 2025",
    badgeColor: "bg-rose-100 text-rose-700",
  },
]

export function Berita() {
  return (
    <section id="berita" className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="section-badge mb-4 inline-flex">Info Terkini</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-foreground text-balance mt-4">
              Berita &{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, var(--primary), oklch(0.55 0.20 275))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Pengumuman
              </span>
            </h2>
          </div>
          <Button variant="outline" className="gap-2 shrink-0 rounded-xl border-border hover:border-primary/30 hover:text-primary transition-all">
            Semua Berita <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* News Grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {BERITA.map((item, idx) => (
            <article
              key={item.judul}
              className={`rounded-2xl border border-border bg-card overflow-hidden card-hover group cursor-pointer ${
                idx === 0 ? "md:row-span-2" : ""
              }`}
            >
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${item.badgeColor}`}>
                    <Tag className="h-3 w-3" />
                    {item.kategori}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {item.tanggal}
                  </span>
                </div>

                <h3 className={`font-serif font-bold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors ${
                  idx === 0 ? "text-xl" : "text-base"
                }`}>
                  {item.judul}
                </h3>

                <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                  {item.ringkasan}
                </p>

                <a
                  href="#"
                  className="flex items-center gap-1.5 text-primary text-sm font-semibold mt-4 hover:gap-2.5 transition-all"
                >
                  Baca Selengkapnya <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
