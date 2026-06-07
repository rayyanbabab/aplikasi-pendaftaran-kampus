"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const FAKULTAS = [
  {
    id: 1,
    nama: "Fakultas Teknik",
    singkatan: "FT",
    color: "bg-blue-500",
    prodi: ["Teknik Informatika", "Teknik Sipil", "Teknik Elektro", "Teknik Mesin", "Teknik Industri"],
    akreditasi: "A",
    mahasiswa: "4.200",
  },
  {
    id: 2,
    nama: "Fakultas Ekonomi & Bisnis",
    singkatan: "FEB",
    color: "bg-emerald-500",
    prodi: ["Manajemen", "Akuntansi", "Ekonomi Pembangunan", "Bisnis Digital"],
    akreditasi: "A",
    mahasiswa: "5.100",
  },
  {
    id: 3,
    nama: "Fakultas Hukum",
    singkatan: "FH",
    color: "bg-amber-500",
    prodi: ["Ilmu Hukum", "Hukum Bisnis"],
    akreditasi: "A",
    mahasiswa: "2.800",
  },
  {
    id: 4,
    nama: "Fakultas Ilmu Sosial & Politik",
    singkatan: "FISIP",
    color: "bg-rose-500",
    prodi: ["Ilmu Komunikasi", "Hubungan Internasional", "Administrasi Publik", "Sosiologi"],
    akreditasi: "A",
    mahasiswa: "3.600",
  },
  {
    id: 5,
    nama: "Fakultas Kedokteran",
    singkatan: "FK",
    color: "bg-red-600",
    prodi: ["Pendidikan Dokter", "Ilmu Keperawatan", "Farmasi"],
    akreditasi: "A",
    mahasiswa: "1.900",
  },
  {
    id: 6,
    nama: "Fakultas Pertanian",
    singkatan: "FAPERTA",
    color: "bg-green-600",
    prodi: ["Agroteknologi", "Agribisnis", "Teknik Pertanian"],
    akreditasi: "B",
    mahasiswa: "1.400",
  },
  {
    id: 7,
    nama: "Fakultas Keguruan & Pendidikan",
    singkatan: "FKIP",
    color: "bg-indigo-500",
    prodi: ["Pendidikan Bahasa Indonesia", "Pendidikan Matematika", "Pendidikan IPA", "PGSD"],
    akreditasi: "A",
    mahasiswa: "3.200",
  },
  {
    id: 8,
    nama: "Fakultas Sains & Teknologi",
    singkatan: "FST",
    color: "bg-cyan-600",
    prodi: ["Matematika", "Fisika", "Kimia", "Biologi", "Sistem Informasi"],
    akreditasi: "A",
    mahasiswa: "2.700",
  },
]

export function FakultasProdi() {
  const [active, setActive] = useState(FAKULTAS[0].id)
  const selected = FAKULTAS.find((f) => f.id === active)!

  return (
    <section id="fakultas" className="bg-secondary py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="section-badge mb-4 inline-flex">Akademik</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-foreground text-balance mt-4">
            Fakultas &{" "}
            <span
              style={{
                background: "linear-gradient(135deg, var(--primary), oklch(0.55 0.20 275))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Program Studi
            </span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-[0.9375rem] leading-relaxed">
            8 fakultas dengan 45+ program studi S1, S2, dan S3 yang telah terakreditasi nasional dan internasional.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Faculty List */}
          <div className="lg:col-span-1 flex flex-col gap-2">
            {FAKULTAS.map((f) => (
              <button
                key={f.id}
                onClick={() => setActive(f.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all duration-200 border",
                  active === f.id
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                    : "bg-card text-foreground border-border hover:border-primary/30 hover:bg-primary/5 hover:shadow-md"
                )}
              >
                <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center shrink-0 text-white text-xs font-bold shadow-md", f.color)}>
                  {f.singkatan.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("font-semibold text-sm truncate", active === f.id ? "text-primary-foreground" : "text-foreground")}>
                    {f.nama}
                  </p>
                  <p className={cn("text-xs mt-0.5", active === f.id ? "text-primary-foreground/70" : "text-muted-foreground")}>
                    {f.prodi.length} Program Studi
                  </p>
                </div>
                <ChevronRight className={cn("h-4 w-4 shrink-0 transition-transform", active === f.id ? "text-primary-foreground/70 translate-x-0.5" : "text-muted-foreground")} />
              </button>
            ))}
          </div>

          {/* Faculty Detail */}
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg", selected.color)}>
                {selected.singkatan}
              </div>
              <div className="flex-1">
                <h3 className="font-serif font-bold text-xl text-foreground">{selected.nama}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs font-semibold">
                    Akreditasi {selected.akreditasi}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {selected.mahasiswa} Mahasiswa
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Program Studi Tersedia
              </p>
              <div className="grid sm:grid-cols-2 gap-2">
                {selected.prodi.map((prodi) => (
                  <div
                    key={prodi}
                    className="flex items-center gap-2.5 p-3 rounded-lg bg-secondary border border-border"
                  >
                    <div className={cn("h-2 w-2 rounded-full shrink-0", selected.color)} />
                    <span className="text-sm text-foreground font-medium">{prodi}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/15">
              <p className="text-sm text-foreground">
                Tertarik dengan {selected.nama}?{" "}
                <a
                  href={`https://wa.me/6281234567890?text=Halo%2C%20saya%20ingin%20info%20${encodeURIComponent(selected.nama)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold hover:underline"
                >
                  Hubungi konselor kami
                </a>{" "}
                untuk informasi lebih lanjut.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
