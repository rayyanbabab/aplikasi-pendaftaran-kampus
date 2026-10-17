"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Eye,
  Check,
  X,
  Loader2,
  FileText,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Users,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { PRODI_LIST } from "@/lib/mock-data"
import { useAuth } from "@/contexts/auth-context"

type RegistrantStatus = "pending" | "approved" | "rejected"

interface Registrant {
  id: string
  noPendaftaran: string
  nama: string
  email: string
  phone: string
  prodi: string
  prodiId: string
  jalur: string
  status: string
  berkas: RegistrantStatus
  pembayaran: RegistrantStatus
  createdAt: string
  alasanTolak?: string
  raw?: any
}

const QUICK_DOC_REASONS = [
  "Scan ijazah buram atau tidak terbaca",
  "KTP atau Kartu Keluarga terpotong / tidak jelas",
  "Nilai rapor belum dilegalisir kepala sekolah",
  "Pas foto tidak berlatar belakang resmi (merah/biru)",
  "Surat keterangan sehat belum disertakan",
  "Dokumen persyaratan tidak sesuai nama pendaftar",
]

const QUICK_PAYMENT_REASONS = [
  "Nominal transfer tidak sesuai tagihan registrasi",
  "Nomor referensi atau tanggal mutasi tidak terbaca",
  "Nama pemilik rekening pengirim tidak sesuai pendaftar",
  "Bukti transfer tidak memuat stempel atau validasi bank",
  "Batas waktu pembayaran tagihan telah kedaluwarsa",
  "Struk pembayaran buram atau terpotong",
]

const getStatusBadge = (status: RegistrantStatus) => {
  switch (status) {
    case "approved":
      return (
        <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-medium">
          Disetujui
        </Badge>
      )
    case "rejected":
      return (
        <Badge className="bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 font-medium">
          Ditolak
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 font-medium">
          Menunggu
        </Badge>
      )
  }
}

export default function RegistrantManagement() {
  const { user } = useAuth()
  const [registrants, setRegistrants] = useState<Registrant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("list")

  // Filters for General List
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Filters for Verifikasi Berkas
  const [docsSearch, setDocsSearch] = useState("")
  const [docsFilterProdi, setDocsFilterProdi] = useState("all")
  const [docsFilterJalur, setDocsFilterJalur] = useState("all")
  const [docsFilterStatus, setDocsFilterStatus] = useState("pending")

  // Filters for Verifikasi Pembayaran
  const [paySearch, setPaySearch] = useState("")
  const [payFilterBank, setPayFilterBank] = useState("all")
  const [payFilterStatus, setPayFilterStatus] = useState("pending")

  // Dialog & selection state
  const [selectedRegistrant, setSelectedRegistrant] = useState<Registrant | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectTarget, setRejectTarget] = useState<{ id: string; type: "berkas" | "pembayaran"; name?: string } | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null)

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Auto-route tab based on staff role
  useEffect(() => {
    if (user?.role === "verifikator") {
      setActiveTab("verify-docs")
    } else if (user?.role === "keuangan") {
      setActiveTab("verify-payment")
    }
  }, [user?.role])

  const fetchRegistrants = async () => {
    try {
      const { data, error } = await supabase
        .from("registrations")
        .select(`
          id,
          no_pendaftaran,
          status,
          data_pribadi,
          pilihan_prodi,
          pembayaran,
          documents,
          created_at,
          status_history,
          profiles:user_id (
            name,
            email,
            phone
          )
        `)

      if (error) {
        console.error("Error fetching registrations:", error)
        showToast("Gagal mengambil data registrasi", "error")
        return
      }

      const mapped: Registrant[] = (data || []).map((reg: any) => {
        const profile = reg.profiles || {}
        const prodiId = reg.pilihan_prodi?.[0]?.prodiId || ""
        const prodiName = PRODI_LIST.find((p) => p.id === prodiId)?.nama || "Belum Memilih"
        const jalur = reg.pilihan_prodi?.[0]?.jalurMasuk?.toUpperCase() || "MANDIRI"

        let berkasStatus: RegistrantStatus = "pending"
        if (["berkas_diterima", "lulus_seleksi", "daftar_ulang"].includes(reg.status)) {
          berkasStatus = "approved"
        } else if (reg.status === "berkas_ditolak") {
          berkasStatus = "rejected"
        }

        let pembayaranStatus: RegistrantStatus = "pending"
        if (reg.pembayaran?.status === "verified") {
          pembayaranStatus = "approved"
        } else if (reg.pembayaran?.status === "failed") {
          pembayaranStatus = "rejected"
        }

        return {
          id: reg.id,
          noPendaftaran: reg.no_pendaftaran || "DRAFT",
          nama: profile.name || reg.data_pribadi?.namaLengkap || "Calon Mahasiswa",
          email: profile.email || reg.data_pribadi?.email || "",
          phone: profile.phone || reg.data_pribadi?.noHp || "-",
          prodi: prodiName,
          prodiId: prodiId,
          jalur: jalur,
          status: reg.status,
          berkas: berkasStatus,
          pembayaran: pembayaranStatus,
          createdAt: new Date(reg.created_at).toLocaleDateString("id-ID"),
          alasanTolak:
            reg.status_history?.find((h: any) => h.status === "berkas_ditolak")?.note?.replace("Berkas ditolak: ", "") ||
            reg.pembayaran?.rejectionReason,
          raw: reg,
        }
      })

      // Sort newest first
      mapped.sort((a, b) => new Date(b.raw.created_at).getTime() - new Date(a.raw.created_at).getTime())
      setRegistrants(mapped)
    } catch (err) {
      console.error("Exception fetching registrants:", err)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchRegistrants()

    const channel = supabase
      .channel("realtime-registrations-management")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "registrations",
        },
        () => {
          fetchRegistrants()
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  const handleManualRefresh = () => {
    setIsRefreshing(true)
    fetchRegistrants()
  }

  // 1. Filtered General List
  const filteredList = useMemo(() => {
    return registrants.filter((r) => {
      const q = searchTerm.toLowerCase()
      const matchesSearch =
        r.nama.toLowerCase().includes(q) ||
        r.noPendaftaran.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q)

      const matchesStatus = filterStatus === "all" || r.berkas === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [registrants, searchTerm, filterStatus])

  // 2. Filtered Documents Verification List
  const filteredDocs = useMemo(() => {
    return registrants.filter((r) => {
      const q = docsSearch.toLowerCase()
      const matchesSearch =
        !q ||
        r.nama.toLowerCase().includes(q) ||
        r.noPendaftaran.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q)

      const matchesProdi = docsFilterProdi === "all" || r.prodiId === docsFilterProdi
      const matchesJalur = docsFilterJalur === "all" || r.jalur.toLowerCase() === docsFilterJalur.toLowerCase()

      let matchesStatus = true
      if (docsFilterStatus === "pending") {
        matchesStatus = r.berkas === "pending" && r.status === "menunggu_verifikasi"
      } else if (docsFilterStatus === "approved") {
        matchesStatus = r.berkas === "approved"
      } else if (docsFilterStatus === "rejected") {
        matchesStatus = r.berkas === "rejected"
      }

      return matchesSearch && matchesProdi && matchesJalur && matchesStatus
    })
  }, [registrants, docsSearch, docsFilterProdi, docsFilterJalur, docsFilterStatus])

  // 3. Filtered Payments Verification List
  const filteredPayments = useMemo(() => {
    return registrants.filter((r) => {
      const q = paySearch.toLowerCase()
      const matchesSearch =
        !q ||
        r.nama.toLowerCase().includes(q) ||
        r.noPendaftaran.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q)

      const bankCode = (r.raw?.pembayaran?.bankCode || r.raw?.pembayaran?.method || "").toUpperCase()
      const matchesBank = payFilterBank === "all" || bankCode.includes(payFilterBank.toUpperCase())

      let matchesStatus = true
      if (payFilterStatus === "pending") {
        matchesStatus = r.pembayaran === "pending" && Boolean(r.raw?.pembayaran?.buktiTransfer)
      } else if (payFilterStatus === "approved") {
        matchesStatus = r.pembayaran === "approved"
      } else if (payFilterStatus === "rejected") {
        matchesStatus = r.pembayaran === "rejected"
      } else if (payFilterStatus === "unpaid") {
        matchesStatus = !r.raw?.pembayaran || r.raw?.pembayaran?.status === "unpaid"
      }

      return matchesSearch && matchesBank && matchesStatus
    })
  }, [registrants, paySearch, payFilterBank, payFilterStatus])

  // Approval / Rejection Handlers
  const handleApproveBerkas = async (id: string) => {
    const target = registrants.find((r) => r.id === id)
    if (!target) return

    try {
      const existingHistory = target.raw?.status_history || []
      const { error } = await supabase
        .from("registrations")
        .update({
          status: "berkas_diterima",
          status_history: [
            ...existingHistory,
            {
              status: "berkas_diterima",
              timestamp: new Date().toISOString(),
              note: "Berkas persyaratan resmi disetujui oleh tim verifikator.",
            },
          ],
        })
        .eq("id", id)

      if (error) throw error
      showToast("Berkas persyaratan berhasil disetujui")
      fetchRegistrants()
    } catch (err: any) {
      showToast("Gagal menyetujui berkas: " + err.message, "error")
    }
  }

  const handleOpenRejectBerkas = (r: Registrant) => {
    setRejectTarget({ id: r.id, type: "berkas", name: r.nama })
    setRejectReason("")
    setRejectDialogOpen(true)
  }

  const handleApprovePayment = async (id: string) => {
    const target = registrants.find((r) => r.id === id)
    if (!target) return

    try {
      const updatedPayment = {
        ...target.raw?.pembayaran,
        status: "verified",
        verifiedAt: new Date().toISOString(),
      }
      const existingHistory = target.raw?.status_history || []

      const { error } = await supabase
        .from("registrations")
        .update({
          pembayaran: updatedPayment,
          status: "lulus_seleksi",
          status_history: [
            ...existingHistory,
            {
              status: "lulus_seleksi",
              timestamp: new Date().toISOString(),
              note: "Pembayaran terverifikasi sah. Calon mahasiswa dinyatakan Lulus Seleksi Administrasi.",
            },
          ],
        })
        .eq("id", id)

      if (error) throw error
      showToast("Pembayaran berhasil diverifikasi sah")
      fetchRegistrants()
    } catch (err: any) {
      showToast("Gagal memverifikasi pembayaran: " + err.message, "error")
    }
  }

  const handleOpenRejectPayment = (r: Registrant) => {
    setRejectTarget({ id: r.id, type: "pembayaran", name: r.nama })
    setRejectReason("")
    setRejectDialogOpen(true)
  }

  const handleConfirmReject = async () => {
    if (!rejectTarget) return
    const target = registrants.find((r) => r.id === rejectTarget.id)
    if (!target) return

    try {
      const existingHistory = target.raw?.status_history || []

      if (rejectTarget.type === "berkas") {
        const { error } = await supabase
          .from("registrations")
          .update({
            status: "berkas_ditolak",
            status_history: [
              ...existingHistory,
              {
                status: "berkas_ditolak",
                timestamp: new Date().toISOString(),
                note: `Berkas ditolak: ${rejectReason}`,
              },
            ],
          })
          .eq("id", rejectTarget.id)

        if (error) throw error
        showToast("Catatan revisi berkas berhasil dikirim", "success")
      } else {
        const updatedPayment = {
          ...target.raw?.pembayaran,
          status: "failed",
          rejectionReason: rejectReason,
        }

        const { error } = await supabase
          .from("registrations")
          .update({
            pembayaran: updatedPayment,
            status_history: [
              ...existingHistory,
              {
                status: target.raw.status,
                timestamp: new Date().toISOString(),
                note: `Pembayaran ditolak: ${rejectReason}`,
              },
            ],
          })
          .eq("id", rejectTarget.id)

        if (error) throw error
        showToast("Bukti pembayaran ditolak, pendaftar diminta transfer ulang", "success")
      }
      fetchRegistrants()
    } catch (err: any) {
      showToast("Gagal menyimpan penolakan: " + err.message, "error")
    }

    setRejectDialogOpen(false)
    setRejectTarget(null)
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredList.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredList.map((r) => r.id))
    }
  }

  // Count summaries
  const countDocsPending = registrants.filter((r) => r.berkas === "pending" && r.status === "menunggu_verifikasi").length
  const countDocsApproved = registrants.filter((r) => r.berkas === "approved").length
  const countDocsRejected = registrants.filter((r) => r.berkas === "rejected").length

  const countPayPending = registrants.filter((r) => r.pembayaran === "pending" && r.raw?.pembayaran?.buktiTransfer).length
  const countPayApproved = registrants.filter((r) => r.pembayaran === "approved").length
  const totalVerifiedRevenue = registrants
    .filter((r) => r.pembayaran === "approved")
    .reduce((sum, r) => sum + (r.raw?.pembayaran?.amount || 350000), 0)

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Memuat data pendaftar...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg transition-all ${
            toast.type === "success" ? "bg-emerald-600" : "bg-rose-600"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Manajemen & Verifikasi PMB</h1>
            {user?.role && (
              <Badge variant="outline" className="text-xs uppercase tracking-wider font-mono">
                {user.role.replace("_", " ")}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Pusat validasi berkas persyaratan calon mahasiswa dan rekonsiliasi transfer biaya pendaftaran
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className="gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Segarkan Data
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-2xl bg-muted/60 p-1 rounded-xl">
          <TabsTrigger value="list" className="gap-2 text-xs sm:text-sm">
            <Users className="h-4 w-4" />
            Semua Pendaftar
          </TabsTrigger>

          <TabsTrigger value="verify-docs" className="gap-2 text-xs sm:text-sm">
            <FileText className="h-4 w-4" />
            Verifikasi Berkas
            {countDocsPending > 0 && (
              <Badge className="bg-amber-500 text-white text-[11px] px-1.5 py-0 h-4">
                {countDocsPending}
              </Badge>
            )}
          </TabsTrigger>

          <TabsTrigger value="verify-payment" className="gap-2 text-xs sm:text-sm">
            <CreditCard className="h-4 w-4" />
            Verifikasi Pembayaran
            {countPayPending > 0 && (
              <Badge className="bg-emerald-600 text-white text-[11px] px-1.5 py-0 h-4">
                {countPayPending}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ============================================================ */}
        {/* TAB 1: DAFTAR SEMUA PENDAFTAR                                */}
        {/* ============================================================ */}
        <TabsContent value="list" className="space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Database Seluruh Pendaftar PMB</CardTitle>
              <CardDescription>
                Daftar lengkap calon mahasiswa terdaftar dengan status berkas dan pembayaran real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Cari nama, email, atau no. pendaftaran..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-44 h-10">
                    <SelectValue placeholder="Status Berkas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="pending">Menunggu</SelectItem>
                    <SelectItem value="approved">Disetujui</SelectItem>
                    <SelectItem value="rejected">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedIds.length > 0 && (
                <div className="flex items-center justify-between rounded-lg bg-primary/10 px-4 py-2">
                  <span className="text-xs font-semibold text-primary">{selectedIds.length} data pendaftar dipilih</span>
                  <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])} className="text-xs h-7">
                    Batal Pilih
                  </Button>
                </div>
              )}

              {/* Table */}
              <div className="rounded-xl border border-border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow>
                      <TableHead className="w-10">
                        <Checkbox
                          checked={selectedIds.length === filteredList.length && filteredList.length > 0}
                          onCheckedChange={toggleSelectAll}
                        />
                      </TableHead>
                      <TableHead>No. Pendaftaran</TableHead>
                      <TableHead>Nama Calon Mahasiswa</TableHead>
                      <TableHead>Program Studi</TableHead>
                      <TableHead>Jalur</TableHead>
                      <TableHead>Berkas</TableHead>
                      <TableHead>Pembayaran</TableHead>
                      <TableHead className="w-16 text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredList.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                          Tidak ditemukan data pendaftar yang sesuai kriteria pencarian.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredList.map((r) => (
                        <TableRow key={r.id} className={selectedIds.includes(r.id) ? "bg-primary/5" : ""}>
                          <TableCell>
                            <Checkbox
                              checked={selectedIds.includes(r.id)}
                              onCheckedChange={() => toggleSelect(r.id)}
                            />
                          </TableCell>
                          <TableCell className="font-mono font-semibold text-xs">{r.noPendaftaran}</TableCell>
                          <TableCell>
                            <p className="font-semibold text-sm">{r.nama}</p>
                            <p className="text-xs text-muted-foreground">{r.email}</p>
                          </TableCell>
                          <TableCell className="text-xs font-medium">{r.prodi}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[10px] uppercase font-mono">
                              {r.jalur}
                            </Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(r.berkas)}</TableCell>
                          <TableCell>{getStatusBadge(r.pembayaran)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                setSelectedRegistrant(r)
                                setDetailOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 2: VERIFIKASI BERKAS (VERIFIKATOR WORKSPACE)             */}
        {/* ============================================================ */}
        <TabsContent value="verify-docs" className="space-y-5">
          {/* Metrics summary */}
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <Card className="border-border p-4 bg-amber-50/50 dark:bg-amber-950/10 border-amber-500/20">
              <div className="flex items-center justify-between text-xs text-amber-700 dark:text-amber-400 font-semibold">
                <span>Antrean Menunggu</span>
                <Clock className="h-4 w-4" />
              </div>
              <div className="text-2xl font-bold font-mono mt-2 text-amber-700 dark:text-amber-400">
                {countDocsPending}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">Perlu diperiksa segera</p>
            </Card>

            <Card className="border-border p-4 bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-500/20">
              <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                <span>Berkas Disetujui</span>
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="text-2xl font-bold font-mono mt-2 text-emerald-700 dark:text-emerald-400">
                {countDocsApproved}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">Persyaratan lengkap sah</p>
            </Card>

            <Card className="border-border p-4 bg-rose-50/50 dark:bg-rose-950/10 border-rose-500/20">
              <div className="flex items-center justify-between text-xs text-rose-700 dark:text-rose-400 font-semibold">
                <span>Perlu Revisi / Ditolak</span>
                <X className="h-4 w-4" />
              </div>
              <div className="text-2xl font-bold font-mono mt-2 text-rose-700 dark:text-rose-400">
                {countDocsRejected}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">Menunggu upload ulang</p>
            </Card>

            <Card className="border-border p-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                <span>Total Registran</span>
                <FileText className="h-4 w-4" />
              </div>
              <div className="text-2xl font-bold font-mono mt-2">{registrants.length}</div>
              <p className="text-[11px] text-muted-foreground mt-0.5">Total berkas masuk</p>
            </Card>
          </div>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle className="text-lg">Antrean Pemeriksaan Dokumen</CardTitle>
                  <CardDescription>
                    Periksa keabsahan Ijazah, KTP, Kartu Keluarga, dan Rapor calon mahasiswa
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filter controls */}
              <div className="grid gap-2.5 sm:grid-cols-4">
                <div className="relative sm:col-span-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Cari nama / no. reg..."
                    value={docsSearch}
                    onChange={(e) => setDocsSearch(e.target.value)}
                    className="pl-9 h-9 text-xs"
                  />
                </div>

                <Select value={docsFilterStatus} onValueChange={setDocsFilterStatus}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Status Verifikasi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Menunggu Verifikasi ({countDocsPending})</SelectItem>
                    <SelectItem value="approved">Sudah Disetujui ({countDocsApproved})</SelectItem>
                    <SelectItem value="rejected">Ditolak / Revisi ({countDocsRejected})</SelectItem>
                    <SelectItem value="all">Semua Status</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={docsFilterProdi} onValueChange={setDocsFilterProdi}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Pilih Program Studi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Program Studi</SelectItem>
                    {PRODI_LIST.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={docsFilterJalur} onValueChange={setDocsFilterJalur}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Pilih Jalur Masuk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Jalur Masuk</SelectItem>
                    <SelectItem value="snbp">SNBP</SelectItem>
                    <SelectItem value="snbt">SNBT</SelectItem>
                    <SelectItem value="mandiri">MANDIRI</SelectItem>
                    <SelectItem value="prestasi">PRESTASI</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <div className="rounded-xl border border-border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow>
                      <TableHead>No. Pendaftaran</TableHead>
                      <TableHead>Nama Calon Mahasiswa</TableHead>
                      <TableHead>Program Studi & Jalur</TableHead>
                      <TableHead>Kelengkapan Berkas</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi Verifikator</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                          {docsFilterStatus === "pending"
                            ? "Tidak ada berkas yang menunggu verifikasi saat ini. Seluruh antrean telah selesai diperiksa."
                            : "Tidak ditemukan data berkas yang cocok dengan filter yang dipilih."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDocs.map((r) => {
                        const docs = r.raw?.documents || []
                        const totalDocs = docs.length
                        const uploadedDocs = docs.filter((d: any) => d.file).length

                        return (
                          <TableRow key={r.id}>
                            <TableCell className="font-mono font-semibold text-xs">{r.noPendaftaran}</TableCell>
                            <TableCell>
                              <p className="font-semibold text-sm">{r.nama}</p>
                              <p className="text-xs text-muted-foreground">{r.email}</p>
                            </TableCell>
                            <TableCell>
                              <p className="text-xs font-medium">{r.prodi}</p>
                              <Badge variant="outline" className="text-[10px] mt-0.5 uppercase font-mono">
                                {r.jalur}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-xs">
                                  <span
                                    className={`inline-block h-2 w-2 rounded-full ${
                                      uploadedDocs === totalDocs && totalDocs > 0 ? "bg-emerald-500" : "bg-amber-500"
                                    }`}
                                  />
                                  <span className="font-medium text-xs">
                                    {uploadedDocs}/{totalDocs || 4} Berkas
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {docs.slice(0, 3).map((d: any) => (
                                    <span
                                      key={d.type}
                                      className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                        d.file
                                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                                          : "bg-muted text-muted-foreground border-border"
                                      }`}
                                    >
                                      {d.type.toUpperCase()}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(r.berkas)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 text-xs gap-1"
                                  onClick={() => {
                                    setSelectedRegistrant(r)
                                    setDetailOpen(true)
                                  }}
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  Periksa
                                </Button>

                                {r.berkas === "pending" && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-8 text-xs text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                                      onClick={() => handleOpenRejectBerkas(r)}
                                    >
                                      <X className="h-3.5 w-3.5 mr-1" />
                                      Tolak
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                                      onClick={() => handleApproveBerkas(r.id)}
                                    >
                                      <Check className="h-3.5 w-3.5 mr-1" />
                                      Terima
                                    </Button>
                                  </>
                                )}
                              </div>
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
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 3: VERIFIKASI PEMBAYARAN (KEUANGAN WORKSPACE)            */}
        {/* ============================================================ */}
        <TabsContent value="verify-payment" className="space-y-5">
          {/* Financial summary metrics */}
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <Card className="border-border p-4 bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-500/20">
              <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                <span>Penerimaan Terverifikasi</span>
                <CreditCard className="h-4 w-4" />
              </div>
              <div className="text-2xl font-bold font-mono mt-2 text-emerald-700 dark:text-emerald-400">
                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
                  totalVerifiedRevenue
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">Dari {countPayApproved} transaksi lunas</p>
            </Card>

            <Card className="border-border p-4 bg-amber-50/50 dark:bg-amber-950/10 border-amber-500/20">
              <div className="flex items-center justify-between text-xs text-amber-700 dark:text-amber-400 font-semibold">
                <span>Perlu Validasi Mutasi</span>
                <Clock className="h-4 w-4" />
              </div>
              <div className="text-2xl font-bold font-mono mt-2 text-amber-700 dark:text-amber-400">
                {countPayPending}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">Bukti transfer telah diunggah</p>
            </Card>

            <Card className="border-border p-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                <span>Belum Melakukan Transfer</span>
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="text-2xl font-bold font-mono mt-2">
                {registrants.filter((r) => !r.raw?.pembayaran || r.raw?.pembayaran?.status === "unpaid").length}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">Pendaftar di tahap invoice</p>
            </Card>

            <Card className="border-border p-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                <span>Biaya Tagihan PMB</span>
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="text-2xl font-bold font-mono mt-2">Rp 350.000</div>
              <p className="text-[11px] text-muted-foreground mt-0.5">Tarif registrasi reguler</p>
            </Card>
          </div>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Rekonsiliasi Pembayaran Bank</CardTitle>
              <CardDescription>
                Cocokkan bukti transfer rekening koran dengan data pendaftar sebelum mengesahkan kelulusan administrasi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filter controls */}
              <div className="grid gap-2.5 sm:grid-cols-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Cari nama / no. reg..."
                    value={paySearch}
                    onChange={(e) => setPaySearch(e.target.value)}
                    className="pl-9 h-9 text-xs"
                  />
                </div>

                <Select value={payFilterStatus} onValueChange={setPayFilterStatus}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Status Pembayaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Menunggu Validasi ({countPayPending})</SelectItem>
                    <SelectItem value="approved">Lunas & Disahkan ({countPayApproved})</SelectItem>
                    <SelectItem value="unpaid">Belum Transfer</SelectItem>
                    <SelectItem value="rejected">Ditolak / Tidak Sesuai</SelectItem>
                    <SelectItem value="all">Semua Status</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={payFilterBank} onValueChange={setPayFilterBank}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Pilih Bank / Metode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Metode & Bank</SelectItem>
                    <SelectItem value="BCA">Bank BCA</SelectItem>
                    <SelectItem value="MANDIRI">Bank Mandiri</SelectItem>
                    <SelectItem value="BNI">Bank BNI</SelectItem>
                    <SelectItem value="BRI">Bank BRI</SelectItem>
                    <SelectItem value="QRIS">QRIS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <div className="rounded-xl border border-border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow>
                      <TableHead>No. Pendaftaran</TableHead>
                      <TableHead>Calon Mahasiswa</TableHead>
                      <TableHead>Nominal Tagihan</TableHead>
                      <TableHead>Metode / Bank</TableHead>
                      <TableHead>Waktu Upload</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi Kasir / Keuangan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                          {payFilterStatus === "pending"
                            ? "Seluruh bukti transfer yang masuk telah berhasil divalidasi. Tidak ada pembayaran tertahan."
                            : "Tidak ditemukan transaksi pembayaran yang cocok dengan filter yang dipilih."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPayments.map((r) => {
                        const pay = r.raw?.pembayaran
                        const amount = pay?.amount || 350000
                        const bankName = pay?.bankCode || pay?.method?.replace("_", " ") || "TRANSFER BANK"

                        return (
                          <TableRow key={r.id}>
                            <TableCell className="font-mono font-semibold text-xs">{r.noPendaftaran}</TableCell>
                            <TableCell>
                              <p className="font-semibold text-sm">{r.nama}</p>
                              <p className="text-xs text-muted-foreground">{r.prodi}</p>
                            </TableCell>
                            <TableCell className="font-mono font-bold text-xs text-emerald-700 dark:text-emerald-400">
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                maximumFractionDigits: 0,
                              }).format(amount)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-mono text-[10px] uppercase">
                                {bankName}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {pay?.paidAt ? new Date(pay.paidAt).toLocaleDateString("id-ID") : r.createdAt}
                            </TableCell>
                            <TableCell>{getStatusBadge(r.pembayaran)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 text-xs gap-1"
                                  onClick={() => {
                                    setSelectedRegistrant(r)
                                    setDetailOpen(true)
                                  }}
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  Cek Bukti
                                </Button>

                                {r.pembayaran === "pending" && pay?.buktiTransfer && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-8 text-xs text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                                      onClick={() => handleOpenRejectPayment(r)}
                                    >
                                      <X className="h-3.5 w-3.5 mr-1" />
                                      Tolak
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                                      onClick={() => handleApprovePayment(r.id)}
                                    >
                                      <Check className="h-3.5 w-3.5 mr-1" />
                                      Validasi
                                    </Button>
                                  </>
                                )}
                              </div>
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
        </TabsContent>
      </Tabs>

      {/* ============================================================ */}
      {/* DETAIL DIALOG                                                */}
      {/* ============================================================ */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between pr-6">
              <span>Detail Pendaftar & Dokumen PMB</span>
              {selectedRegistrant && getStatusBadge(selectedRegistrant.berkas)}
            </DialogTitle>
            <DialogDescription>
              Tinjau informasi data pribadi, kelengkapan berkas fisik, dan bukti transfer pembayaran
            </DialogDescription>
          </DialogHeader>

          {selectedRegistrant && (
            <div className="space-y-6 pt-2">
              {/* Profile Overview Card */}
              <div className="grid grid-cols-2 gap-3.5 bg-muted/30 p-4 rounded-xl border border-border">
                <div>
                  <Label className="text-[11px] text-muted-foreground uppercase tracking-wider">No. Pendaftaran</Label>
                  <p className="font-mono font-bold text-sm text-primary">{selectedRegistrant.noPendaftaran}</p>
                </div>
                <div>
                  <Label className="text-[11px] text-muted-foreground uppercase tracking-wider">Nama Lengkap</Label>
                  <p className="font-semibold text-sm">{selectedRegistrant.nama}</p>
                </div>
                <div>
                  <Label className="text-[11px] text-muted-foreground uppercase tracking-wider">Email Terdaftar</Label>
                  <p className="text-xs">{selectedRegistrant.email}</p>
                </div>
                <div>
                  <Label className="text-[11px] text-muted-foreground uppercase tracking-wider">No. Handphone / WA</Label>
                  <p className="text-xs font-mono">{selectedRegistrant.phone}</p>
                </div>
                <div>
                  <Label className="text-[11px] text-muted-foreground uppercase tracking-wider">Pilihan Program Studi</Label>
                  <p className="text-xs font-semibold">{selectedRegistrant.prodi}</p>
                </div>
                <div>
                  <Label className="text-[11px] text-muted-foreground uppercase tracking-wider">Jalur Masuk</Label>
                  <p className="text-xs font-semibold uppercase">{selectedRegistrant.jalur}</p>
                </div>
              </div>

              {/* Bukti Transfer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold flex items-center gap-1.5">
                    <CreditCard className="h-4 w-4 text-primary" />
                    Status Pembayaran Registrasi
                  </h3>
                  {getStatusBadge(selectedRegistrant.pembayaran)}
                </div>

                {selectedRegistrant.raw?.pembayaran?.buktiTransfer ? (
                  <div className="border border-border p-3.5 rounded-xl bg-card space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold">
                          Nominal:{" "}
                          <span className="font-mono text-emerald-700 dark:text-emerald-400">
                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
                              selectedRegistrant.raw?.pembayaran?.amount || 350000
                            )}
                          </span>
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Bank / Metode: {selectedRegistrant.raw?.pembayaran?.bankCode || "TRANSFER BANK"}
                        </p>
                      </div>
                      <a
                        href={selectedRegistrant.raw?.pembayaran?.buktiTransfer?.previewUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
                      >
                        Buka Bukti Asli
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic bg-muted/20 p-3 rounded-lg border border-dashed">
                    Belum ada bukti pembayaran yang diunggah oleh pendaftar.
                  </p>
                )}
              </div>

              {/* Dokumen Persyaratan */}
              <div className="space-y-2.5">
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-primary" />
                  Pemeriksaan Berkas Persyaratan
                </h3>

                <div className="space-y-2">
                  {(selectedRegistrant.raw?.documents || [
                    { type: "ijazah", label: "Ijazah / Surat Keterangan Lulus", required: true },
                    { type: "ktp", label: "KTP / Kartu Keluarga", required: true },
                    { type: "rapor", label: "Scan Nilai Rapor Semester 1-5", required: true },
                    { type: "foto", label: "Pas Foto Berwarna 3x4 Resmi", required: true },
                  ]).map((doc: any) => (
                    <div
                      key={doc.type}
                      className="flex items-center justify-between border border-border p-3 rounded-xl bg-card text-xs"
                    >
                      <div>
                        <p className="font-semibold text-foreground">
                          {doc.label} {doc.required && <span className="text-rose-500">*</span>}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase">{doc.type}</p>
                      </div>

                      {doc.file ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded border border-emerald-500/20">
                            Tersedia
                          </span>
                          <a
                            href={doc.file.previewUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                          >
                            Lihat File
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      ) : (
                        <span className="text-[11px] bg-muted text-muted-foreground px-2 py-0.5 rounded border">
                          Belum Diunggah
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons in Dialog */}
              <div className="border-t border-border pt-4 flex gap-2.5">
                {selectedRegistrant.berkas === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      className="flex-1 text-xs text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                      onClick={() => {
                        setDetailOpen(false)
                        handleOpenRejectBerkas(selectedRegistrant)
                      }}
                    >
                      <X className="h-3.5 w-3.5 mr-1" />
                      Tolak / Minta Revisi Berkas
                    </Button>
                    <Button
                      className="flex-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => {
                        handleApproveBerkas(selectedRegistrant.id)
                        setDetailOpen(false)
                      }}
                    >
                      <Check className="h-3.5 w-3.5 mr-1" />
                      Setujui Semua Berkas
                    </Button>
                  </>
                )}

                {selectedRegistrant.pembayaran === "pending" && selectedRegistrant.raw?.pembayaran?.buktiTransfer && (
                  <>
                    <Button
                      variant="outline"
                      className="flex-1 text-xs text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                      onClick={() => {
                        setDetailOpen(false)
                        handleOpenRejectPayment(selectedRegistrant)
                      }}
                    >
                      <X className="h-3.5 w-3.5 mr-1" />
                      Tolak Bukti Transfer
                    </Button>
                    <Button
                      className="flex-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => {
                        handleApprovePayment(selectedRegistrant.id)
                        setDetailOpen(false)
                      }}
                    >
                      <Check className="h-3.5 w-3.5 mr-1" />
                      Sahkan Pembayaran Lunas
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ============================================================ */}
      {/* QUICK REASON REJECTION DIALOG (WITH ONE-CLICK CHIPS)          */}
      {/* ============================================================ */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Catatan Penolakan {rejectTarget?.type === "berkas" ? "Berkas Fisik" : "Bukti Pembayaran"}
            </DialogTitle>
            <DialogDescription>
              {rejectTarget?.name ? `Untuk calon mahasiswa: ${rejectTarget.name}. ` : ""}
              Pilih alasan cepat atau ketik instruksi perbaikan spesifik di bawah ini.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-1">
            {/* Quick Reason Chips */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Pilihan Alasan Cepat (1-Klik Isi):</Label>
              <div className="flex flex-wrap gap-1.5">
                {(rejectTarget?.type === "berkas" ? QUICK_DOC_REASONS : QUICK_PAYMENT_REASONS).map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setRejectReason(reason)}
                    className="text-[11px] px-2.5 py-1 rounded-md border border-border bg-secondary/40 text-foreground hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all text-left"
                  >
                    + {reason}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Textarea */}
            <div className="space-y-1.5">
              <Label htmlFor="rejectNote" className="text-xs font-semibold">
                Instruksi Perbaikan Detail
              </Label>
              <Textarea
                id="rejectNote"
                rows={3}
                placeholder="Tuliskan catatan perbaikan yang jelas agar pendaftar paham..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="text-xs"
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1 text-xs"
                onClick={() => {
                  setRejectDialogOpen(false)
                  setRejectTarget(null)
                }}
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                className="flex-1 text-xs"
                disabled={!rejectReason.trim()}
                onClick={handleConfirmReject}
              >
                Kirim Catatan Penolakan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
