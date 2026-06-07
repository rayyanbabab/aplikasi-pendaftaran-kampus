"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Users,
  Settings,
  FileText,
  Bell,
  BarChart4,
  CheckCircle2,
  Crown,
  MessageSquare,
  TrendingUp,
  LayoutDashboard,
  LogOut,
  User as UserIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CampusSwitcher } from "@/components/campus-switcher"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"

const ROLE_BADGES: Record<string, { label: string; className: string }> = {
  super_admin: { label: "Super Admin", className: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20" },
  admin_pmb: { label: "Admin PMB", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20" },
  verifikator: { label: "Verifikator", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" },
  keuangan: { label: "Keuangan", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20" },
  penguji: { label: "Penguji", className: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20" },
  calon_mahasiswa: { label: "Calon Mhs", className: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20" },
}

const ADMIN_MENU = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: BarChart3,
    roles: ["super_admin", "admin_pmb", "verifikator", "keuangan", "penguji"],
  },
  {
    label: "User Management",
    href: "/admin/users",
    icon: Users,
    roles: ["super_admin"],
  },
  {
    label: "Executive Dashboard",
    href: "/admin/executive",
    icon: Crown,
    roles: ["super_admin", "admin_pmb"],
  },
  {
    label: "PMB Settings",
    href: "/admin/pmb",
    icon: Settings,
    roles: ["super_admin", "admin_pmb"],
  },
  {
    label: "Pendaftar (PMB)",
    href: "/admin/registrants",
    icon: Users,
    roles: ["super_admin", "admin_pmb", "verifikator", "keuangan"],
  },
  {
    label: "Exam Management",
    href: "/admin/exam",
    icon: BarChart4,
    roles: ["super_admin", "admin_pmb", "penguji"],
  },
  {
    label: "Check-in Ujian",
    href: "/admin/check-in",
    icon: CheckCircle2,
    roles: ["super_admin", "admin_pmb", "verifikator"],
  },
  {
    label: "Announcements",
    href: "/admin/announcements",
    icon: Bell,
    roles: ["super_admin", "admin_pmb"],
  },
  {
    label: "Reports",
    href: "/admin/reports",
    icon: FileText,
    roles: ["super_admin", "admin_pmb", "keuangan"],
  },
  {
    label: "Chatbot PMB",
    href: "/admin/chatbot",
    icon: MessageSquare,
    roles: ["super_admin", "admin_pmb", "verifikator", "keuangan", "penguji"],
  },
  {
    label: "Rekomendasi Prodi",
    href: "/admin/rekomendasi",
    icon: TrendingUp,
    roles: ["super_admin", "admin_pmb", "verifikator", "keuangan", "penguji"],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const userRole = user?.role || "calon_mahasiswa"
  const filteredMenu = ADMIN_MENU.filter((item) => item.roles.includes(userRole))
  const roleInfo = ROLE_BADGES[userRole] || { label: "Staff", className: "bg-slate-500/10 text-slate-600 border border-slate-500/20" }

  return (
    <>
      {/* Mobile Navigation */}
      <nav className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between border-b border-border/40 bg-background px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <span className="font-bold">Admin Portal</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider", roleInfo.className)}>
            {roleInfo.label}
          </span>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={logout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-72 flex-col justify-between border-r border-border/40 bg-background p-6 lg:flex">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            <div>
              <div className="font-bold tracking-tight">PMB Admin</div>
              <div className="text-xs text-muted-foreground">Campus Registration</div>
            </div>
          </div>

          <div className="pb-4 border-b border-border/40">
            <CampusSwitcher />
          </div>

          <nav className="space-y-1.5 max-h-[calc(100vh-270px)] overflow-y-auto pr-1">
            {filteredMenu.map((item) => {
              const Icon = item.icon
              const isActive = item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:translate-x-0.5",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile footer section */}
        <div className="pt-4 border-t border-border/40">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
              <UserIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-foreground">{user?.name || "Administrator"}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider", roleInfo.className)}>
                  {roleInfo.label}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="w-full justify-center gap-2 text-destructive hover:bg-destructive/5 hover:text-destructive border-border/60 hover:border-destructive/30"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </Button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation (only fits up to 5 items) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-border/40 bg-background lg:hidden">
        {filteredMenu.slice(0, 5).map((item) => {
          const Icon = item.icon
          const isActive = item.href === "/admin"
            ? pathname === "/admin"
            : pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2 text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="truncate max-w-[70px]">{item.label.split(" ")[0]}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
