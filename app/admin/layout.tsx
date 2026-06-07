"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthProvider, useAuth } from "@/contexts/auth-context"
import { CampusProvider } from "@/contexts/campus-context"
import { AdminSidebar } from "@/components/admin/sidebar"
import { Spinner } from "@/components/ui/spinner"

const ADMIN_ROLES = ["super_admin", "admin_pmb", "verifikator", "keuangan", "penguji"]

function AdminContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    if (!user) {
      router.replace("/auth/login")
      return
    }
    // Calon mahasiswa should go to their portal
    if (user.role === "calon_mahasiswa") {
      router.replace("/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user || user.role === "calon_mahasiswa") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="lg:ml-72">
        <div className="min-h-screen pt-14 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <CampusProvider>
        <AdminContent>{children}</AdminContent>
      </CampusProvider>
    </AuthProvider>
  )
}
