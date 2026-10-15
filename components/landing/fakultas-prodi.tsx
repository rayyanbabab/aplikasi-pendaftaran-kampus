"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  GraduationCap,
  Search,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  BookOpen,
  Users,
  Award,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProdiItem {
  nama: string
  jenjang: "S1" | "D4" | "S2" | "Profesi"
  gelar: string
  kuota: number
  akreditasi: string
  karir: string
}

interface FakultasItem {
  id: number
  nama: string
  singkatan: string
  jenjangUtama: string
  akreditasi: string
  totalMahasiswa: string
  deskripsi: string
  prodiList: ProdiItem[]
}

const FAKULTAS_DATA: FakultasItem[] = [
  {
    id: 1,
    nama: "Fakultas Teknik",
    singkatan: "FT",
    jenjangUtama: "S1 & D4",
    akreditasi: "Unggul (A)",
    totalMahasiswa: "4.250",
    deskripsi: "Menyelenggarakan pendidikan rekayasa teknologi dan komputasi berbasis inovasi industri berkelanjutan.",
    prodiList: [
      {
        nama: "Teknik Informatika",
        jenjang: "S1",
        gelar: "S.Kom.",
        kuota: 180,
        akreditasi: "Unggul (A)",
        karir: "Software Engineer, AI Engineer, Cloud Architect",
      },
      {
        nama: "Sistem Informasi",
        jenjang: "S1",
        gelar: "S.Kom.",
        kuota: 120,
        akreditasi: "Unggul (A)",
        karir: "Product Manager, Data Analyst, IT Consultant",
      },
      {
        nama: "Teknik Sipil",
        jenjang: "S1",
        gelar: "S.T.",
        kuota: 90,
        akreditasi: "Unggul (A)",
        karir: "Structural Engineer, Project Planner, Konsultan Konstruksi",
      },
      {
        nama: "Teknik Elektro",
        jenjang: "S1",
        gelar: "S.T.",
        kuota: 75,
        akreditasi: "Unggul (A)",
        karir: "IoT Engineer, Automation Engineer, Telekomunikasi",
      },
      {
        nama: "Teknik Mesin",
        jenjang: "S1",
        gelar: "S.T.",
        kuota: 80,
        akreditasi: "Baik Sekali (B)",
        karir: "Mechanical Designer, Maintenance Specialist, Manufaktur",
      },
    ],
  },
  {
    id: 2,
    nama: "Fakultas Ekonomi & Bisnis",
    singkatan: "FEB",
    jenjangUtama: "S1 & S2",
    akreditasi: "Unggul (A)",
    totalMahasiswa: "5.100",
    deskripsi: "Pusat keunggulan kajian manajerial, akuntansi forensik, dan transformasi ekosistem bisnis digital.",
    prodiList: [
      {
        nama: "Manajemen Bisnis",
        jenjang: "S1",
        gelar: "S.M.",
        kuota: 220,
        akreditasi: "Unggul (A)",
        karir: "Business Strategist, Brand Manager, Entrepreneur",
      },
      {
        nama: "Akuntansi",
        jenjang: "S1",
        gelar: "S.Ak.",
        kuota: 160,
        akreditasi: "Unggul (A)",
        karir: "Auditor Publik, Financial Analyst, Tax Specialist",
      },
      {
        nama: "Bisnis Digital",
        jenjang: "S1",
        gelar: "S.Bns.",
        kuota: 100,
        akreditasi: "Baik Sekali (B)",
        karir: "Growth Marketer, E-Commerce Specialist, FinTech Lead",
      },
      {
        nama: "Magister Manajemen",
        jenjang: "S2",
        gelar: "M.M.",
        kuota: 60,
        akreditasi: "Unggul (A)",
        karir: "Executive Leader, General Manager, Business Director",
      },
    ],
  },
  {
    id: 3,
    nama: "Fakultas Hukum",
    singkatan: "FH",
    jenjangUtama: "S1 & S2",
    akreditasi: "Unggul (A)",
    totalMahasiswa: "2.800",
    deskripsi: "Membentuk lulusan berintegritas tinggi dengan kepakaran advokasi peradilan semu dan hukum korporasi.",
    prodiList: [
      {
        nama: "Ilmu Hukum",
        jenjang: "S1",
        gelar: "S.H.",
        kuota: 180,
        akreditasi: "Unggul (A)",
        karir: "Advokat, Hakim, Jaksa, Corporate Legal Counsel",
      },
      {
        nama: "Hukum Bisnis & Perbankan",
        jenjang: "S1",
        gelar: "S.H.",
        kuota: 90,
        akreditasi: "Baik Sekali (B)",
        karir: "Compliance Officer, Notaris, Financial Legal Specialist",
      },
    ],
  },
  {
    id: 4,
    nama: "Fakultas Kedokteran & Kesehatan",
    singkatan: "FK",
    jenjangUtama: "S1 & Profesi",
    akreditasi: "Unggul (A)",
    totalMahasiswa: "1.950",
    deskripsi: "Pendidikan tenaga medis profesional terakreditasi didukung Rumah Sakit Pendidikan Utama mandiri.",
    prodiList: [
      {
        nama: "Pendidikan Dokter",
        jenjang: "S1",
        gelar: "S.Ked.",
        kuota: 100,
        akreditasi: "Unggul (A)",
        karir: "Dokter Klinis, Peneliti Biomedis, Akademisi Medis",
      },
      {
        nama: "Farmasi Klinis",
        jenjang: "S1",
        gelar: "S.Farm.",
        kuota: 80,
        akreditasi: "Unggul (A)",
        karir: "Apoteker Rumah Sakit, Formulasi Industri Obat, QC Farmasi",
      },
      {
        nama: "Ilmu Keperawatan",
        jenjang: "S1",
        gelar: "S.Kep.",
        kuota: 90,
        akreditasi: "Baik Sekali (B)",
        karir: "Perawat Spesialis, Tenaga Medis Internasional",
      },
    ],
  },
  {
    id: 5,
    nama: "Fakultas Ilmu Sosial & Komunikasi",
    singkatan: "FISIP",
    jenjangUtama: "S1",
    akreditasi: "Unggul (A)",
    totalMahasiswa: "3.400",
    deskripsi: "Mengembangkan kompetensi komunikasi strategis, hubungan diplomasi internasional, dan tata kelola publik.",
    prodiList: [
      {
        nama: "Ilmu Komunikasi",
        jenjang: "S1",
        gelar: "S.I.Kom.",
        kuota: 150,
        akreditasi: "Unggul (A)",
        karir: "Public Relations Lead, Media Producer, Jurnalis Senior",
      },
      {
        nama: "Hubungan Internasional",
        jenjang: "S1",
        gelar: "S.Hub.Int.",
        kuota: 90,
        akreditasi: "Unggul (A)",
        karir: "Diplomat, Analis Geopolitik, International NGO Specialist",
      },
      {
        nama: "Administrasi Publik",
        jenjang: "S1",
        gelar: "S.A.P.",
        kuota: 85,
        akreditasi: "Baik Sekali (B)",
        karir: "Analis Kebijakan Publik, Birokrat Pemerintahan, Konsultan CSR",
      },
    ],
  },
]

export function FakultasProdi() {
  const [selectedFacultyId, setSelectedFacultyId] = useState(FAKULTAS_DATA[0].id)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedJenjang, setSelectedJenjang] = useState<string>("Semua")

  const activeFaculty =
    FAKULTAS_DATA.find((f) => f.id === selectedFacultyId) || FAKULTAS_DATA[0]

  // Filter prodi inside active faculty
  const filteredProdi = useMemo(() => {
    return activeFaculty.prodiList.filter((prodi) => {
      const matchSearch =
        prodi.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prodi.karir.toLowerCase().includes(searchQuery.toLowerCase())
      const matchJenjang =
        selectedJenjang === "Semua" || prodi.jenjang === selectedJenjang
      return matchSearch && matchJenjang
    })
  }, [activeFaculty, searchQuery, selectedJenjang])

  // Count total matches across all faculties if searching
  const isSearching = searchQuery.trim().length > 0

  return (
    <section id="fakultas" className="bg-secondary/30 py-20 sm:py-28 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
              Program Studi & Fakultas
            </p>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-foreground leading-snug mb-3">
              Pilihan Disiplin Ilmu Terakreditasi Nasional
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Jelajahi kurikulum akademik modern berbasis proyek nyata dengan sertifikasi profesi internasional dan fasilitas laboratorium lengkap.
            </p>
          </div>

          <div className="w-full md:w-80">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari prodi atau karir impian..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 text-xs sm:text-sm bg-card border-border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Jenjang Filter Chips */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1" aria-label="Filter Jenjang Pendidikan">
          {["Semua", "S1", "D4", "S2"].map((jenjang) => (
            <button
              key={jenjang}
              onClick={() => setSelectedJenjang(jenjang)}
              className={cn(
                "px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors shrink-0",
                selectedJenjang === jenjang
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {jenjang === "Semua" ? "Semua Jenjang" : `Jenjang ${jenjang}`}
            </button>
          ))}
        </div>

        {/* Interactive Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Faculty Selector (Left Navigation) */}
          <div className="lg:col-span-4 space-y-2" role="tablist" aria-label="Daftar Fakultas">
            {FAKULTAS_DATA.map((faculty) => {
              const isSelected = selectedFacultyId === faculty.id
              return (
                <button
                  key={faculty.id}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedFacultyId(faculty.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-xl text-left transition-all border",
                    isSelected
                      ? "bg-card border-primary ring-1 ring-primary/40 shadow-xs"
                      : "bg-card/70 border-border text-foreground hover:bg-card hover:border-primary/30"
                  )}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span
                      className={cn(
                        "h-9 w-11 rounded-lg flex items-center justify-center text-xs font-bold font-mono tracking-tight shrink-0",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                      )}
                    >
                      {faculty.singkatan}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate text-foreground">
                        {faculty.nama}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {faculty.prodiList.length} Program Studi • {faculty.jenjangUtama}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 shrink-0 transition-transform",
                      isSelected ? "text-primary translate-x-1" : "text-muted-foreground/40"
                    )}
                  />
                </button>
              )
            })}
          </div>

          {/* Prodi List & Detail Pane (Right Content) */}
          <div className="lg:col-span-8 bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-xs">
            {/* Faculty Header Summary */}
            <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-border mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-semibold uppercase text-primary">
                    {activeFaculty.singkatan} • {activeFaculty.jenjangUtama}
                  </span>
                  <span className="text-muted-foreground/40">•</span>
                  <Badge variant="outline" className="text-[11px] font-semibold border-primary/20 text-primary">
                    Akreditasi {activeFaculty.akreditasi}
                  </Badge>
                </div>
                <h3 className="font-serif font-bold text-2xl text-foreground">
                  {activeFaculty.nama}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
                  {activeFaculty.deskripsi}
                </p>
              </div>

              <div className="flex items-center gap-3 bg-secondary/50 border border-border px-3.5 py-2 rounded-lg">
                <Users className="h-4 w-4 text-primary" />
                <div className="text-right">
                  <p className="text-xs font-bold text-foreground font-mono">{activeFaculty.totalMahasiswa}</p>
                  <p className="text-[10px] text-muted-foreground">Mahasiswa Aktif</p>
                </div>
              </div>
            </div>

            {/* Program Studi Cards Grid */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Daftar Pilihan Program Studi ({filteredProdi.length})
                </p>
                <span className="text-xs text-muted-foreground">
                  Kuota Gelombang II Aktif
                </span>
              </div>

              {filteredProdi.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-border rounded-xl">
                  <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-semibold text-foreground">
                    Tidak ditemukan program studi yang cocok
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Coba ubah kata kunci pencarian atau ganti filter jenjang pendidikan di atas.
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {filteredProdi.map((prodi) => (
                    <div
                      key={prodi.nama}
                      className="p-4 rounded-xl border border-border bg-card hover:border-primary/40 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <Badge variant="secondary" className="text-[10px] font-semibold font-mono">
                            {prodi.jenjang} • {prodi.gelar}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] font-medium border-emerald-600/30 text-emerald-700">
                            {prodi.akreditasi}
                          </Badge>
                        </div>
                        <h4 className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">
                          {prodi.nama}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                          <span className="font-medium text-foreground/80">Prospek: </span>
                          {prodi.karir}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-4 border-t border-border/80 text-xs">
                        <span className="text-[11px] text-muted-foreground font-mono">
                          Daya Tampung: {prodi.kuota} Kursi
                        </span>
                        <Link href="/auth/register">
                          <Button size="sm" variant="ghost" className="h-7 text-xs font-semibold gap-1 text-primary hover:text-primary p-0">
                            Pilih Prodi
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Action Footer */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-border bg-secondary/30 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-6 sm:p-8 rounded-b-2xl">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Belum yakin program studi mana yang paling sesuai dengan minat Anda?
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Gunakan instrumen konsultasi penjurusan berbasis nilai rapor dan bakat minat.
                </p>
              </div>
              <Link href="/rekomendasi" className="shrink-0">
                <Button size="sm" className="font-semibold text-xs gap-2">
                  <Award className="h-3.5 w-3.5" />
                  Uji Rekomendasi Jurusan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
