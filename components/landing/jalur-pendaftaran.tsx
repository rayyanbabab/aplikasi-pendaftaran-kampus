import { FileText, Star, Trophy, Pen, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const JALUR = [
  {
    icon: FileText,
    nama: "Jalur SNBT",
    subTitle: "Seleksi Nasional Berbasis Tes",
    deskripsi: "Masuk melalui nilai UTBK-SNBT. Kuota terbatas, tanpa uang pangkal untuk jalur ini.",
    syarat: ["Lulusan SMA/MA/SMK sederajat", "Usia max. 25 tahun", "Nilai UTBK minimal sesuai prodi"],
    kuota: "30%",
    status: "Buka",
    statusColor: "bg-emerald-100 text-emerald-700",
    highlight: false,
  },
  {
    icon: Star,
    nama: "Jalur SNBP",
    subTitle: "Seleksi Nasional Berbasis Prestasi",
    deskripsi: "Masuk melalui nilai rapor & prestasi. Bebas biaya pendaftaran, rekomendasi sekolah.",
    syarat: ["Nilai rapor rata-rata 8.0+", "Direkomendasikan sekolah", "Masuk kuota sekolah 40% terbaik"],
    kuota: "20%",
    status: "Tutup",
    statusColor: "bg-red-100 text-red-700",
    highlight: false,
  },
  {
    icon: Trophy,
    nama: "Jalur Prestasi",
    subTitle: "Seleksi Berbasis Prestasi Non-Akademik",
    deskripsi: "Untuk peraih medali/juara olimpiade, atlet nasional, hafiz Quran, dan seni berprestasi.",
    syarat: ["Sertifikat/piagam prestasi min. tingkat provinsi", "Rekomendasi resmi", "Wawancara seleksi"],
    kuota: "10%",
    status: "Buka",
    statusColor: "bg-emerald-100 text-emerald-700",
    highlight: true,
  },
  {
    icon: Pen,
    nama: "Jalur Mandiri",
    subTitle: "Seleksi Ujian Tulis Mandiri",
    deskripsi: "Ujian tulis yang diselenggarakan langsung oleh universitas. Pendaftaran online mudah.",
    syarat: ["Ijazah SMA/MA/SMK sederajat", "Membayar biaya pendaftaran", "Ikuti ujian tulis mandiri"],
    kuota: "40%",
    status: "Buka",
    statusColor: "bg-emerald-100 text-emerald-700",
    highlight: false,
  },
]

const LANGKAH = [
  { no: "01", judul: "Buat Akun", desc: "Daftarkan diri di portal PMB dengan email aktif" },
  { no: "02", judul: "Pilih Jalur & Prodi", desc: "Pilih jalur pendaftaran dan program studi yang diminati" },
  { no: "03", judul: "Upload Dokumen", desc: "Unggah berkas persyaratan sesuai jalur yang dipilih" },
  { no: "04", judul: "Bayar Pendaftaran", desc: "Lakukan pembayaran biaya pendaftaran via transfer bank" },
  { no: "05", judul: "Ikuti Seleksi", desc: "Jalani proses seleksi sesuai jalur (tes / portofolio / wawancara)" },
  { no: "06", judul: "Pengumuman", desc: "Cek pengumuman kelulusan di portal PMB" },
]

export function JalurPendaftaran() {
  return (
    <section id="jalur" className="bg-secondary py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="section-badge mb-4 inline-flex">Cara Masuk</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-foreground text-balance mt-4">
            Jalur{" "}
            <span
              style={{
                background: "linear-gradient(135deg, var(--primary), oklch(0.55 0.20 275))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Pendaftaran
            </span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-[0.9375rem] leading-relaxed">
            Pilih jalur masuk yang paling sesuai dengan potensi dan prestasi kamu.
          </p>
        </div>

        {/* Jalur Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {JALUR.map((jalur) => (
            <div
              key={jalur.nama}
              className={`relative rounded-2xl border p-5 flex flex-col card-hover ${
                jalur.highlight
                  ? "bg-primary text-primary-foreground border-primary ring-2 ring-primary/30 shadow-xl shadow-primary/25"
                  : "bg-card text-foreground border-border hover:border-primary/25"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                  jalur.highlight ? "bg-white/15" : "bg-primary/10"
                }`}>
                  <jalur.icon className={`h-5 w-5 ${jalur.highlight ? "text-primary-foreground" : "text-primary"}`} />
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${jalur.statusColor}`}>
                  {jalur.status}
                </span>
              </div>

              <h3 className={`font-serif font-bold text-base mb-0.5 ${jalur.highlight ? "text-primary-foreground" : "text-foreground"}`}>
                {jalur.nama}
              </h3>
              <p className={`text-xs mb-3 ${jalur.highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {jalur.subTitle}
              </p>
              <p className={`text-sm leading-relaxed mb-4 ${jalur.highlight ? "text-primary-foreground/85" : "text-muted-foreground"}`}>
                {jalur.deskripsi}
              </p>

              <div className="flex-1 mb-4">
                <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${jalur.highlight ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                  Syarat Utama
                </p>
                {jalur.syarat.map((s) => (
                  <p key={s} className={`text-xs mb-1 flex items-start gap-1.5 ${jalur.highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    <span className="mt-1 shrink-0 h-1.5 w-1.5 rounded-full bg-current" />
                    {s}
                  </p>
                ))}
              </div>

              <div className={`text-center py-2 rounded-lg text-sm font-semibold mb-3 ${
                jalur.highlight ? "bg-white/15 text-primary-foreground" : "bg-secondary text-foreground"
              }`}>
                Kuota: {jalur.kuota}
              </div>

              {jalur.status === "Buka" && (
                <a href="#" className="mt-auto">
                  <Button
                    size="sm"
                    className={`w-full gap-1 ${
                      jalur.highlight
                        ? "bg-accent text-accent-foreground hover:bg-accent/90"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    Daftar <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Langkah Pendaftaran */}
        <div>
          <h3 className="font-serif text-2xl font-bold text-foreground text-center mb-8">
            Alur Pendaftaran
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {LANGKAH.map((langkah, idx) => (
              <div key={langkah.no} className="flex gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/25 hover:shadow-md transition-all duration-200">
                <div className="shrink-0 h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/25">
                  <span className="text-primary-foreground font-bold text-sm font-serif">{langkah.no}</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{langkah.judul}</p>
                  <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">{langkah.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
