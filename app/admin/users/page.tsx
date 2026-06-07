"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Loader2, UserCog, ArrowLeft, ShieldAlert, RefreshCw, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Profile {
  id: string
  name: string
  email: string
  phone: string | null
  role: string
  is_verified: boolean
  created_at: string
}

const ROLE_BADGES: Record<string, { label: string; className: string }> = {
  super_admin: { label: "Super Admin", className: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20" },
  admin_pmb: { label: "Admin PMB", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20" },
  verifikator: { label: "Verifikator", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" },
  keuangan: { label: "Keuangan", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20" },
  penguji: { label: "Penguji", className: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20" },
  calon_mahasiswa: { label: "Calon Mhs", className: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20" },
}

export default function UserManagement() {
  const { user } = useAuth()
  const router = useRouter()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null)
  const [newRole, setNewRole] = useState("")
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null)

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }

  const fetchProfiles = async () => {
    setFetchError(null)
    setIsLoading(true)

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, phone, role, is_verified, created_at")
        .order("created_at", { ascending: false })

      if (error) {
        const msg = error.message || error.code || "Gagal mengambil data"
        console.error("[Users] Error fetching profiles:", msg, error)

        if (error.code === "PGRST301" || error.message?.includes("permission")) {
          setFetchError(
            "Akses ditolak oleh RLS Supabase. Pastikan sudah menjalankan fix_dashboard_rls.sql di Supabase SQL Editor dan app_metadata role sudah diset."
          )
        } else {
          setFetchError(`Gagal memuat data: ${msg}`)
        }
        return
      }

      setProfiles(data || [])
    } catch (err: any) {
      const msg = err?.message || "Terjadi kesalahan tidak terduga"
      console.error("[Users] Exception:", msg, err)
      setFetchError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user && user.role !== "super_admin") {
      router.replace("/admin")
      return
    }
    if (user) fetchProfiles()
  }, [user, router])

  const handleUpdateRole = async (profile: Profile, roleToSet: string) => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: roleToSet })
        .eq("id", profile.id)

      if (error) throw error

      setProfiles((prev) => prev.map((p) => p.id === profile.id ? { ...p, role: roleToSet } : p))
      showToast(`Berhasil mengubah role ${profile.name} menjadi ${ROLE_BADGES[roleToSet]?.label || roleToSet}`)
      setEditingProfile(null)
    } catch (err: any) {
      showToast("Gagal mengubah role: " + (err.message || "Unknown error"), "error")
    } finally {
      setSaving(false)
    }
  }

  const filtered = profiles.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.phone && p.phone.includes(searchTerm))
  )

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">Memuat data pengguna...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 lg:p-8 animate-in fade-in duration-500">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 rounded-lg px-5 py-3 text-white shadow-lg transition-all ${
            toast.type === "success" ? "bg-green-600 animate-in fade-in slide-in-from-bottom-5" : "bg-red-600 animate-in fade-in slide-in-from-bottom-5"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Manajemen Pengguna
            </h1>
            <p className="text-sm text-muted-foreground">
              Kelola hak akses role &amp; credentials staff pendaftaran
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={fetchProfiles} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Error State */}
      {fetchError && (
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="flex items-start gap-3 pt-6">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-red-700 dark:text-red-400">
                Gagal Memuat Data
              </p>
              <p className="text-xs mt-1 leading-relaxed text-red-700 dark:text-red-400">{fetchError}</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={fetchProfiles}>
                Coba Lagi
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Warning */}
      {!fetchError && (
        <Card className="bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-400">
          <CardContent className="flex items-start gap-3 pt-6">
            <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider">Peringatan Keamanan Utama</p>
              <p className="text-xs mt-1 leading-relaxed">
                Mengubah level hak akses pengguna akan segera mengubah permissions mereka secara real-time. Pastikan Anda menunjuk orang yang tepat.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Table */}
      {!fetchError && (
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pengguna Aktif</CardTitle>
            <CardDescription>
              Menampilkan {profiles.length} akun dari database
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari nama, email, atau no. telepon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full"
              />
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>No. Telepon</TableHead>
                    <TableHead>Hak Akses (Role)</TableHead>
                    <TableHead>Tgl Terdaftar</TableHead>
                    <TableHead className="w-24 text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        {profiles.length === 0
                          ? "Belum ada pengguna terdaftar di database."
                          : "Tidak ada pengguna yang cocok dengan kriteria pencarian."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((p) => {
                      const badge = ROLE_BADGES[p.role] || { label: p.role, className: "bg-slate-100 text-slate-800" }
                      return (
                        <TableRow key={p.id}>
                          <TableCell className="font-semibold">{p.name}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{p.email}</TableCell>
                          <TableCell className="text-xs">{p.phone || "-"}</TableCell>
                          <TableCell>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${badge.className}`}>
                              {badge.label}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(p.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingProfile(p)
                                setNewRole(p.role)
                              }}
                              title="Edit Role Pengguna"
                            >
                              <UserCog className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Role Dialog */}
      <Dialog open={!!editingProfile} onOpenChange={(open) => !open && setEditingProfile(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ubah Hak Akses Pengguna</DialogTitle>
            <DialogDescription>Ubah perizinan sistem untuk staff Anda secara instan</DialogDescription>
          </DialogHeader>
          {editingProfile && (
            <div className="space-y-4 pt-2">
              <div className="bg-secondary/30 p-3 rounded-lg text-sm space-y-1.5">
                <p><strong>Nama:</strong> {editingProfile.name}</p>
                <p><strong>Email:</strong> {editingProfile.email}</p>
                <p className="flex items-center gap-1.5">
                  <strong>Role Saat Ini:</strong>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${ROLE_BADGES[editingProfile.role]?.className}`}>
                    {ROLE_BADGES[editingProfile.role]?.label || editingProfile.role}
                  </span>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role-select">Pilih Role Baru</Label>
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger id="role-select">
                    <SelectValue placeholder="Pilih level role..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Administrator (Akses Penuh)</SelectItem>
                    <SelectItem value="admin_pmb">Administrator PMB (Manajemen PMB)</SelectItem>
                    <SelectItem value="verifikator">Verifikator Berkas (Review Berkas)</SelectItem>
                    <SelectItem value="keuangan">Staf Administrasi Keuangan (Validasi Biaya)</SelectItem>
                    <SelectItem value="penguji">Tim Penguji (Input Nilai &amp; Ujian)</SelectItem>
                    <SelectItem value="calon_mahasiswa">Calon Mahasiswa Baru (Portal Mhs)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setEditingProfile(null)} disabled={saving}>
                  Batal
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => handleUpdateRole(editingProfile, newRole)}
                  disabled={saving || newRole === editingProfile.role}
                >
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Simpan Perubahan
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
