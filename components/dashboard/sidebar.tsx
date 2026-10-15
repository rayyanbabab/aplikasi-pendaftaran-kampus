"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  GraduationCap,
  LayoutDashboard,
  User,
  FileText,
  School,
  CreditCard,
  ClipboardCheck,
  Printer,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Compass,
  Sun,
  Moon,
  Home,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { useAuth } from "@/contexts/auth-context"
import { useRegistration } from "@/contexts/registration-context"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Ringkasan Portal", icon: LayoutDashboard },
  { href: "/dashboard/biodata", label: "Biodata Siswa", icon: User },
  { href: "/dashboard/kuliah", label: "Pilihan Program Studi", icon: School },
  { href: "/dashboard/berkas", label: "Unggah Berkas", icon: FileText },
  { href: "/dashboard/pembayaran", label: "Pembayaran Biaya", icon: CreditCard },
  { href: "/dashboard/status", label: "Status Seleksi", icon: ClipboardCheck },
  { href: "/dashboard/cetak", label: "Cetak Dokumen Resmi", icon: Printer },
  { href: "/rekomendasi", label: "Rekomendasi Jurusan", icon: Compass },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { completionPercentage, registration } = useRegistration()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close on Escape key (R-32 Accessibility)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isMobileMenuOpen])

  const handleLogout = () => {
    logout()
    window.location.href = "/"
  }

  const getStatusBadge = () => {
    const status = registration?.status || "draft"
    switch (status) {
      case "berkas_diterima":
      case "lulus_seleksi":
        return { label: "Terverifikasi", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800" }
      case "menunggu_verifikasi":
        return { label: "Verifikasi", icon: Clock, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800" }
      case "berkas_ditolak":
        return { label: "Perlu Revisi", icon: AlertCircle, color: "text-red-600 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800" }
      default:
        return { label: "Draft Pendaftaran", icon: Clock, color: "text-muted-foreground bg-secondary border-border" }
    }
  }

  const statusBadge = getStatusBadge()
  const StatusIcon = statusBadge.icon

  const SidebarContent = () => (
    <>
      {/* Brand & Institution Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-bold font-serif leading-tight text-foreground truncate">
              Universitas Nusantara
            </h1>
            <p className="text-[10px] text-muted-foreground font-semibold tracking-wider uppercase">
              Portal Calon Mahasiswa
            </p>
          </div>
        </Link>

        <Link href="/" title="Kembali ke Beranda Publik">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Home className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Applicant Card & Progress Bar */}
      <div className="border-b border-border p-4 bg-secondary/20 shrink-0">
        <div className="rounded-xl bg-card border border-border p-3.5 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="text-xs font-semibold text-foreground truncate">
              {registration?.dataPribadi?.namaLengkap || registration?.biodata?.namaLengkap || user?.name || "Calon Mahasiswa"}
            </p>
            <span className={cn("inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border", statusBadge.color)}>
              <StatusIcon className="h-3 w-3" />
              {statusBadge.label}
            </span>
          </div>

          <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
          
          {registration?.noPendaftaran && (
            <div className="mt-2 pt-2 border-t border-border/80 flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">No. Peserta:</span>
              <span className="font-mono font-bold text-primary">{registration.noPendaftaran}</span>
            </div>
          )}
        </div>

        <div className="mt-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">Kelengkapan Formulir</span>
            <span className="font-semibold font-mono text-foreground">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-1.5" />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-3" aria-label="Navigasi Menu Pendaftaran">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-70" />}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer Settings & Theme Switcher */}
      <div className="border-t border-border p-3 shrink-0 space-y-2 bg-secondary/10">
        {mounted && (
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-[11px] text-muted-foreground">Tema Tampilan</span>
            <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5 border border-border">
              <button
                onClick={() => setTheme("light")}
                className={cn(
                  "p-1 rounded-md text-xs transition-colors",
                  theme === "light" ? "bg-card text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
                )}
                aria-label="Mode Terang"
              >
                <Sun className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={cn(
                  "p-1 rounded-md text-xs transition-colors",
                  theme === "dark" ? "bg-card text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
                )}
                aria-label="Mode Gelap"
              >
                <Moon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-2.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          Keluar dari Akun
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-4 w-4" />
          </div>
          <span className="font-serif font-bold text-sm text-foreground">
            Portal PMB
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Buka menu navigasi"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={cn(
          "fixed left-0 top-14 z-50 h-[calc(100vh-3.5rem)] w-72 transform border-r border-border bg-card transition-transform duration-200 lg:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <SidebarContent />
        </div>
      </aside>

      {/* Desktop Persistent Sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-72 border-r border-border bg-card lg:flex lg:flex-col">
        <SidebarContent />
      </aside>
    </>
  )
}
