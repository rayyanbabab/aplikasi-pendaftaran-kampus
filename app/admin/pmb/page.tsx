"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Edit2, Trash2, Plus, Loader2, RefreshCw } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Gelombang {
  id: string
  nama: string
  status: "Aktif" | "Selesai" | "Belum Dibuka"
  mulai: string
  selesai: string
}

interface JalurMasuk {
  id: string
  nama: string
  deskripsi: string
}

interface Kuota {
  id: string
  prodi: string
  jalur: string
  kuota: number
}

interface TahunAkademik {
  id: string
  tahun: string
  status: "Aktif" | "Selesai"
}

const PRODI_LIST = [
  "Teknik Informatika", "Manajemen Bisnis", "Teknik Sipil",
  "Kedokteran", "Hukum", "Akuntansi", "Farmasi", "Psikologi",
  "Pendidikan Matematika", "Sistem Informasi",
]

// Helper: upsert a key in pmb_settings
async function upsertSetting(key: string, value: unknown) {
  return supabase.from("pmb_settings").upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" })
}

// Helper: get all items from a key — always returns a safe array
async function getSettingItems(key: string): Promise<any[]> {
  const { data, error } = await supabase
    .from("pmb_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle()
  if (error) {
    console.warn(`[PMB] Error fetching key "${key}":`, error.message)
    return []
  }
  const raw = data?.value
  // Supabase JSONB can return the value as a plain object if it was stored wrong
  if (Array.isArray(raw)) return raw
  if (raw === null || raw === undefined) return []
  // Fallback: if stored as single object, wrap in array
  if (typeof raw === "object") return [raw]
  return []
}

export default function PMBManagement() {
  const [gelombang, setGelombang] = useState<Gelombang[]>([])
  const [jalurMasuk, setJalurMasuk] = useState<JalurMasuk[]>([])
  const [kuota, setKuota] = useState<Kuota[]>([])
  const [tahunAkademik, setTahunAkademik] = useState<TahunAkademik[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Form states - Gelombang
  const [gForm, setGForm] = useState({ nama: "", mulai: "", selesai: "", status: "Aktif" as Gelombang["status"] })
  const [gEditId, setGEditId] = useState<string | null>(null)
  const [gOpen, setGOpen] = useState(false)

  // Form states - Jalur
  const [jForm, setJForm] = useState({ nama: "", deskripsi: "" })
  const [jEditId, setJEditId] = useState<string | null>(null)
  const [jOpen, setJOpen] = useState(false)

  // Form states - Kuota
  const [kForm, setKForm] = useState({ prodi: "", jalur: "", kuota: "" })
  const [kEditId, setKEditId] = useState<string | null>(null)
  const [kOpen, setKOpen] = useState(false)

  // Form states - Tahun
  const [tForm, setTForm] = useState({ tahun: "", status: "Aktif" as TahunAkademik["status"] })
  const [tEditId, setTEditId] = useState<string | null>(null)
  const [tOpen, setTOpen] = useState(false)

  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null)
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  // ─── Fetch All ────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    try {
      const [g, j, k, t] = await Promise.all([
        getSettingItems("gelombang"),
        getSettingItems("jalur_masuk"),
        getSettingItems("kuota"),
        getSettingItems("tahun_akademik"),
      ])
      setGelombang(Array.isArray(g) ? g : [])
      setJalurMasuk(Array.isArray(j) ? j : [])
      setKuota(Array.isArray(k) ? k : [])
      setTahunAkademik(Array.isArray(t) ? t : [])
    } catch (err) {
      console.error("Error fetching PMB settings:", err)
      // Pastikan state tidak crash — set semua ke array kosong
      setGelombang([])
      setJalurMasuk([])
      setKuota([])
      setTahunAkademik([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()

    // Realtime
    const channel = supabase
      .channel("realtime-pmb-settings")
      .on("postgres_changes", { event: "*", schema: "public", table: "pmb_settings" }, fetchAll)
      .subscribe()

    return () => { channel.unsubscribe() }
  }, [fetchAll])

  // ─── Generic upsert helper ────────────────────────────────
  const saveList = async (key: string, list: unknown[]) => {
    const { error } = await upsertSetting(key, list)
    if (error) throw error
  }

  // ─── Gelombang CRUD ───────────────────────────────────────
  const handleSaveGelombang = async () => {
    if (!gForm.nama.trim() || !gForm.mulai || !gForm.selesai) return
    setIsSaving(true)
    try {
      let updated: Gelombang[]
      if (gEditId) {
        updated = gelombang.map((g) => g.id === gEditId ? { ...g, ...gForm } : g)
        showToast("Gelombang berhasil diperbarui")
      } else {
        updated = [...gelombang, { id: crypto.randomUUID(), ...gForm }]
        showToast("Gelombang berhasil ditambahkan")
      }
      await saveList("gelombang", updated)
      setGOpen(false)
      setGForm({ nama: "", mulai: "", selesai: "", status: "Aktif" })
      setGEditId(null)
    } catch (err: any) { showToast("Gagal: " + err.message, "error") }
    finally { setIsSaving(false) }
  }

  const handleDeleteGelombang = async (id: string) => {
    if (!confirm("Hapus gelombang ini?")) return
    try {
      const updated = gelombang.filter((g) => g.id !== id)
      await saveList("gelombang", updated)
      showToast("Gelombang dihapus")
    } catch (err: any) { showToast("Gagal: " + err.message, "error") }
  }

  // ─── Jalur Masuk CRUD ─────────────────────────────────────
  const handleSaveJalur = async () => {
    if (!jForm.nama.trim()) return
    setIsSaving(true)
    try {
      let updated: JalurMasuk[]
      if (jEditId) {
        updated = jalurMasuk.map((j) => j.id === jEditId ? { ...j, ...jForm } : j)
        showToast("Jalur masuk diperbarui")
      } else {
        updated = [...jalurMasuk, { id: crypto.randomUUID(), ...jForm }]
        showToast("Jalur masuk ditambahkan")
      }
      await saveList("jalur_masuk", updated)
      setJOpen(false)
      setJForm({ nama: "", deskripsi: "" })
      setJEditId(null)
    } catch (err: any) { showToast("Gagal: " + err.message, "error") }
    finally { setIsSaving(false) }
  }

  const handleDeleteJalur = async (id: string) => {
    if (!confirm("Hapus jalur masuk ini?")) return
    try {
      await saveList("jalur_masuk", jalurMasuk.filter((j) => j.id !== id))
      showToast("Jalur masuk dihapus")
    } catch (err: any) { showToast("Gagal: " + err.message, "error") }
  }

  // ─── Kuota CRUD ───────────────────────────────────────────
  const handleSaveKuota = async () => {
    if (!kForm.prodi || !kForm.jalur || !kForm.kuota) return
    setIsSaving(true)
    try {
      let updated: Kuota[]
      const newItem: Kuota = { id: kEditId || crypto.randomUUID(), prodi: kForm.prodi, jalur: kForm.jalur, kuota: Number(kForm.kuota) }
      if (kEditId) {
        updated = kuota.map((k) => k.id === kEditId ? newItem : k)
        showToast("Kuota diperbarui")
      } else {
        updated = [...kuota, newItem]
        showToast("Kuota ditambahkan")
      }
      await saveList("kuota", updated)
      setKOpen(false)
      setKForm({ prodi: "", jalur: "", kuota: "" })
      setKEditId(null)
    } catch (err: any) { showToast("Gagal: " + err.message, "error") }
    finally { setIsSaving(false) }
  }

  const handleDeleteKuota = async (id: string) => {
    if (!confirm("Hapus kuota ini?")) return
    try {
      await saveList("kuota", kuota.filter((k) => k.id !== id))
      showToast("Kuota dihapus")
    } catch (err: any) { showToast("Gagal: " + err.message, "error") }
  }

  // ─── Tahun Akademik CRUD ──────────────────────────────────
  const handleSaveTahun = async () => {
    if (!tForm.tahun.trim()) return
    setIsSaving(true)
    try {
      let updated: TahunAkademik[]
      if (tEditId) {
        updated = tahunAkademik.map((t) => t.id === tEditId ? { ...t, ...tForm } : t)
        showToast("Tahun akademik diperbarui")
      } else {
        updated = [...tahunAkademik, { id: crypto.randomUUID(), ...tForm }]
        showToast("Tahun akademik ditambahkan")
      }
      await saveList("tahun_akademik", updated)
      setTOpen(false)
      setTForm({ tahun: "", status: "Aktif" })
      setTEditId(null)
    } catch (err: any) { showToast("Gagal: " + err.message, "error") }
    finally { setIsSaving(false) }
  }

  const handleDeleteTahun = async (id: string) => {
    if (!confirm("Hapus tahun akademik ini?")) return
    try {
      await saveList("tahun_akademik", tahunAkademik.filter((t) => t.id !== id))
      showToast("Tahun akademik dihapus")
    } catch (err: any) { showToast("Gagal: " + err.message, "error") }
  }

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">Memuat pengaturan PMB...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 rounded-lg px-5 py-3 text-white shadow-lg ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manajemen PMB</h1>
          <p className="text-sm text-muted-foreground">Kelola gelombang, jalur masuk, kuota, dan tahun akademik</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchAll} className="gap-2">
          <RefreshCw className="h-4 w-4" />Refresh
        </Button>
      </div>

      <Tabs defaultValue="gelombang" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="gelombang">Gelombang ({gelombang.length})</TabsTrigger>
          <TabsTrigger value="jalur">Jalur Masuk ({jalurMasuk.length})</TabsTrigger>
          <TabsTrigger value="kuota">Kuota ({kuota.length})</TabsTrigger>
          <TabsTrigger value="tahun">Tahun Akademik ({tahunAkademik.length})</TabsTrigger>
        </TabsList>

        {/* Gelombang */}
        <TabsContent value="gelombang" className="space-y-4">
          <div className="flex justify-between items-center">
            <CardDescription>Kelola gelombang pendaftaran — data tersimpan di database</CardDescription>
            <Dialog open={gOpen} onOpenChange={setGOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2" onClick={() => { setGForm({ nama: "", mulai: "", selesai: "", status: "Aktif" }); setGEditId(null) }}>
                  <Plus className="h-4 w-4" />Tambah Gelombang
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>{gEditId ? "Edit" : "Tambah"} Gelombang</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div><Label>Nama Gelombang <span className="text-red-500">*</span></Label>
                    <Input placeholder="Gelombang 4" value={gForm.nama} onChange={(e) => setGForm({ ...gForm, nama: e.target.value })} className="mt-1" /></div>
                  <div><Label>Tanggal Mulai <span className="text-red-500">*</span></Label>
                    <Input type="date" value={gForm.mulai} onChange={(e) => setGForm({ ...gForm, mulai: e.target.value })} className="mt-1" /></div>
                  <div><Label>Tanggal Selesai <span className="text-red-500">*</span></Label>
                    <Input type="date" value={gForm.selesai} onChange={(e) => setGForm({ ...gForm, selesai: e.target.value })} className="mt-1" /></div>
                  <div><Label>Status</Label>
                    <Select value={gForm.status} onValueChange={(v) => setGForm({ ...gForm, status: v as Gelombang["status"] })}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aktif">Aktif</SelectItem>
                        <SelectItem value="Belum Dibuka">Belum Dibuka</SelectItem>
                        <SelectItem value="Selesai">Selesai</SelectItem>
                      </SelectContent>
                    </Select></div>
                  <Button className="w-full" disabled={!gForm.nama.trim() || !gForm.mulai || !gForm.selesai || isSaving} onClick={handleSaveGelombang}>
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Simpan Gelombang
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Card><CardContent className="pt-6">
            {gelombang.length === 0 ? <div className="text-center py-12 text-muted-foreground text-sm">Belum ada gelombang</div> : (
              <Table><TableHeader><TableRow>
                <TableHead>Nama</TableHead><TableHead>Tanggal Mulai</TableHead>
                <TableHead>Tanggal Selesai</TableHead><TableHead>Status</TableHead><TableHead>Aksi</TableHead>
              </TableRow></TableHeader><TableBody>
                {gelombang.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell className="font-medium">{g.nama}</TableCell>
                    <TableCell>{g.mulai}</TableCell>
                    <TableCell>{g.selesai}</TableCell>
                    <TableCell>
                      <Badge className={g.status === "Aktif" ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-gray-100 text-gray-800 hover:bg-gray-100"}>{g.status}</Badge>
                    </TableCell>
                    <TableCell><div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => { setGForm({ nama: g.nama, mulai: g.mulai, selesai: g.selesai, status: g.status }); setGEditId(g.id); setGOpen(true) }}>
                        <Edit2 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteGelombang(g.id)}>
                        <Trash2 className="h-4 w-4" /></Button>
                    </div></TableCell>
                  </TableRow>
                ))}
              </TableBody></Table>)}
          </CardContent></Card>
        </TabsContent>

        {/* Jalur Masuk */}
        <TabsContent value="jalur" className="space-y-4">
          <div className="flex justify-between items-center">
            <CardDescription>Kelola jalur masuk</CardDescription>
            <Dialog open={jOpen} onOpenChange={setJOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2" onClick={() => { setJForm({ nama: "", deskripsi: "" }); setJEditId(null) }}>
                  <Plus className="h-4 w-4" />Tambah Jalur
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>{jEditId ? "Edit" : "Tambah"} Jalur Masuk</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div><Label>Nama Jalur <span className="text-red-500">*</span></Label>
                    <Input placeholder="SNBP" value={jForm.nama} onChange={(e) => setJForm({ ...jForm, nama: e.target.value })} className="mt-1" /></div>
                  <div><Label>Deskripsi</Label>
                    <Input placeholder="Deskripsi jalur masuk" value={jForm.deskripsi} onChange={(e) => setJForm({ ...jForm, deskripsi: e.target.value })} className="mt-1" /></div>
                  <Button className="w-full" disabled={!jForm.nama.trim() || isSaving} onClick={handleSaveJalur}>
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Simpan Jalur
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Card><CardContent className="pt-6">
            {jalurMasuk.length === 0 ? <div className="text-center py-12 text-muted-foreground text-sm">Belum ada jalur masuk</div> : (
              <Table><TableHeader><TableRow><TableHead>Nama</TableHead><TableHead>Deskripsi</TableHead><TableHead>Aksi</TableHead></TableRow></TableHeader>
                <TableBody>{jalurMasuk.map((j) => (
                  <TableRow key={j.id}>
                    <TableCell className="font-medium">{j.nama}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{j.deskripsi}</TableCell>
                    <TableCell><div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => { setJForm({ nama: j.nama, deskripsi: j.deskripsi }); setJEditId(j.id); setJOpen(true) }}><Edit2 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteJalur(j.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div></TableCell>
                  </TableRow>
                ))}</TableBody></Table>)}
          </CardContent></Card>
        </TabsContent>

        {/* Kuota */}
        <TabsContent value="kuota" className="space-y-4">
          <div className="flex justify-between items-center">
            <CardDescription>Kelola kuota mahasiswa per prodi dan jalur</CardDescription>
            <Dialog open={kOpen} onOpenChange={setKOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2" onClick={() => { setKForm({ prodi: "", jalur: "", kuota: "" }); setKEditId(null) }}>
                  <Plus className="h-4 w-4" />Tambah Kuota
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>{kEditId ? "Edit" : "Tambah"} Kuota</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div><Label>Program Studi <span className="text-red-500">*</span></Label>
                    <Select value={kForm.prodi} onValueChange={(v) => setKForm({ ...kForm, prodi: v })}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Pilih prodi" /></SelectTrigger>
                      <SelectContent>{PRODI_LIST.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                    </Select></div>
                  <div><Label>Jalur Masuk <span className="text-red-500">*</span></Label>
                    <Select value={kForm.jalur} onValueChange={(v) => setKForm({ ...kForm, jalur: v })}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Pilih jalur" /></SelectTrigger>
                      <SelectContent>{jalurMasuk.length > 0 ? jalurMasuk.map((j) => <SelectItem key={j.id} value={j.nama}>{j.nama}</SelectItem>) : ["SNBP","SNBT","Mandiri","Prestasi"].map(j => <SelectItem key={j} value={j}>{j}</SelectItem>)}</SelectContent>
                    </Select></div>
                  <div><Label>Kuota <span className="text-red-500">*</span></Label>
                    <Input type="number" placeholder="50" value={kForm.kuota} onChange={(e) => setKForm({ ...kForm, kuota: e.target.value })} min="1" className="mt-1" /></div>
                  <Button className="w-full" disabled={!kForm.prodi || !kForm.jalur || !kForm.kuota || isSaving} onClick={handleSaveKuota}>
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Simpan Kuota
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Card><CardContent className="pt-6">
            {kuota.length === 0 ? <div className="text-center py-12 text-muted-foreground text-sm">Belum ada kuota</div> : (
              <Table><TableHeader><TableRow><TableHead>Program Studi</TableHead><TableHead>Jalur Masuk</TableHead><TableHead>Kuota</TableHead><TableHead>Aksi</TableHead></TableRow></TableHeader>
                <TableBody>{kuota.map((k) => (
                  <TableRow key={k.id}>
                    <TableCell className="font-medium">{k.prodi}</TableCell>
                    <TableCell>{k.jalur}</TableCell>
                    <TableCell><Badge variant="outline">{k.kuota} mahasiswa</Badge></TableCell>
                    <TableCell><div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => { setKForm({ prodi: k.prodi, jalur: k.jalur, kuota: String(k.kuota) }); setKEditId(k.id); setKOpen(true) }}><Edit2 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteKuota(k.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div></TableCell>
                  </TableRow>
                ))}</TableBody></Table>)}
          </CardContent></Card>
        </TabsContent>

        {/* Tahun Akademik */}
        <TabsContent value="tahun" className="space-y-4">
          <div className="flex justify-between items-center">
            <CardDescription>Kelola tahun akademik</CardDescription>
            <Dialog open={tOpen} onOpenChange={setTOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2" onClick={() => { setTForm({ tahun: "", status: "Aktif" }); setTEditId(null) }}>
                  <Plus className="h-4 w-4" />Tambah Tahun
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>{tEditId ? "Edit" : "Tambah"} Tahun Akademik</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div><Label>Tahun Akademik <span className="text-red-500">*</span></Label>
                    <Input placeholder="2026/2027" value={tForm.tahun} onChange={(e) => setTForm({ ...tForm, tahun: e.target.value })} className="mt-1" /></div>
                  <div><Label>Status</Label>
                    <Select value={tForm.status} onValueChange={(v) => setTForm({ ...tForm, status: v as TahunAkademik["status"] })}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="Aktif">Aktif</SelectItem><SelectItem value="Selesai">Selesai</SelectItem></SelectContent>
                    </Select></div>
                  <Button className="w-full" disabled={!tForm.tahun.trim() || isSaving} onClick={handleSaveTahun}>
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Simpan Tahun
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Card><CardContent className="pt-6">
            {tahunAkademik.length === 0 ? <div className="text-center py-12 text-muted-foreground text-sm">Belum ada tahun akademik</div> : (
              <Table><TableHeader><TableRow><TableHead>Tahun Akademik</TableHead><TableHead>Status</TableHead><TableHead>Aksi</TableHead></TableRow></TableHeader>
                <TableBody>{tahunAkademik.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.tahun}</TableCell>
                    <TableCell>
                      <Badge className={t.status === "Aktif" ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-gray-100 text-gray-800 hover:bg-gray-100"}>{t.status}</Badge>
                    </TableCell>
                    <TableCell><div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => { setTForm({ tahun: t.tahun, status: t.status }); setTEditId(t.id); setTOpen(true) }}><Edit2 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteTahun(t.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div></TableCell>
                  </TableRow>
                ))}</TableBody></Table>)}
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
