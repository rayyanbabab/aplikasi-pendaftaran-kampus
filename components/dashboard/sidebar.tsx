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
  MessageSquare,
  BarChart3,
  Shield,
} from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRegistration } from "@/contexts/registration-context"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/biodata", label: "Biodata", icon: User },
  { href: "/dashboard/berkas", label: "Upload Berkas", icon: FileText },
  { href: "/dashboard/kuliah", label: "Pilihan Kuliah", icon: School },
  { href: "/dashboard/pembayaran", label: "Pembayaran", icon: CreditCard },
  { href: "/dashboard/status", label: "Status Pendaftaran", icon: ClipboardCheck },
  { href: "/dashboard/cetak", label: "Cetak Dokumen", icon: Printer },
  { href: "/chatbot", label: "Chatbot PMB", icon: MessageSquare },
  { href: "/rekomendasi", label: "Rekomendasi Prodi", icon: BarChart3 },
  { href: "/admin", label: "Admin Panel", icon: Shield },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { completionPercentage, registration } = useRegistration()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    window.location.href = "/"
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 border-b px-4 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <GraduationCap className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h1 className="text-sm font-bold leading-tight">Portal PMB</h1>
          <p className="text-xs text-muted-foreground">Calon Mahasiswa</p>
        </div>
      </div>

      {/* User Info */}
      <div className="border-b px-4 py-4">
        <div className="rounded-lg bg-secondary/50 p-3">
          <p className="text-sm font-medium">{user?.name || "Calon Mahasiswa"}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
          {registration?.noPendaftaran && (
            <p className="mt-1 text-xs font-mono text-primary">
              No: {registration.noPendaftaran}
            </p>
          )}
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress Pendaftaran</span>
            <span className="font-medium">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="mt-2 h-2" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="h-4 w-4" />}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="border-t p-4">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
          Keluar
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between border-b bg-card px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="font-bold">Portal PMB</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-14 z-50 h-[calc(100vh-3.5rem)] w-72 transform border-r bg-card transition-transform lg:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <SidebarContent />
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-72 border-r bg-card lg:flex lg:flex-col">
        <SidebarContent />
      </aside>
    </>
  )
}
