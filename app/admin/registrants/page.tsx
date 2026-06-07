"use client"

import { useState, useEffect } from "react"
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
import { Search, Eye, Check, X, Loader2, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { PRODI_LIST } from "@/lib/mock-data"
import { useAuth } from "@/contexts/auth-context"

type RegistrantStatus = "pending" | "approved" | "rejected"

interface Registrant {
  id: string
  noPendaftaran: string
  nama: string
  email: string
  prodi: string
  jalur: string
  status: string
  berkas: RegistrantStatus
  pembayaran: RegistrantStatus
  createdAt: string
  alasanTolak?: string
  raw?: any
}

const getStatusBadge = (status: RegistrantStatus) => {
  switch (status) {
    case "approved":
      return <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50 hover:bg-emerald-100">Disetujui</Badge>
    case "rejected":
      return <Badge className="bg-rose-100 text-rose-800 border border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50 hover:bg-rose-100">Ditolak</Badge>
    case "pending":
      return <Badge className="bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50 hover:bg-amber-100">Menunggu</Badge>
  }
}

export default function RegistrantManagement() {
  const { user } = useAuth()
  const [registrants, setRegistrants] = useState<Registrant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedRegistrant, setSelectedRegistrant] = useState<Registrant | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectTarget, setRejectTarget] = useState<{ id: string; type: "berkas" | "pembayaran" } | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null)

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

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
        if (reg.status === "berkas_diterima" || reg.status === "lulus_seleksi" || reg.status === "daftar_ulang") {
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
          prodi: prodiName,
          jalur: jalur,
          status: reg.status,
          berkas: berkasStatus,
          pembayaran: pembayaranStatus,
          createdAt: new Date(reg.created_at).toLocaleDateString("id-ID"),
          alasanTolak: reg.status_history?.find((h: any) => h.status === "berkas_ditolak")?.note?.replace("Berkas ditolak: ", "") || reg.pembayaran?.rejectionReason,
          raw: reg,
        }
      })

      // Sort by creation date
      mapped.sort((a, b) => new Date(b.raw.created_at).getTime() - new Date(a.raw.created_at).getTime())

      setRegistrants(mapped)
    } catch (err) {
      console.error("Exception fetching registrants:", err)
    } finally {
      setIsLoading(false)
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

  const filtered = registrants.filter((r) => {
    const matchesSearch =
      r.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.noPendaftaran.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === "all" || r.berkas === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleApproveBerkas = async (id: string) => {
    const target = registrants.find((r) => r.id === id)
    if (!target) return

    try {
      const { error } = await supabase
        .from("registrations")
        .update({
          status: "berkas_diterima",
          status_history: [
            ...target.raw.status_history,
            {
              status: "berkas_diterima",
              timestamp: new Date().toISOString(),
              note: "Berkas persyaratan disetujui oleh verifikator",
            },
          ],
        })
        .eq("id", id)

      if (error) throw error
      showToast("Berkas berhasil diterima")
    } catch (err: any) {
      showToast("Gagal menerima berkas: " + err.message, "error")
    }
  }

  const handleRejectBerkas = (id: string) => {
    setRejectTarget({ id, type: "berkas" })
    setRejectReason("")
    setRejectDialogOpen(true)
  }

  const handleApprovePayment = async (id: string) => {
    const target = registrants.find((r) => r.id === id)
    if (!target) return

    try {
      const updatedPayment = {
        ...target.raw.pembayaran,
        status: "verified",
        verifiedAt: new Date().toISOString(),
      }

      const { error } = await supabase
        .from("registrations")
        .update({
          pembayaran: updatedPayment,
          status: "lulus_seleksi",
          status_history: [
            ...target.raw.status_history,
            {
              status: "lulus_seleksi",
              timestamp: new Date().toISOString(),
              note: "Pembayaran terverifikasi. Pendaftaran dinyatakan Lulus Seleksi Administrasi",
            },
          ],
        })
        .eq("id", id)

      if (error) throw error
      showToast("Pembayaran berhasil diverifikasi")
    } catch (err: any) {
      showToast("Gagal memverifikasi pembayaran: " + err.message, "error")
    }
  }

  const handleRejectPayment = (id: string) => {
    setRejectTarget({ id, type: "pembayaran" })
    setRejectReason("")
    setRejectDialogOpen(true)
  }

  const handleConfirmReject = async () => {
    if (!rejectTarget) return
    const target = registrants.find((r) => r.id === rejectTarget.id)
    if (!target) return

    try {
      if (rejectTarget.type === "berkas") {
        const { error } = await supabase
          .from("registrations")
          .update({
            status: "berkas_ditolak",
            status_history: [
              ...target.raw.status_history,
              {
                status: "berkas_ditolak",
                timestamp: new Date().toISOString(),
                note: `Berkas ditolak: ${rejectReason}`,
              },
            ],
          })
          .eq("id", rejectTarget.id)

        if (error) throw error
        showToast("Berkas berhasil ditolak", "error")
      } else {
        const updatedPayment = {
          ...target.raw.pembayaran,
          status: "failed",
          rejectionReason: rejectReason,
        }

        const { error } = await supabase
          .from("registrations")
          .update({
            pembayaran: updatedPayment,
            status_history: [
              ...target.raw.status_history,
              {
                status: target.raw.status,
                timestamp: new Date().toISOString(),
                note: `Pembayaran ditolak: ${rejectReason}`,
              },
            ],
          })
          .eq("id", rejectTarget.id)

        if (error) throw error
        showToast("Pembayaran berhasil ditolak", "error")
      }
    } catch (err: any) {
      showToast("Gagal menolak: " + err.message, "error")
    }

    setRejectDialogOpen(false)
    setRejectTarget(null)
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filtered.map((r) => r.id))
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">Menghubungkan ke database...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
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

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manajemen Pendaftar</h1>
        <p className="text-sm text-muted-foreground">Kelola data pendaftar, verifikasi berkas dan pembayaran</p>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Daftar Pendaftar</TabsTrigger>
          <TabsTrigger value="verify-docs">
            Verifikasi Berkas
            {registrants.filter((r) => r.berkas === "pending" && r.status === "menunggu_verifikasi").length > 0 && (
              <Badge className="ml-2 bg-amber-500 text-white text-xs">
                {registrants.filter((r) => r.berkas === "pending" && r.status === "menunggu_verifikasi").length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="verify-payment">
            Verifikasi Pembayaran
            {registrants.filter((r) => r.pembayaran === "pending" && r.raw?.pembayaran?.buktiTransfer).length > 0 && (
              <Badge className="ml-2 bg-amber-500 text-white text-xs">
                {registrants.filter((r) => r.pembayaran === "pending" && r.raw?.pembayaran?.buktiTransfer).length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* List Tab */}
        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Semua Pendaftar</CardTitle>
              <CardDescription>Kelola dan filter data pendaftar secara real-time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Cari nama, email, atau no. pendaftaran..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-full"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="pending">Menunggu</SelectItem>
                    <SelectItem value="approved">Diterima</SelectItem>
                    <SelectItem value="rejected">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedIds.length > 0 && (
                <div className="flex items-center gap-3 rounded-lg bg-primary/10 px-4 py-2">
                  <span className="text-sm font-medium text-primary">{selectedIds.length} dipilih</span>
                  <Button size="sm" variant="outline" onClick={() => setSelectedIds([])}>
                    Batal Pilih
                  </Button>
                </div>
              )}

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedIds.length === filtered.length && filtered.length > 0}
                          onCheckedChange={toggleSelectAll}
                        />
                      </TableHead>
                      <TableHead>No. Pendaftaran</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Program Studi</TableHead>
                      <TableHead>Berkas</TableHead>
                      <TableHead>Pembayaran</TableHead>
                      <TableHead className="w-20">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                          Tidak ada data pendaftar yang cocok
                        </TableCell>
                      </TableRow>
                    ) : (
                      filtered.map((r) => (
                        <TableRow key={r.id} className={selectedIds.includes(r.id) ? "bg-secondary/30" : ""}>
                          <TableCell>
                            <Checkbox
                              checked={selectedIds.includes(r.id)}
                              onCheckedChange={() => toggleSelect(r.id)}
                            />
                          </TableCell>
                          <TableCell className="font-semibold">{r.noPendaftaran}</TableCell>
                          <TableCell>{r.nama}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{r.email}</TableCell>
                          <TableCell>{r.prodi}</TableCell>
                          <TableCell>{getStatusBadge(r.berkas)}</TableCell>
                          <TableCell>{getStatusBadge(r.pembayaran)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
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

        {/* Verify Docs Tab */}
        <TabsContent value="verify-docs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Verifikasi Berkas</CardTitle>
              <CardDescription>Periksa dan verifikasi dokumen calon mahasiswa baru</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No. Pendaftaran</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Program Studi</TableHead>
                      <TableHead>Jalur</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrants.filter((r) => r.berkas === "pending" && r.status === "menunggu_verifikasi").length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                          Tidak ada berkas yang menunggu verifikasi
                        </TableCell>
                      </TableRow>
                    ) : (
                      registrants
                        .filter((r) => r.berkas === "pending" && r.status === "menunggu_verifikasi")
                        .map((r) => (
                          <TableRow key={r.id}>
                            <TableCell className="font-semibold">{r.noPendaftaran}</TableCell>
                            <TableCell>{r.nama}</TableCell>
                            <TableCell>{r.prodi}</TableCell>
                            <TableCell>{r.jalur}</TableCell>
                            <TableCell>
                              <Badge className="bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-100">
                                Menunggu Verifikasi
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedRegistrant(r)
                                    setDetailOpen(true)
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-1.5" />
                                  Detail Berkas
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                                  onClick={() => handleRejectBerkas(r.id)}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Tolak
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                  onClick={() => handleApproveBerkas(r.id)}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Terima
                                </Button>
                              </div>
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

        {/* Verify Payment Tab */}
        <TabsContent value="verify-payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Verifikasi Pembayaran</CardTitle>
              <CardDescription>Periksa bukti transfer biaya pendaftaran yang diunggah mahasiswa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No. Pendaftaran</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Program Studi</TableHead>
                      <TableHead>Jumlah SPP/Registrasi</TableHead>
                      <TableHead>Metode</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrants.filter((r) => r.pembayaran === "pending" && r.raw?.pembayaran?.buktiTransfer).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                          Tidak ada bukti pembayaran baru yang diunggah
                        </TableCell>
                      </TableRow>
                    ) : (
                      registrants
                        .filter((r) => r.pembayaran === "pending" && r.raw?.pembayaran?.buktiTransfer)
                        .map((r) => (
                          <TableRow key={r.id}>
                            <TableCell className="font-semibold">{r.noPendaftaran}</TableCell>
                            <TableCell>{r.nama}</TableCell>
                            <TableCell>{r.prodi}</TableCell>
                            <TableCell className="font-medium">
                              {r.raw?.pembayaran?.amount ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(r.raw.pembayaran.amount) : "Rp 350.000"}
                            </TableCell>
                            <TableCell className="uppercase">{r.raw?.pembayaran?.method?.replace("_", " ")}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedRegistrant(r)
                                    setDetailOpen(true)
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Cek Bukti
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                                  onClick={() => handleRejectPayment(r.id)}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Tolak
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                  onClick={() => handleApprovePayment(r.id)}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Verifikasi
                                </Button>
                              </div>
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
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Profil & Berkas Pendaftar</DialogTitle>
            <DialogDescription>Informasi form PMB lengkap dengan data Supabase</DialogDescription>
          </DialogHeader>
          {selectedRegistrant && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 bg-secondary/20 p-4 rounded-xl">
                <div>
                  <Label className="text-xs text-muted-foreground">No. Pendaftaran</Label>
                  <div className="font-semibold text-sm">{selectedRegistrant.noPendaftaran}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Nama Lengkap</Label>
                  <div className="font-semibold text-sm">{selectedRegistrant.nama}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <div className="text-xs text-primary">{selectedRegistrant.email}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">No. HP/Telepon</Label>
                  <div className="text-xs">{selectedRegistrant.raw?.profiles?.phone || selectedRegistrant.raw?.data_pribadi?.noHp || "-"}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Pilihan Program Studi</Label>
                  <div className="font-semibold text-sm text-primary">{selectedRegistrant.prodi}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Jalur Masuk</Label>
                  <div className="font-semibold text-sm uppercase">{selectedRegistrant.jalur}</div>
                </div>
              </div>

              {/* Bukti Pembayaran */}
              {selectedRegistrant.raw?.pembayaran?.buktiTransfer && (
                <div className="border border-border p-4 rounded-xl space-y-3">
                  <h3 className="text-sm font-bold text-foreground">Bukti Transaksi Pendaftaran</h3>
                  <div className="flex items-center gap-3 bg-muted/30 p-2.5 rounded-lg border">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10 text-primary">
                      📁
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{selectedRegistrant.raw.pembayaran.buktiTransfer.name || "bukti-transfer.png"}</p>
                      <p className="text-[10px] text-muted-foreground">Diunggah: {selectedRegistrant.raw.pembayaran.paidAt ? new Date(selectedRegistrant.raw.pembayaran.paidAt).toLocaleString("id-ID") : "-"}</p>
                    </div>
                    <a
                      href={selectedRegistrant.raw.pembayaran.buktiTransfer.previewUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      Buka Dokumen
                    </a>
                  </div>
                </div>
              )}

              {/* Uploaded Documents List */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-foreground">Kelengkapan Berkas Persyaratan</h3>
                <div className="space-y-2">
                  {(selectedRegistrant.raw?.documents || []).map((doc: any) => (
                    <div key={doc.type} className="flex items-center justify-between border border-border p-3 rounded-lg text-sm">
                      <div>
                        <span className="font-medium text-xs">{doc.label}</span>
                        {doc.required && <span className="text-red-500 ml-1">*</span>}
                      </div>
                      <div>
                        {doc.file ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded border border-emerald-500/10 font-medium">Tersedia</span>
                            <a
                              href={doc.file.previewUrl || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline font-semibold"
                            >
                              Lihat File
                            </a>
                          </div>
                        ) : (
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded font-medium">Kosong</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons in dialog */}
              <div className="border-t border-border pt-4 flex gap-3">
                {selectedRegistrant.berkas === "pending" && selectedRegistrant.status === "menunggu_verifikasi" && (
                  <>
                    <Button
                      variant="outline"
                      className="flex-1 gap-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                      onClick={() => {
                        setDetailOpen(false)
                        handleRejectBerkas(selectedRegistrant.id)
                      }}
                    >
                      <X className="h-4 w-4" />
                      Tolak Dokumen
                    </Button>
                    <Button
                      className="flex-1 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => {
                        handleApproveBerkas(selectedRegistrant.id)
                        setSelectedRegistrant((prev) =>
                          prev ? { ...prev, berkas: "approved", status: "Berkas Diterima" } : null
                        )
                      }}
                    >
                      <Check className="h-4 w-4" />
                      Approve Dokumen
                    </Button>
                  </>
                )}

                {selectedRegistrant.pembayaran === "pending" && selectedRegistrant.raw?.pembayaran?.buktiTransfer && (
                  <>
                    <Button
                      variant="outline"
                      className="flex-1 gap-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                      onClick={() => {
                        setDetailOpen(false)
                        handleRejectPayment(selectedRegistrant.id)
                      }}
                    >
                      <X className="h-4 w-4" />
                      Tolak Bukti Transfer
                    </Button>
                    <Button
                      className="flex-1 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => {
                        handleApprovePayment(selectedRegistrant.id)
                        setSelectedRegistrant((prev) =>
                          prev ? { ...prev, pembayaran: "approved", status: "lulus_seleksi" } : null
                        )
                      }}
                    >
                      <Check className="h-4 w-4" />
                      Verifikasi Transfer
                    </Button>
                  </>
                )}

                {selectedRegistrant.berkas === "approved" && selectedRegistrant.pembayaran === "approved" && (
                  <div className="flex-1 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/50 p-3 text-center text-xs text-emerald-700 dark:text-emerald-400 font-bold">
                    ✓ Verifikasi Berkas & Pembayaran Lengkap
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Reason Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Berikan Catatan Penolakan {rejectTarget?.type === "berkas" ? "Berkas" : "Pembayaran"}
            </DialogTitle>
            <DialogDescription>
              Tuliskan alasan penolakan secara spesifik agar calon mahasiswa dapat merevisi di dashboard mereka.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-bold">Catatan Verifikasi</Label>
              <Textarea
                placeholder="Contoh: Bukti transfer terpotong atau pas foto bukan latar merah..."
                rows={4}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setRejectDialogOpen(false)}>
                Batal
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                disabled={!rejectReason.trim()}
                onClick={handleConfirmReject}
              >
                Kirim Alasan Penolakan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
