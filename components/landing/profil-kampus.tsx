import { ShieldCheck, Award, BookOpen, Users, Landmark } from "lucide-react"

const TRIDHARMA = [
  {
    nomor: "01",
    judul: "Pendidikan & Pengajaran Terstandar Internasional",
    deskripsi: "Kurikulum Outcome-Based Education (OBE) yang disesuaikan dengan kebutuhan kompetensi industri modern dan standar akreditasi internasional.",
  },
  {
    nomor: "02",
    judul: "Penelitian Ilmiah & Hilirisasi Inovasi",
    deskripsi: "Pusat kajian riset multidisiplin dengan ratusan publikasi jurnal bereputasi global terindeks Scopus serta paten karya ilmiah dosen dan mahasiswa.",
  },
  {
    nomor: "03",
    judul: "Pengabdian Berkelanjutan kepada Masyarakat",
    deskripsi: "Pemberdayaan sosial terstruktur, pendampingan digitalisasi UMKM desa binaan, dan program bakti sosial kesehatan lintas daerah.",
  },
]

const STATISTIK_INSTITUSI = [
  { angka: "8", label: "Fakultas Pilihan", sub: "Teknik, Kedokteran, FEB, Hukum, dsb." },
  { angka: "45", label: "Program Studi", sub: "Jenjang Sarjana (S1) dan Vokasi (D4)" },
  { angka: "400+", label: "Tenaga Pengajar", sub: "Lulusan S2 & S3 dalam dan luar negeri" },
  { angka: "32", label: "Laboratorium Riset", sub: "Terintegrasi piranti komputasi modern" },
]

export function ProfilKampus() {
  return (
    <section id="profil" className="bg-background py-16 sm:py-24 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left: Campus Life Photography */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden border border-border bg-muted shadow-xs">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="/images/campus-profile.png"
                  alt="Kegiatan perkuliahan civitas akademika Universitas Nusantara"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Legal Accreditation Notice Banner */}
              <div className="p-4 bg-card border-t border-border">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg border border-border bg-secondary text-foreground/85 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      Terakreditasi Institusi Unggul (A)
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Badan Akreditasi Nasional Perguruan Tinggi (BAN-PT) No. 123/SK/2023
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Academic Values */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                Profil & Identitas Institusi
              </p>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-foreground leading-snug">
                Mencetak Generasi Cendekia yang Berintegritas Ilmiah
              </h2>
            </div>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Universitas Nusantara didirikan pada tahun 1990 sebagai wujud komitmen tridharma perguruan tinggi. Kampus kami menyediakan lingkungan akademik inklusif dengan fasilitas laboratorium riset mutakhir, perpustakaan digital terintegrasi, serta kemitraan magang bersama badan usaha milik negara dan korporasi multinasional.
            </p>

            {/* Tridharma Values */}
            <div className="space-y-3.5 pt-2">
              {TRIDHARMA.map((item) => (
                <div
                  key={item.nomor}
                  className="flex items-start gap-3.5 p-3.5 rounded-xl border border-border bg-card/60"
                >
                  <span className="font-mono font-bold text-xs text-primary px-2 py-1 rounded bg-secondary shrink-0">
                    {item.nomor}
                  </span>
                  <div>
                    <h3 className="font-semibold text-xs sm:text-sm text-foreground">
                      {item.judul}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                      {item.deskripsi}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Institutional Fact Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border">
              {STATISTIK_INSTITUSI.map((stat) => (
                <div key={stat.label}>
                  <p className="font-serif font-bold text-xl sm:text-2xl text-foreground">
                    {stat.angka}
                  </p>
                  <p className="text-xs font-semibold text-foreground mt-0.5">
                    {stat.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                    {stat.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
