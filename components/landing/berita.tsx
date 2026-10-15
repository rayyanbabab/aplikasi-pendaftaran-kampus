import { Calendar, Newspaper } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const BERITA = [
  {
    kategori: "Pengumuman",
    judul: "Pendaftaran PMB Jalur Ujian Mandiri Gelombang II Resmi Dibuka",
    ringkasan: "Universitas Nusantara resmi membuka pendaftaran jalur ujian mandiri untuk calon mahasiswa baru tahun akademik 2025/2026. Registrasi dan pengunggahan berkas dibuka melalui portal PMB.",
    tanggal: "1 Maret 2025",
  },
  {
    kategori: "Prestasi",
    judul: "Mahasiswa UN Raih 3 Penghargaan Utama di Olimpiade Sains Nasional",
    ringkasan: "Delegasi mahasiswa Fakultas Sains dan Teknologi berhasil membawa pulang medali pada kompetisi sains tingkat nasional bidang rekayasa data dan bioteknologi.",
    tanggal: "15 Februari 2025",
  },
  {
    kategori: "Fasilitas",
    judul: "Laboratorium Komputasi Awan dan Pusat Inovasi Digital Diresmikan",
    ringkasan: "Fasilitas laboratorium terpadu di Gedung Rektorat resmi beroperasi guna mendukung penelitian skripsi, praktikum, dan riset kolaborasi industri.",
    tanggal: "10 Februari 2025",
  },
  {
    kategori: "Kerja Sama",
    judul: "Perluasan Program Magang Terakreditasi Bersama BUMN & Mitra Korporasi",
    ringkasan: "Penandatanganan kemitraan strategis guna memfasilitasi program magang bersertifikat dan persiapan karir bagi mahasiswa tingkat akhir.",
    tanggal: "5 Januari 2025",
  },
]

export function Berita() {
  return (
    <section id="berita" className="bg-background py-20 sm:py-28 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
            Warta & Pengumuman Resmi
          </p>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-foreground leading-snug mb-3">
            Kabar dan Pengumuman Terkini
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Informasi resmi seputar agenda penerimaan mahasiswa baru, prestasi civitas akademika, dan perkembangan sarana penunjang studi.
          </p>
        </div>

        {/* News Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {BERITA.map((item, idx) => (
            <article
              key={item.judul}
              className={`rounded-xl border border-border bg-card p-6 flex flex-col justify-between hover:border-primary/30 transition-colors ${
                idx === 0 ? "md:col-span-2 bg-secondary/30" : ""
              }`}
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="outline" className="text-xs font-medium">
                    {item.kategori}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{item.tanggal}</span>
                  </div>
                </div>

                <h3 className={`font-serif font-bold text-foreground leading-snug mb-2 ${
                  idx === 0 ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
                }`}>
                  {item.judul}
                </h3>

                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                  {item.ringkasan}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-border/60">
                <span className="text-xs font-semibold text-primary">
                  Warta Resmi Universitas Nusantara
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
