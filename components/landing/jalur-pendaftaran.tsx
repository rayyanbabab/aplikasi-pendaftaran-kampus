import Link from "next/link"
import { FileText, Award, Trophy, PenTool, CheckCircle2, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const JALUR = [
  {
    icon: Award,
    nama: "Jalur SNBP",
    subTitle: "Seleksi Nasional Berdasarkan Prestasi",
    deskripsi: "Seleksi berbasis nilai rapor semester 1 sampai 5 dan portofolio prestasi siswa yang direkomendasikan sekolah.",
    syarat: [
      "Siswa SMA, MA, atau SMK kelas 12 pada tahun berjalan",
      "Memiliki NISN dan terdaftar di PDSS",
      "Nilai rapor konsisten dengan rata-rata minimal 8.0",
    ],
    kuota: "Kuota 20%",
    status: "Ditutup (Selesai)",
    isOpen: false,
  },
  {
    icon: FileText,
    nama: "Jalur SNBT",
    subTitle: "Seleksi Nasional Berbasis Tes (UTBK)",
    deskripsi: "Penerimaan menggunakan sertifikat nilai UTBK-SNBT nasional dengan pemeringkatan nilai per program studi.",
    syarat: [
      "Memiliki sertifikat nilai UTBK tahun berjalan",
      "Lulusan SMA, MA, SMK tiga tahun terakhir",
      "Memenuhi kriteria nilai minimum program studi",
    ],
    kuota: "Kuota 30%",
    status: "Dibuka",
    isOpen: true,
  },
  {
    icon: Trophy,
    nama: "Jalur Prestasi Mandiri",
    subTitle: "Kejuaraan Sains, Olahraga, Seni & Tahfiz",
    deskripsi: "Jalur khusus bagi peraih medali olimpiade sains, atlet tingkat provinsi/nasional, seniman, dan penghafal Al-Qur'an.",
    syarat: [
      "Sertifikat kejuaraan minimal tingkat provinsi",
      "Sertifikat tahfiz minimal 5 juz bagi jalur keagamaan",
      "Lulus wawancara verifikasi kemampuan teknis",
    ],
    kuota: "Kuota 15%",
    status: "Dibuka",
    isOpen: true,
  },
  {
    icon: PenTool,
    nama: "Jalur Ujian Mandiri (CBT)",
    subTitle: "Computer-Based Test Online & Onsite",
    deskripsi: "Seleksi ujian mandiri yang diselenggarakan langsung oleh universitas. Tersedia pilihan tes daring maupun luring di kampus.",
    syarat: [
      "Lulusan SMA, MA, SMK atau Paket C",
      "Mengisi formulir pendaftaran di portal PMB",
      "Mengikuti Computer-Based Test sesuai jadwal",
    ],
    kuota: "Kuota 35%",
    status: "Dibuka (Gelombang 2)",
    isOpen: true,
  },
]

const TAHAP_PENDAFTARAN = [
  { no: "1", judul: "Registrasi Akun", desc: "Buat akun di portal PMB menggunakan email aktif dan nomor WhatsApp calon mahasiswa." },
  { no: "2", judul: "Pilih Program Studi", desc: "Pilih hingga maksimal 3 program studi dan jalur seleksi yang diminati." },
  { no: "3", judul: "Lengkapi Biodata & Berkas", desc: "Isi data pribadi, orang tua, sekolah asal, dan unggah dokumen pendukung (KTP, rapor, ijazah)." },
  { no: "4", judul: "Pembayaran Formulir", desc: "Bayar biaya registrasi sebesar Rp 250.000 melalui Virtual Account atau QRIS resmi." },
  { no: "5", judul: "Verifikasi & Seleksi", desc: "Tim admisi memeriksa berkas, diikuti pelaksanaan ujian tes atau validasi portofolio." },
  { no: "6", judul: "Pengumuman & Daftar Ulang", desc: "Hasil seleksi diumumkan melalui portal pribadi pendaftar untuk selanjutnya melakukan registrasi ulang." },
]

export function JalurPendaftaran() {
  return (
    <section id="jalur" className="bg-secondary/40 py-20 sm:py-28 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
            Jalur Masuk & Seleksi
          </p>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-foreground leading-snug mb-3">
            Pilihan Jalur Penerimaan Mahasiswa Baru
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Tersedia empat jalur seleksi resmi yang dapat Anda pilih sesuai dengan rekam jejak akademik, capaian kejuaraan, maupun hasil ujian mandiri.
          </p>
        </div>

        {/* Jalur Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {JALUR.map((jalur) => (
            <div
              key={jalur.nama}
              className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between hover:border-primary/30 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="h-9 w-9 rounded-lg border border-border bg-secondary text-foreground/85 flex items-center justify-center">
                    <jalur.icon className="h-4 w-4" />
                  </div>
                  <Badge
                    variant={jalur.isOpen ? "default" : "secondary"}
                    className="text-[11px] font-medium"
                  >
                    {jalur.status}
                  </Badge>
                </div>

                <h3 className="font-serif font-bold text-base text-foreground mb-0.5">
                  {jalur.nama}
                </h3>
                <p className="text-xs text-primary font-medium mb-2.5">
                  {jalur.subTitle}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  {jalur.deskripsi}
                </p>

                <div className="mb-4 pt-3 border-t border-border">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Persyaratan Utama:
                  </p>
                  <ul className="space-y-1.5">
                    {jalur.syarat.map((syarat, sIdx) => (
                      <li key={sIdx} className="text-xs text-foreground/80 flex items-start gap-1.5 leading-snug">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        <span>{syarat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>Alokasi Bangku:</span>
                  <span className="font-semibold text-foreground">{jalur.kuota}</span>
                </div>

                {jalur.isOpen ? (
                  <Link href="/auth/register" className="block w-full">
                    <Button size="sm" className="w-full text-xs font-semibold gap-1.5">
                      Pilih Jalur Ini
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                ) : (
                  <Button size="sm" variant="secondary" disabled className="w-full text-xs">
                    Pendaftaran Berakhir
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Step-by-Step Registration Workflow */}
        <div className="bg-card rounded-xl border border-border p-6 sm:p-8">
          <h3 className="font-serif font-bold text-xl text-foreground mb-6">
            Alur Tahapan Pendaftaran Calon Mahasiswa Baru
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TAHAP_PENDAFTARAN.map((tahap) => (
              <div key={tahap.no} className="flex items-start gap-3.5">
                <div className="h-7 w-7 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                  {tahap.no}
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-1">{tahap.judul}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tahap.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
