"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Mail, MessageSquare, Send, Eye, Trash2, Plus, Loader2, RefreshCw } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"

interface Pengumuman {
  id: string
  judul: string
  konten: string
  tanggal: string
  kategori: string
  status: "published" | "scheduled" | "draft"
}

interface BroadcastLog {
  id: string
  jenis: "email" | "whatsapp"
  penerima: string
  subjek?: string
  pesan: string
  status: string
  created_at: string
}

const TARGET_GROUPS = [
  "Semua Pendaftar",
  "Pendaftar Gelombang 1",
  "Pendaftar Gelombang 2",
  "Verifikasi Lolos",
  "Pembayaran Terverifikasi",
]

const STATUS_LABELS: Record<string, string> = {
  published: "Dipublikasikan",
  scheduled: "Terjadwal",
  draft: "Draf",
}

export default function AnnouncementsPage() {
  const { user } = useAuth()
  const [pengumuman, setPengumuman] = useState<Pengumuman[]>([])
  const [emailLog, setEmailLog] = useState<BroadcastLog[]>([])
  const [waLog, setWaLog] = useState<BroadcastLog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Form state - pengumuman
  const [pJudul, setPJudul] = useState("")
  const [pKonten, setPKonten] = useState("")
  const [pJadwal, setPJadwal] = useState("")
  const [pKategori, setPKategori] = useState("")
  const [pengumumanOpen, setPengumumanOpen] = useState(false)
  const [viewPengumuman, setViewPengumuman] = useState<Pengumuman | null>(null)

  // Form state - email
  const [eSubjek, setESubjek] = useState("")
  const [eKonten, setEKonten] = useState("")
  const [eTargets, setETargets] = useState<string[]>([])
  const [emailOpen, setEmailOpen] = useState(false)

  // Form state - whatsapp
  const [wPesan, setWPesan] = useState("")
  const [wTargets, setWTargets] = useState<string[]>([])
  const [waOpen, setWaOpen] = useState(false)

  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null)
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  // ─── Fetch Data ───────────────────────────────────────────
  const fetchData = async () => {
    try {
      const [annRes, logRes] = await Promise.all([
        supabase
          .from("announcements")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("broadcast_logs")
          .select("*")
          .order("created_at", { ascending: false }),
      ])

      if (annRes.data) {
        setPengumuman(
          annRes.data.map((a) => ({
            id: a.id,
            judul: a.judul,
            konten: a.konten,
            tanggal: new Date(a.created_at).toISOString().slice(0, 10),
            kategori: a.kategori || "umum",
            status: a.status,
          }))
        )
      }

      if (logRes.data) {
        setEmailLog(logRes.data.filter((l) => l.jenis === "email"))
        setWaLog(logRes.data.filter((l) => l.jenis === "whatsapp"))
      }
    } catch (err) {
      console.error("Error fetching announcements:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    // Realtime subscriptions
    const annChannel = supabase
      .channel("realtime-announcements")
      .on("postgres_changes", { event: "*", schema: "public", table: "announcements" }, fetchData)
      .subscribe()

    const logChannel = supabase
      .channel("realtime-broadcast-logs")
      .on("postgres_changes", { event: "*", schema: "public", table: "broadcast_logs" }, fetchData)
      .subscribe()

    return () => {
      annChannel.unsubscribe()
      logChannel.unsubscribe()
    }
  }, [])

  // ─── Handlers ─────────────────────────────────────────────
  const handleCreatePengumuman = async (publish: boolean) => {
    if (!pJudul.trim() || !pKonten.trim()) return
    setIsSaving(true)
    try {
      const status = publish ? "published" : pJadwal ? "scheduled" : "draft"
      const { error } = await supabase.from("announcements").insert({
        judul: pJudul,
        konten: pKonten,
        kategori: pKategori || "umum",
        status,
        jadwal_publikasi: pJadwal || null,
        created_by: user?.id || null,
      })
      if (error) throw error
      setPJudul(""); setPKonten(""); setPJadwal(""); setPKategori("")
      setPengumumanOpen(false)
      showToast(publish ? "Pengumuman berhasil dipublikasikan" : "Pengumuman disimpan sebagai draf")
    } catch (err: any) {
      showToast("Gagal menyimpan: " + err.message, "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeletePengumuman = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pengumuman ini?")) return
    const { error } = await supabase.from("announcements").delete().eq("id", id)
    if (error) showToast("Gagal menghapus: " + error.message, "error")
    else showToast("Pengumuman dihapus")
  }

  const handleSendEmail = async (draft: boolean) => {
    if (!eSubjek.trim() || !eKonten.trim() || eTargets.length === 0) return
    setIsSaving(true)
    try {
      const { error } = await supabase.from("broadcast_logs").insert({
        jenis: "email",
        penerima: eTargets.join(", "),
        subjek: eSubjek,
        pesan: eKonten,
        status: draft ? "draft" : "sent",
        created_by: user?.id || null,
      })
      if (error) throw error
      setESubjek(""); setEKonten(""); setETargets([])
      setEmailOpen(false)
      showToast(draft ? "Email disimpan sebagai draf" : `Email berhasil dikirim ke ${eTargets.join(", ")}`)
    } catch (err: any) {
      showToast("Gagal mengirim: " + err.message, "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSendWA = async (draft: boolean) => {
    if (!wPesan.trim() || wTargets.length === 0) return
    setIsSaving(true)
    try {
      const { error } = await supabase.from("broadcast_logs").insert({
        jenis: "whatsapp",
        penerima: wTargets.join(", "),
        pesan: wPesan,
        status: draft ? "draft" : "sent",
        created_by: user?.id || null,
      })
      if (error) throw error
      setWPesan(""); setWTargets([])
      setWaOpen(false)
      showToast(draft ? "Pesan WA disimpan sebagai draf" : `WhatsApp berhasil dikirim`)
    } catch (err: any) {
      showToast("Gagal mengirim: " + err.message, "error")
    } finally {
      setIsSaving(false)
    }
  }

  const toggleTarget = (list: string[], setList: (v: string[]) => void, target: string) => {
    setList(list.includes(target) ? list.filter((t) => t !== target) : [...list, target])
  }

  const allLogs: (BroadcastLog & { jenis: "email" | "whatsapp" })[] = [...emailLog, ...waLog].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">Memuat data pengumuman...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 rounded-lg px-5 py-3 text-white shadow-lg transition-all ${
          toast.type === "success" ? "bg-green-600" : "bg-red-600"
        }`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pengumuman &amp; Broadcast</h1>
          <p className="text-sm text-muted-foreground">Kelola pengumuman, broadcast email/WhatsApp, dan notifikasi</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="pengumuman" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pengumuman">Pengumuman ({pengumuman.length})</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="notifikasi">Log Notifikasi</TabsTrigger>
        </TabsList>

        {/* Pengumuman Tab */}
        <TabsContent value="pengumuman" className="space-y-4">
          <div className="flex justify-between items-center">
            <CardDescription>Kelola pengumuman untuk pendaftar — realtime dari database</CardDescription>
            <Dialog open={pengumumanOpen} onOpenChange={setPengumumanOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2"><Plus className="h-4 w-4" />Buat Pengumuman</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader><DialogTitle>Buat Pengumuman Baru</DialogTitle></DialogHeader>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                  <div>
                    <Label>Judul Pengumuman <span className="text-red-500">*</span></Label>
                    <Input placeholder="Masukkan judul pengumuman" value={pJudul} onChange={(e) => setPJudul(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label>Konten <span className="text-red-500">*</span></Label>
                    <Textarea placeholder="Masukkan konten pengumuman..." rows={5} value={pKonten} onChange={(e) => setPKonten(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label>Jadwal Publikasi (opsional)</Label>
                    <Input type="datetime-local" value={pJadwal} onChange={(e) => setPJadwal(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label>Kategori</Label>
                    <Select value={pKategori} onValueChange={setPKategori}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hasil">Hasil Seleksi</SelectItem>
                        <SelectItem value="jadwal">Jadwal Ujian</SelectItem>
                        <SelectItem value="pengingat">Pengingat</SelectItem>
                        <SelectItem value="umum">Umum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" variant="outline" disabled={!pJudul.trim() || !pKonten.trim() || isSaving} onClick={() => handleCreatePengumuman(false)}>
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Simpan Draf
                    </Button>
                    <Button className="flex-1" disabled={!pJudul.trim() || !pKonten.trim() || isSaving} onClick={() => handleCreatePengumuman(true)}>
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Publikasikan Sekarang
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="pt-6">
              {pengumuman.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-sm">Belum ada pengumuman. Buat pengumuman pertama!</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Judul</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pengumuman.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{p.judul}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-xs">{p.konten}</div>
                          </div>
                        </TableCell>
                        <TableCell>{p.tanggal}</TableCell>
                        <TableCell><span className="text-sm capitalize">{p.kategori || "-"}</span></TableCell>
                        <TableCell>
                          <Badge className={
                            p.status === "published" ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : p.status === "draft" ? "bg-gray-100 text-gray-800 hover:bg-gray-100"
                              : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                          }>
                            {STATUS_LABELS[p.status] || p.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setViewPengumuman(p)}><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeletePengumuman(p.id)}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Tab */}
        <TabsContent value="email" className="space-y-4">
          <div className="flex justify-between items-center">
            <CardDescription>Broadcast email ke pendaftar</CardDescription>
            <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2"><Mail className="h-4 w-4" />Kirim Email</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader><DialogTitle>Broadcast Email</DialogTitle></DialogHeader>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                  <div>
                    <Label>Tujuan Pengiriman <span className="text-red-500">*</span></Label>
                    <div className="space-y-2 border rounded p-3 mt-1 max-h-40 overflow-y-auto">
                      {TARGET_GROUPS.map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <Checkbox id={`email-${item}`} checked={eTargets.includes(item)} onCheckedChange={() => toggleTarget(eTargets, setETargets, item)} />
                          <label htmlFor={`email-${item}`} className="text-sm cursor-pointer">{item}</label>
                        </div>
                      ))}
                    </div>
                    {eTargets.length > 0 && <p className="text-xs text-primary mt-1">Dipilih: {eTargets.join(", ")}</p>}
                  </div>
                  <div>
                    <Label>Subjek Email <span className="text-red-500">*</span></Label>
                    <Input placeholder="Masukkan subjek email" value={eSubjek} onChange={(e) => setESubjek(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label>Konten Email <span className="text-red-500">*</span></Label>
                    <Textarea placeholder="Masukkan konten email..." rows={5} value={eKonten} onChange={(e) => setEKonten(e.target.value)} className="mt-1" />
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" variant="outline" disabled={!eSubjek.trim() || !eKonten.trim() || eTargets.length === 0 || isSaving} onClick={() => handleSendEmail(true)}>Simpan Draf</Button>
                    <Button className="flex-1 gap-2" disabled={!eSubjek.trim() || !eKonten.trim() || eTargets.length === 0 || isSaving} onClick={() => handleSendEmail(false)}>
                      <Send className="h-4 w-4" />Kirim Sekarang
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Card>
            <CardContent className="pt-6">
              {emailLog.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">Belum ada log email</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Penerima</TableHead>
                      <TableHead>Subjek</TableHead>
                      <TableHead>Tanggal Kirim</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emailLog.map((e) => (
                      <TableRow key={e.id}>
                        <TableCell className="font-medium">{e.penerima}</TableCell>
                        <TableCell>{e.subjek}</TableCell>
                        <TableCell>{new Date(e.created_at).toLocaleDateString("id-ID")}</TableCell>
                        <TableCell>
                          <Badge className={e.status === "sent" ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-gray-100 text-gray-800 hover:bg-gray-100"}>
                            {e.status === "sent" ? "Terkirim" : "Draf"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* WhatsApp Tab */}
        <TabsContent value="whatsapp" className="space-y-4">
          <div className="flex justify-between items-center">
            <CardDescription>Broadcast WhatsApp ke pendaftar</CardDescription>
            <Dialog open={waOpen} onOpenChange={setWaOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2"><MessageSquare className="h-4 w-4" />Kirim WhatsApp</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader><DialogTitle>Broadcast WhatsApp</DialogTitle></DialogHeader>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                  <div>
                    <Label>Tujuan Pengiriman <span className="text-red-500">*</span></Label>
                    <div className="space-y-2 border rounded p-3 mt-1 max-h-40 overflow-y-auto">
                      {TARGET_GROUPS.map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <Checkbox id={`wa-${item}`} checked={wTargets.includes(item)} onCheckedChange={() => toggleTarget(wTargets, setWTargets, item)} />
                          <label htmlFor={`wa-${item}`} className="text-sm cursor-pointer">{item}</label>
                        </div>
                      ))}
                    </div>
                    {wTargets.length > 0 && <p className="text-xs text-primary mt-1">Dipilih: {wTargets.join(", ")}</p>}
                  </div>
                  <div>
                    <Label>Pesan WhatsApp <span className="text-red-500">*</span></Label>
                    <Textarea placeholder="Masukkan pesan WhatsApp..." rows={4} value={wPesan} onChange={(e) => setWPesan(e.target.value)} className="mt-1" />
                    <p className="text-xs text-muted-foreground mt-1">{wPesan.length} karakter</p>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" variant="outline" disabled={!wPesan.trim() || wTargets.length === 0 || isSaving} onClick={() => handleSendWA(true)}>Simpan Draf</Button>
                    <Button className="flex-1 gap-2" disabled={!wPesan.trim() || wTargets.length === 0 || isSaving} onClick={() => handleSendWA(false)}>
                      <Send className="h-4 w-4" />Kirim Sekarang
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Card>
            <CardContent className="pt-6">
              {waLog.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">Belum ada log WhatsApp</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Penerima</TableHead>
                      <TableHead>Pesan</TableHead>
                      <TableHead>Tanggal Kirim</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {waLog.map((w) => (
                      <TableRow key={w.id}>
                        <TableCell className="font-medium">{w.penerima}</TableCell>
                        <TableCell className="max-w-sm truncate">{w.pesan}</TableCell>
                        <TableCell>{new Date(w.created_at).toLocaleDateString("id-ID")}</TableCell>
                        <TableCell>
                          <Badge className={w.status === "sent" ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-gray-100 text-gray-800 hover:bg-gray-100"}>
                            {w.status === "sent" ? "Terkirim" : "Draf"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Log Notifikasi Tab */}
        <TabsContent value="notifikasi" className="space-y-4">
          <CardDescription>Log semua notifikasi yang telah dikirim — realtime</CardDescription>
          <Card>
            <CardContent className="pt-6">
              {allLogs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">Belum ada log notifikasi</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Jenis</TableHead>
                      <TableHead>Penerima / Pesan</TableHead>
                      <TableHead>Waktu</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allLogs.map((n) => (
                      <TableRow key={n.id}>
                        <TableCell>
                          <Badge className={n.jenis === "email" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" : "bg-green-100 text-green-800 hover:bg-green-100"}>
                            {n.jenis === "email" ? "Email" : "WhatsApp"}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-sm truncate text-sm">
                          {n.jenis === "email" ? `${n.subjek} → ${n.penerima}` : n.pesan.slice(0, 60) + (n.pesan.length > 60 ? "..." : "")}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(n.created_at).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell>
                          <Badge className={n.status === "sent" ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-gray-100 text-gray-800 hover:bg-gray-100"}>
                            {n.status === "sent" ? "Terkirim" : "Draf"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Pengumuman Dialog */}
      <Dialog open={!!viewPengumuman} onOpenChange={() => setViewPengumuman(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{viewPengumuman?.judul}</DialogTitle></DialogHeader>
          {viewPengumuman && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge className={viewPengumuman.status === "published" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                  {STATUS_LABELS[viewPengumuman.status]}
                </Badge>
                <span className="text-sm text-muted-foreground">{viewPengumuman.tanggal}</span>
              </div>
              <p className="text-sm leading-relaxed">{viewPengumuman.konten}</p>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setViewPengumuman(null)}>Tutup</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
