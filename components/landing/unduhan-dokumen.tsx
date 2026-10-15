"use client"

import { useState } from "react"
import { Download, FileText, CheckCircle2, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface DokumenItem {
  id: string
  judul: string
  kategori: "Panduan" | "Brosur" | "Template Berkas" | "Beasiswa"
  format: "PDF" | "DOCX"
  ukuran: string
  tanggalUpdate: string
  deskripsi: string
}

const DOKUMEN_LIST: DokumenItem[] = [
  {
    id: "panduan-pmb",
    judul: "Buku Pedoman Resmi PMB T.A. 2025/2026",
    kategori: "Panduan",
    format: "PDF",
    ukuran: "4.2 MB",
    tanggalUpdate: "15 April 2025",
    deskripsi: "Petunjuk komprehensif alur pendaftaran, verifikasi berkas daring, tata cara pembayaran Virtual Account, dan mekanisme daftar ulang.",
  },
  {
    id: "brosur-prodi",
    judul: "Katalog Fakultas, Program Studi & Kurikulum",
    kategori: "Brosur",
    format: "PDF",
    ukuran: "8.5 MB",
    tanggalUpdate: "10 April 2025",
    deskripsi: "Profil lengkap 8 fakultas, 45 program studi, capaian akreditasi BAN-PT/LAM, fasilitas laboratorium, serta prospek karir lulusan.",
  },
  {
    id: "template-pernyataan",
    judul: "Format Surat Pernyataan Kesanggupan & Bebas Narkoba",
    kategori: "Template Berkas",
    format: "DOCX",
    ukuran: "185 KB",
    tanggalUpdate: "5 Januari 2025",
    deskripsi: "Format surat resmi bermaterai Rp 10.000 yang wajib diisi dan diunggah calon mahasiswa pada tahapan verifikasi dokumen.",
  },
  {
    id: "panduan-cbt",
    judul: "Petunjuk Teknis Ujian Seleksi Mandiri CBT Daring",
    kategori: "Panduan",
    format: "PDF",
    ukuran: "1.4 MB",
    tanggalUpdate: "2 Mei 2025",
    deskripsi: "Spesifikasi perangkat komputer yang dipersyaratkan, panduan instalasi aplikasi safe-browser, dan tata tertib pengawasan ujian online.",
  },
  {
    id: "pedoman-beasiswa",
    judul: "Pedoman Pengajuan Keringanan UKT & Beasiswa KIP-K",
    kategori: "Beasiswa",
    format: "PDF",
    ukuran: "2.1 MB",
    tanggalUpdate: "20 Maret 2025",
    deskripsi: "Persyaratan berkas bukti finansial, kartu jaminan sosial (KIP/PKH), dan alur wawancara penetapan kelompok Uang Kuliah Tunggal (UKT).",
  },
  {
    id: "kalender-pmb",
    judul: "Lembar Kalender Agenda PMB Gelombang I s.d. III",
    kategori: "Panduan",
    format: "PDF",
    ukuran: "920 KB",
    tanggalUpdate: "1 Mei 2025",
    deskripsi: "Rincian linimasa batas akhir penyerahan berkas fisik, jadwal pengumuman kelulusan, dan periode pembayaran biaya perkuliahan semester awal.",
  },
]

export function UnduhanDokumen() {
  const [search, setSearch] = useState("")
  const [selectedKategori, setSelectedKategori] = useState<string>("Semua")

  const filteredDokumen = DOKUMEN_LIST.filter((dok) => {
    const matchSearch =
      dok.judul.toLowerCase().includes(search.toLowerCase()) ||
      dok.deskripsi.toLowerCase().includes(search.toLowerCase())
    const matchKategori = selectedKategori === "Semua" || dok.kategori === selectedKategori
    return matchSearch && matchKategori
  })

  const handleDownload = (dok: DokumenItem) => {
    toast.success(`Mengunduh dokumen: ${dok.judul} (${dok.format})`, {
      description: "Berkas resmi terverifikasi dari Biro Administrasi Akademik Universitas Nusantara.",
    })
  }

  return (
    <section id="unduhan" className="bg-background py-20 sm:py-28 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider uppercase text-primary mb-2">
              Biro Administrasi Akademik
            </p>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-foreground leading-snug mb-3">
              Pusat Unduhan & Dokumen Resmi PMB
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Dapatkan buku panduan resmi, format surat pernyataan, pedoman ujian CBT, dan formulir beasiswa langsung dari panitia penerimaan mahasiswa baru.
            </p>
          </div>

          <div className="bg-secondary/60 border border-border rounded-xl p-4 shrink-0 max-w-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground mb-1">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Dokumen Resmi T.A. 2025/2026</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Seluruh berkas terverifikasi resmi oleh panitia admisi dan diperbarui berkala sesuai regulasi akademik.
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1" aria-label="Filter Kategori Dokumen">
            {["Semua", "Panduan", "Brosur", "Template Berkas", "Beasiswa"].map((kat) => (
              <button
                key={kat}
                onClick={() => setSelectedKategori(kat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                  selectedKategori === kat
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {kat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari nama dokumen atau berkas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs h-9 bg-card border-border"
            />
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDokumen.map((dok) => (
            <div
              key={dok.id}
              className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between hover:border-primary/40 transition-all hover:shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant="outline" className="text-[10px] font-mono py-0.5">
                    {dok.kategori}
                  </Badge>
                  <span className="text-[11px] font-mono font-medium text-muted-foreground">
                    {dok.format} &bull; {dok.ukuran}
                  </span>
                </div>

                <div className="flex items-start gap-3 mb-2.5">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-foreground leading-snug">
                      {dok.judul}
                    </h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Diperbarui: {dok.tanggalUpdate}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mt-2 mb-5">
                  {dok.deskripsi}
                </p>
              </div>

              <div className="pt-3 border-t border-border">
                <Button
                  onClick={() => handleDownload(dok)}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-semibold gap-2 border-border hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  Unduh Berkas {dok.format}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
