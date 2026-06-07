"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, CheckCircle, Clock, ShieldAlert, Award, CreditCard, Sparkles, FileText, CheckCircle2, ChevronRight, Loader2, RefreshCw } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { PRODI_LIST } from "@/lib/mock-data"
import Link from "next/link"

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Administrator",
  admin_pmb: "Administrator PMB",
  verifikator: "Staff Verifikator Berkas",
  keuangan: "Staff Administrasi Keuangan",
  penguji: "Tim Penguji Ujian",
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [registrations, setRegistrations] = useState<any[]>([])
  const [profilesCount, setProfilesCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [timeRange, setTimeRange] = useState("month")
  const [rlsError, setRlsError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    try {
      setRlsError(null)
      const { data: regs, error: regsError } = await supabase
        .from("registrations")
        .select(`
          id,
          status,
          pilihan_prodi,
          pembayaran,
          created_at,
          profiles:user_id (
            name,
            email
          )
        `)

      if (regsError) {
        const msg = regsError.message || regsError.code || JSON.stringify(regsError)
        console.error("[Dashboard] Error registrations:", msg, regsError)
        // Deteksi error RLS / permission
        if (
          regsError.code === "PGRST301" ||
          regsError.code === "42501" ||
          msg?.toLowerCase().includes("permission") ||
          msg?.toLowerCase().includes("policy") ||
          msg?.toLowerCase().includes("rls")
        ) {
          setRlsError(
            "RLS Supabase memblokir akses data. Jalankan file fix_all_rls_final.sql di Supabase SQL Editor, lalu refresh halaman ini."
          )
        } else {
          setRlsError(`Error: ${msg}`)
        }
        setRegistrations([])
      } else {
        setRegistrations(regs || [])
        setRlsError(null)
      }

      if (user?.role === "super_admin") {
        const { count, error: countError } = await supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
        
        if (!countError && count !== null) {
          setProfilesCount(count)
        }
      }
    } catch (err: any) {
      const msg = err?.message || err?.code || JSON.stringify(err) || "Unknown error"
      console.error("[Dashboard] Error tidak terduga:", msg, err)
      setRlsError(`Error tidak terduga: ${msg}`)
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (!user) return
    fetchDashboardData()

    // Realtime channel for registrations updates
    const channel = supabase
      .channel("realtime-dashboard-stats")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "registrations",
        },
        () => {
          fetchDashboardData()
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const handleManualRefresh = () => {
    setRefreshing(true)
    fetchDashboardData()
  }

  // Common Stat Calculations
  const totalRegistrants = registrations.length
  const activeRegistrants = registrations.filter(r => r.status !== "draft")
  const totalDraft = registrations.filter(r => r.status === "draft").length
  
  const totalAccepted = registrations.filter(r => 
    ["berkas_diterima", "lulus_seleksi", "daftar_ulang"].includes(r.status)
  ).length

  const pendingVerification = registrations.filter(r => r.status === "menunggu_verifikasi").length
  const totalRejected = registrations.filter(r => r.status === "berkas_ditolak").length
  const acceptanceRate = activeRegistrants.length > 0 ? ((totalAccepted / activeRegistrants.length) * 100).toFixed(1) : "0.0"

  // Finance Stat Calculations
  const verifiedPaymentsCount = registrations.filter(r => r.pembayaran?.status === "verified").length
  const totalRevenue = registrations
    .filter(r => r.pembayaran?.status === "verified")
    .reduce((sum, r) => sum + (r.pembayaran?.amount || 350000), 0)

  const pendingPaymentsCount = registrations.filter(r => 
    r.pembayaran?.status === "pending" && r.pembayaran?.buktiTransfer
  ).length

  // Prodi Distribution for Charting
  const prodiCountMap: Record<string, number> = {}
  registrations.forEach(r => {
    const prodiId = r.pilihan_prodi?.[0]?.prodiId || "belum-memilih"
    prodiCountMap[prodiId] = (prodiCountMap[prodiId] || 0) + 1
  })

  const registrantsByProdi = Object.entries(prodiCountMap).map(([id, count]) => {
    const prodi = PRODI_LIST.find(p => p.id === id)
    return {
      name: prodi?.nama || "Belum Memilih",
      value: count,
    }
  }).sort((a, b) => b.value - a.value).slice(0, 6)

  // Wave Chart Data
  const waveData = [
    {
      name: "Gelombang 1",
      registrasi: registrations.filter(r => r.pilihan_prodi?.[0]?.gelombang?.includes("gel-1")).length,
      terima: registrations.filter(r => r.pilihan_prodi?.[0]?.gelombang?.includes("gel-1") && ["lulus_seleksi", "daftar_ulang"].includes(r.status)).length,
    },
    {
      name: "Gelombang 2",
      registrasi: registrations.filter(r => r.pilihan_prodi?.[0]?.gelombang?.includes("gel-2")).length,
      terima: registrations.filter(r => r.pilihan_prodi?.[0]?.gelombang?.includes("gel-2") && ["lulus_seleksi", "daftar_ulang"].includes(r.status)).length,
    },
    {
      name: "Gelombang 3",
      registrasi: registrations.filter(r => r.pilihan_prodi?.[0]?.gelombang?.includes("gel-3")).length,
      terima: registrations.filter(r => r.pilihan_prodi?.[0]?.gelombang?.includes("gel-3") && ["lulus_seleksi", "daftar_ulang"].includes(r.status)).length,
    },
  ]

  // Time Series Chart Data (Mocking dates based on last 7 days of real creations)
  const getDailyRegistrations = () => {
    const dayMap: Record<string, number> = {}
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(today.getDate() - i)
      const dateStr = d.toLocaleDateString("id-ID", { day: "numeric", month: "short" })
      dayMap[dateStr] = 0
    }

    registrations.forEach(r => {
      const dateStr = new Date(r.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })
      if (dayMap[dateStr] !== undefined) {
        dayMap[dateStr] += 1
      }
    })

    return Object.entries(dayMap).map(([date, total]) => ({ date, total }))
  }

  const registrantsPerDay = getDailyRegistrations()
  const COLORS = ["#3b82f6", "#10b981", "#ec4899", "#f59e0b", "#8b5cf6", "#64748b"]

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">Memuat data dashboard...</p>
        </div>
      </div>
    )
  }

  if (rlsError) {
    return (
      <div className="flex h-[80vh] items-center justify-center p-6">
        <div className="max-w-lg w-full rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center space-y-4">
          <div className="text-5xl">🔒</div>
          <h2 className="text-xl font-bold text-destructive">Akses Data Diblokir</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{rlsError}</p>
          <div className="rounded-xl bg-muted p-4 text-left text-xs font-mono text-muted-foreground space-y-1">
            <p className="font-bold text-foreground">Langkah perbaikan:</p>
            <p>1. Buka <strong>Supabase Dashboard</strong> → <strong>SQL Editor</strong></p>
            <p>2. Buka file <strong>fix_all_rls_final.sql</strong> dari proyek ini</p>
            <p>3. Paste isinya dan klik <strong>Run</strong></p>
            <p>4. Refresh halaman ini setelah selesai</p>
          </div>
          <Button onClick={handleManualRefresh} className="gap-2" disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Coba Lagi
          </Button>
        </div>
      </div>
    )
  }

  const role = user?.role || "calon_mahasiswa"

  return (
    <div className="space-y-6 p-6 lg:p-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Dashboard Utama
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Selamat datang, <span className="font-semibold text-foreground">{user?.name}</span> •{" "}
            <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-medium">
              {ROLE_LABELS[role] || role}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleManualRefresh} disabled={refreshing} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Hari Ini</SelectItem>
              <SelectItem value="month">Bulan Ini</SelectItem>
              <SelectItem value="year">Tahun Akademik</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* RENDER DASHBOARD BASED ON ROLE */}

      {/* 1. VERIFIKATOR DASHBOARD */}
      {role === "verifikator" && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-l-4 border-l-amber-500 bg-amber-50/10 dark:bg-amber-950/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Antrian Berkas Masuk</CardTitle>
                <Clock className="h-5 w-5 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{pendingVerification}</div>
                <p className="text-xs text-muted-foreground mt-1">Menunggu pemeriksaan Anda</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Telah Diverifikasi</CardTitle>
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {registrations.filter(r => ["berkas_diterima", "lulus_seleksi", "daftar_ulang"].includes(r.status)).length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Berkas persyaratan disetujui</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-rose-500 bg-rose-50/10 dark:bg-rose-950/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Berkas Ditolak</CardTitle>
                <ShieldAlert className="h-5 w-5 text-rose-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalRejected}</div>
                <p className="text-xs text-muted-foreground mt-1">Perlu direvisi oleh calon mhs</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Antrian Verifikasi Dokumen Terbaru</CardTitle>
                <CardDescription>Segera periksa kelengkapan file calon mahasiswa</CardDescription>
              </div>
              <Link href="/admin/registrants">
                <Button size="sm" variant="outline" className="gap-1.5">
                  Semua Berkas
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {registrations.filter(r => r.status === "menunggu_verifikasi").length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    🎉 Luar biasa! Semua antrian berkas sudah selesai diverifikasi.
                  </div>
                ) : (
                  registrations
                    .filter(r => r.status === "menunggu_verifikasi")
                    .slice(0, 5)
                    .map((r, index) => (
                      <div key={r.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                        <div>
                          <p className="font-semibold text-sm">{r.profiles?.name || r.data_pribadi?.namaLengkap || "Calon Mahasiswa"}</p>
                          <p className="text-xs text-muted-foreground">
                            Prodi: {PRODI_LIST.find(p => p.id === r.pilihan_prodi?.[0]?.prodiId)?.nama || "Belum Memilih"} • Jalur: {r.pilihan_prodi?.[0]?.jalurMasuk?.toUpperCase() || "MANDIRI"}
                          </p>
                        </div>
                        <Link href="/admin/registrants">
                          <Button size="sm" variant="outline">
                            Periksa Berkas
                          </Button>
                        </Link>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 2. KEUANGAN DASHBOARD */}
      {role === "keuangan" && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-l-4 border-l-emerald-600 bg-emerald-50/10 dark:bg-emerald-950/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Total Pendapatan Terverifikasi</CardTitle>
                <CreditCard className="h-5 w-5 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Dari {verifiedPaymentsCount} pendaftar</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-amber-500 bg-amber-50/10 dark:bg-amber-950/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Verifikasi Pembayaran Pending</CardTitle>
                <Clock className="h-5 w-5 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{pendingPaymentsCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Bukti transfer sudah diunggah</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500 bg-blue-50/10 dark:bg-blue-950/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Belum Melakukan Transfer</CardTitle>
                <Users className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {registrations.filter(r => !r.pembayaran || r.pembayaran.status === "unpaid").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Calon mhs di tahap tagihan</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Bukti Pembayaran Perlu Validasi</CardTitle>
                <CardDescription>Periksa kecocokan nominal bukti transfer bank</CardDescription>
              </div>
              <Link href="/admin/registrants">
                <Button size="sm" variant="outline" className="gap-1.5">
                  Verifikasi Pembayaran
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {registrations.filter(r => r.pembayaran?.status === "pending" && r.pembayaran?.buktiTransfer).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    💼 Semua bukti transfer yang masuk telah berhasil divalidasi.
                  </div>
                ) : (
                  registrations
                    .filter(r => r.pembayaran?.status === "pending" && r.pembayaran?.buktiTransfer)
                    .slice(0, 5)
                    .map((r) => (
                      <div key={r.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                        <div>
                          <p className="font-semibold text-sm">{r.profiles?.name || r.data_pribadi?.namaLengkap || "Calon Mahasiswa"}</p>
                          <p className="text-xs text-muted-foreground">
                            Nominal: {r.pembayaran?.amount ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(r.pembayaran.amount) : "Rp 350.000"} • Bank: {r.pembayaran?.bankCode || "QRIS"}
                          </p>
                        </div>
                        <Link href="/admin/registrants">
                          <Button size="sm" variant="outline" className="text-primary hover:bg-primary/5">
                            Cek Mutasi
                          </Button>
                        </Link>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 3. TIM PENGUJI / EXAMINER DASHBOARD */}
      {role === "penguji" && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-l-4 border-l-violet-600 bg-violet-50/10 dark:bg-violet-950/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold text-violet-700 dark:text-violet-400 uppercase tracking-wider">Jadwal Ujian Aktif</CardTitle>
                <Award className="h-5 w-5 text-violet-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1</div>
                <p className="text-xs text-muted-foreground mt-1">Ujian CBT Berjalan</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Peserta Terdaftar</CardTitle>
                <Users className="h-5 w-5 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {registrations.filter(r => r.status === "lulus_seleksi").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Siap mengikuti ujian seleksi</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-rose-500 bg-rose-50/10 dark:bg-rose-950/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Nilai Perlu Diinput</CardTitle>
                <Clock className="h-5 w-5 text-rose-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">0</div>
                <p className="text-xs text-muted-foreground mt-1">Peserta menunggu input nilai</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Agenda Ujian & Wawancara PMB</CardTitle>
              <CardDescription>Daftar gelombang ujian terdekat</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-xl bg-secondary/10">
                  <div>
                    <h4 className="font-bold text-sm">Ujian Masuk CBT Gelombang 2</h4>
                    <p className="text-xs text-muted-foreground">Jadwal: 10 Juli 2026 • Platform: online-cbt.ac.id</p>
                  </div>
                  <Badge className="bg-emerald-500 text-white font-semibold">Aktif</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-xl text-muted-foreground">
                  <div>
                    <h4 className="font-bold text-sm">Ujian Wawancara Khusus Kedokteran</h4>
                    <p className="text-xs">Jadwal: 12 Juli 2026 • Lokasi: R. Rapat Senat Gd. Rektorat</p>
                  </div>
                  <Badge variant="outline">Mendatang</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 4. SUPER ADMIN & ADMIN PMB DASHBOARD (FULL ANALYTICS) */}
      {(role === "super_admin" || role === "admin_pmb") && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Pendaftar</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalRegistrants}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="font-semibold text-emerald-600">+{totalDraft}</span> draft tersimpan
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Lolos Seleksi</CardTitle>
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAccepted}</div>
                <p className="text-xs text-muted-foreground mt-1">Rasio penerimaan: {acceptanceRate}%</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Antrian Berkas</CardTitle>
                <Clock className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingVerification}</div>
                <p className="text-xs text-muted-foreground mt-1">Perlu tindakan verifikator</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pendapatan Registrasi</CardTitle>
                <CreditCard className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Dari {verifiedPaymentsCount} pendaftar sah
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Access Card for Super Admin */}
          {role === "super_admin" && (
            <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Manajemen Pengguna Aplikasi (Database)
                  </CardTitle>
                  <CardDescription>
                    Kelola level hak akses (roles) untuk staff PMB, keuangan, verifikator, dan penguji.
                  </CardDescription>
                </div>
                <Link href="/admin/users">
                  <Button size="sm" className="shadow-sm font-semibold">
                    Kelola User ({profilesCount})
                  </Button>
                </Link>
              </CardHeader>
            </Card>
          )}

          {/* Charts Row */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Daily registrations */}
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Grafik Pendaftar Baru (7 Hari Terakhir)</CardTitle>
                <CardDescription>Jumlah calon mahasiswa baru yang menyelesaikan formulir</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={registrantsPerDay}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ fill: "#3b82f6", r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Pendaftar"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Prodi Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Program Studi Terpopuler</CardTitle>
                <CardDescription>Pilihan pertama program studi oleh pendaftar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72 w-full flex items-center justify-center">
                  {registrantsByProdi.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Belum ada pilihan prodi yang disimpan.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={registrantsByProdi}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {registrantsByProdi.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Wave stats */}
            <Card>
              <CardHeader>
                <CardTitle>Statistik Pendaftaran Per Gelombang</CardTitle>
                <CardDescription>Pendaftaran PMB berdasar gelombang aktif</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={waveData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="registrasi" fill="#3b82f6" name="Pendaftar" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="terima" fill="#10b981" name="Diterima Ujian" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Summaries Table */}
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Status Tahapan PMB</CardTitle>
              <CardDescription>Penyebaran status pendaftaran calon mahasiswa saat ini</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: "Draft Awal Pendaftaran", statusKey: "draft", color: "bg-slate-400" },
                  { label: "Menunggu Verifikasi Berkas persyaratan", statusKey: "menunggu_verifikasi", color: "bg-amber-500" },
                  { label: "Berkas Persyaratan Ditolak / Perlu Perbaikan", statusKey: "berkas_ditolak", color: "bg-red-500" },
                  { label: "Berkas Diterima / Menunggu Pembayaran Tagihan", statusKey: "berkas_diterima", color: "bg-blue-500" },
                  { label: "Lolos Seleksi Berkas & Ujian Administrasi", statusKey: "lulus_seleksi", color: "bg-emerald-500" },
                  { label: "Daftar Ulang Selesai", statusKey: "daftar_ulang", color: "bg-violet-500" },
                ].map((item) => {
                  const count = registrations.filter(r => r.status === item.statusKey).length
                  const pct = totalRegistrants > 0 ? ((count / totalRegistrants) * 100).toFixed(0) : "0"
                  return (
                    <div key={item.statusKey} className="space-y-2">
                      <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
                        <span>{item.label}</span>
                        <span className="font-bold">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full ${item.color}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
