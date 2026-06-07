"use client"

import { ArrowRight, Play, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Link from "next/link"

const STATS = [
  { value: "25.000+", label: "Mahasiswa Aktif" },
  { value: "8", label: "Fakultas" },
  { value: "45+", label: "Program Studi" },
  { value: "92%", label: "Lulusan Terserap Kerja" },
]

export function Hero() {
  const [tourModal, setTourModal] = useState(false)

  return (
    <section
      id="beranda"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: "url('/images/hero-campus.png')" }}
        role="img"
        aria-label="Kampus Universitas Nusantara"
      />

      {/* Layered overlays for premium depth */}
      <div className="absolute inset-0 bg-[oklch(0.14_0.07_255)]/75" />
      <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.12_0.08_255)]/90 via-[oklch(0.14_0.07_255)]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.10_0.05_255)]/70 via-transparent to-transparent" />

      {/* Decorative mesh orbs */}
      <div className="absolute top-1/4 right-1/3 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

      {/* Announcement Banner */}
      <div className="absolute top-20 inset-x-0 flex justify-center px-4 animate-fade-in-up">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 shadow-lg">
          <Sparkles className="h-3.5 w-3.5 text-accent shrink-0" />
          <span className="text-white/90 text-xs font-semibold">
            Pendaftaran PMB 2025/2026 Telah Dibuka —{" "}
            <span className="text-accent">Batas Akhir 31 Agustus 2025</span>
          </span>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-20 pb-16">
        <div className="max-w-2xl">
          {/* Label */}
          <p className="text-accent text-xs font-bold uppercase tracking-[0.25em] mb-4 animate-fade-in-up">
            Penerimaan Mahasiswa Baru 2025/2026
          </p>

          {/* Heading */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.75rem] font-bold text-white leading-[1.1] text-balance mb-5 animate-fade-in-up animation-delay-200">
            Wujudkan Impianmu{" "}
            <br className="hidden sm:block" />
            Bersama{" "}
            <span
              style={{
                background: "linear-gradient(90deg, oklch(0.76 0.155 70), oklch(0.88 0.13 60))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Universitas Nusantara
            </span>
          </h1>

          {/* Description */}
          <p className="text-white/75 text-lg leading-relaxed mb-8 max-w-xl animate-fade-in-up animation-delay-400">
            Bergabunglah dengan lebih dari 25.000 mahasiswa aktif di 8 fakultas pilihan. Raih prestasi akademik terbaik dengan fasilitas modern dan dosen berpengalaman.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 mb-12 animate-fade-in-up animation-delay-600">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold gap-2 rounded-xl shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:-translate-y-0.5 transition-all duration-200"
              >
                Daftar Sekarang <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <button
              onClick={() => setTourModal(true)}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl border border-white/25 text-white text-sm font-semibold hover:bg-white/12 hover:border-white/40 transition-all duration-200 backdrop-blur-sm"
            >
              <span className="flex items-center justify-center h-7 w-7 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                <Play className="h-3 w-3 text-white fill-white ml-0.5" />
              </span>
              Virtual Tour Kampus
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 animate-fade-in-up animation-delay-600">
            {STATS.map((stat, i) => (
              <div key={stat.label} className="text-center">
                <p
                  className="font-serif font-bold text-2xl sm:text-3xl"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.76 0.155 70), oklch(0.92 0.12 60))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {stat.value}
                </p>
                <p className="text-white/60 text-xs font-medium mt-0.5 tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 inset-x-0 flex justify-center">
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-8 bg-gradient-to-b from-white/0 via-white/40 to-white/0 rounded-full" />
          <p className="text-white/40 text-[10px] uppercase tracking-widest font-medium">Gulir ke bawah</p>
        </div>
      </div>

      {/* Virtual Tour Modal */}
      {tourModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setTourModal(false)}
        >
          <div
            className="relative bg-card rounded-2xl overflow-hidden w-full max-w-3xl shadow-2xl border border-border animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-serif font-semibold text-foreground">Virtual Tour Kampus</h3>
              <button
                onClick={() => setTourModal(false)}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>
            <div className="relative aspect-video bg-secondary">
              <img
                src="/images/virtual-tour.png"
                alt="Virtual Tour Kampus Universitas Nusantara"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/60 backdrop-blur-sm rounded-xl px-6 py-4 text-center">
                  <p className="text-white font-semibold font-serif mb-1">Virtual Tour 360°</p>
                  <p className="text-white/70 text-sm">Fitur virtual tour interaktif segera hadir</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
