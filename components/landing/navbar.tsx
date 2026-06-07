"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { GraduationCap, Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { label: "Profil Kampus", href: "#profil" },
  { label: "Fakultas & Prodi", href: "#fakultas" },
  { label: "Biaya Kuliah", href: "#biaya" },
  { label: "Jalur Masuk", href: "#jalur" },
  { label: "Jadwal PMB", href: "#jadwal" },
  { label: "Berita", href: "#berita" },
  { label: "FAQ", href: "#faq" },
  { label: "Chatbot", href: "/chatbot" },
  { label: "Rekomendasi", href: "/rekomendasi" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Admin", href: "/admin" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-slate-200/60 border-b border-slate-100"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="#" className="flex items-center gap-2.5 shrink-0 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/30 transition-transform duration-200 group-hover:scale-105">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <p
                className={cn(
                  "text-sm font-bold leading-tight font-serif tracking-tight",
                  scrolled ? "text-foreground" : "text-white"
                )}
              >
                Universitas Nusantara
              </p>
              <p
                className={cn(
                  "text-[10px] font-medium leading-tight uppercase tracking-widest",
                  scrolled ? "text-muted-foreground" : "text-white/60"
                )}
              >
                PMB 2025/2026
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                  scrolled
                    ? "text-slate-600 hover:text-primary hover:bg-primary/8"
                    : "text-white/85 hover:text-white hover:bg-white/12"
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/6281234567890?text=Halo%2C%20saya%20ingin%20info%20PMB"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex"
            >
              <Button
                size="sm"
                variant="ghost"
                className={cn(
                  "text-sm font-medium rounded-lg transition-all duration-200",
                  scrolled
                    ? "text-slate-600 hover:text-primary hover:bg-primary/8 border border-slate-200 hover:border-primary/30"
                    : "border border-white/30 text-white hover:bg-white/12"
                )}
              >
                Hubungi Kami
              </Button>
            </a>
            <Link href="/auth/register">
              <Button
                size="sm"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold rounded-lg shadow-md shadow-amber-400/30 hover:shadow-amber-400/50 transition-all duration-200 hover:-translate-y-0.5"
              >
                Daftar Sekarang
              </Button>
            </Link>
            <button
              className="lg:hidden p-2 rounded-lg transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className={cn("h-5 w-5", scrolled ? "text-foreground" : "text-white")} />
              ) : (
                <Menu className={cn("h-5 w-5", scrolled ? "text-foreground" : "text-white")} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-slate-100 px-4 pb-5 shadow-xl">
          <nav className="flex flex-col gap-1 pt-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-primary hover:bg-primary/8 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-slate-100">
              <a
                href="https://wa.me/6281234567890?text=Halo%2C%20saya%20ingin%20info%20PMB"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" className="w-full rounded-lg border-slate-200">
                  Hubungi via WhatsApp
                </Button>
              </a>
              <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                <Button size="sm" className="w-full bg-accent text-accent-foreground font-semibold rounded-lg">
                  Daftar Sekarang
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
