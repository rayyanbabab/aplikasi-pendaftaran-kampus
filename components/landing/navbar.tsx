"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import {
  GraduationCap,
  Menu,
  X,
  LogIn,
  PhoneCall,
  Sun,
  Moon,
  Clock,
  DownloadCloud,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { label: "Profil Kampus", href: "#profil" },
  { label: "Fakultas & Prodi", href: "#fakultas" },
  { label: "Jalur Seleksi", href: "#jalur" },
  { label: "Biaya & UKT", href: "#biaya" },
  { label: "Jadwal PMB", href: "#jadwal" },
  { label: "Unduhan Resmi", href: "#unduhan" },
  { label: "FAQ", href: "#faq" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [mobileOpen])

  const toggleTheme = () => {
    const next = (resolvedTheme || theme) === "dark" ? "light" : "dark"
    setTheme(next)
  }

  return (
    <header className="sticky top-0 inset-x-0 z-50 transition-shadow duration-200">
      {/* ── Official Institutional Top Utility Bar ─────────────────── */}
      <div className="bg-secondary/80 text-muted-foreground text-[11px] border-b border-border py-1.5 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-semibold tracking-wide text-foreground">
              Kementerian Pendidikan Tinggi, Sains, dan Teknologi RI
            </span>
            <span className="hidden md:inline text-muted-foreground/40">&bull;</span>
            <span className="hidden md:inline text-muted-foreground">
              Terakreditasi Institusi Unggul (A) BAN-PT
            </span>
          </div>

          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="hidden sm:flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-primary" />
              <span>Loket Rektorat: 08.00 s.d. 16.00 WIB</span>
            </div>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors font-medium"
            >
              <PhoneCall className="h-3 w-3 text-primary" />
              <span>Hotline Admisi: (021) 555-1234</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── Main Navigation Bar ────────────────────────────────────── */}
      <div
        className={cn(
          "bg-card/95 backdrop-blur-md border-b border-border transition-colors duration-200",
          scrolled ? "shadow-xs" : ""
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* University Crest & Title */}
            <Link href="#beranda" className="flex items-center gap-3 shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-serif font-bold text-lg shadow-xs">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold font-serif leading-tight tracking-tight text-foreground whitespace-nowrap">
                  Universitas Nusantara
                </p>
                <p className="text-[11px] font-medium text-muted-foreground whitespace-nowrap">
                  Portal PMB T.A. 2025/2026
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1" aria-label="Navigasi Utama">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-2.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors whitespace-nowrap"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Actions: Theme Toggle & CTAs */}
            <div className="flex items-center gap-2">
              {/* Light/Dark Toggle Button */}
              {mounted && (
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label="Ganti mode tampilan terang atau gelap"
                  className="h-9 w-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  title={(resolvedTheme || theme) === "dark" ? "Aktifkan Mode Terang" : "Aktifkan Mode Gelap"}
                >
                  {(resolvedTheme || theme) === "dark" ? (
                    <Sun className="h-4 w-4 text-amber-400" />
                  ) : (
                    <Moon className="h-4 w-4 text-slate-700" />
                  )}
                </button>
              )}

              {/* Login Button */}
              <Link href="/auth/login" className="hidden sm:inline-flex">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs font-semibold gap-1.5 h-9 border-border text-foreground hover:bg-secondary whitespace-nowrap"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Masuk Akun
                </Button>
              </Link>

              {/* Register Button */}
              <Link href="/auth/register">
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-xs h-9 px-3.5 sm:px-4 rounded-lg shadow-xs whitespace-nowrap"
                >
                  Daftar PMB Online
                </Button>
              </Link>

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                className="xl:hidden p-2 rounded-lg text-foreground hover:bg-secondary transition-colors"
                onClick={() => setMobileOpen((v) => !v)}
                aria-expanded={mobileOpen}
                aria-label="Buka menu navigasi mobile"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Drawer ──────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          ref={mobileMenuRef}
          className="xl:hidden bg-card border-b border-border px-4 py-5 shadow-lg animate-fade-in-up"
        >
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
              <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" size="sm" className="w-full justify-center gap-2 text-xs h-9">
                  <LogIn className="h-4 w-4" />
                  Masuk Akun Pendaftaran
                </Button>
              </Link>
              <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                <Button size="sm" className="w-full bg-primary text-primary-foreground font-semibold text-xs h-9">
                  Daftar PMB Online 2025/2026
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
