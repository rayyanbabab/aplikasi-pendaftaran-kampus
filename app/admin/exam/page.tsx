"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Plus, Loader2, RefreshCw } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface SoalCBT {
  id: string
  nomor: number
  pertanyaan: string
  opsi_a: string
  opsi_b: string
  opsi_c: string
  opsi_d: string
  jawaban: string
  kategori: string
}

interface JadwalUjian {
  id: string
  gelombang: string
  tanggal: string
  jam_mulai: string
  jam_selesai: string
  lokasi: string
  kapasitas_peserta: number
}

interface RuangUjian {
  id: string
  nama: string
  kapasitas: number
  status: string
}

interface Pengawas {
  id: string
  nama: string
  nip: string
  ruang: string
  status: string
}

export default function ExamManagement() {
  const [soal, setSoal] = useState<SoalCBT[]>([])
  const [jadwal, setJadwal] = useState<JadwalUjian[]>([])
  const [ruang, setRuang] = useState<RuangUjian[]>([])
  const [pengawas, setPengawas] = useState<Pengawas[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Form states
  const [newSoal, setNewSoal] = useState({ kategori: "", pertanyaan: "", opsi_a: "", opsi_b: "", opsi_c: "", opsi_d: "", jawaban: "" })
  const [soalOpen, setSoalOpen] = useState(false)
  const [newJadwal, setNewJadwal] = useState({ gelombang: "", tanggal: "", jam_mulai: "", jam_selesai: "", lokasi: "" })
  const [jadwalOpen, setJadwalOpen] = useState(false)
  const [newRuang, setNewRuang] = useState({ nama: "", kapasitas: "", status: "Tersedia" })
  const [ruangOpen, setRuangOpen] = useState(false)
  const [newPengawas, setNewPengawas] = useState({ nama: "", nip: "", ruang: "", status: "Aktif" })
  const [pengawasOpen, setPengawasOpen] = useState(false)

  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null)
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  // ─── Fetch All Data ────────────────────────────────────────
  const fetchAll = async () => {
    try {
      const [soalRes, jadwalRes, ruangRes, pengawasRes] = await Promise.all([
        supabase.from("exam_questions").select("*").order("nomor", { ascending: true }),
        supabase.from("exam_schedules").select("*").order("tanggal", { ascending: true }),
        supabase.from("exam_rooms").select("*").order("nama", { ascending: true }),
        supabase.from("exam_proctors").select("*").order("nama", { ascending: true }),
      ])
      if (soalRes.data) setSoal(soalRes.data)
      if (jadwalRes.data) setJadwal(jadwalRes.data)
      if (ruangRes.data) setRuang(ruangRes.data)
      if (pengawasRes.data) setPengawas(pengawasRes.data)
    } catch (err) {
      console.error("Error fetching exam data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()

    // Realtime subscriptions for all exam tables
    const tables = ["exam_questions", "exam_schedules", "exam_rooms", "exam_proctors"]
    const channels = tables.map((table) =>
      supabase
        .channel(`realtime-${table}`)
        .on("postgres_changes", { event: "*", schema: "public", table }, fetchAll)
        .subscribe()
    )

    return () => { channels.forEach((ch) => ch.unsubscribe()) }
  }, [])

  // ─── Soal CBT Handlers ─────────────────────────────────────
  const handleAddSoal = async () => {
    if (!newSoal.kategori || !newSoal.pertanyaan || !newSoal.jawaban) return
    setIsSaving(true)
    try {
      const { error } = await supabase.from("exam_questions").insert({
        nomor: soal.length + 1,
        pertanyaan: newSoal.pertanyaan,
        opsi_a: newSoal.opsi_a,
        opsi_b: newSoal.opsi_b,
        opsi_c: newSoal.opsi_c,
        opsi_d: newSoal.opsi_d,
        jawaban: newSoal.jawaban,
        kategori: newSoal.kategori,
      })
      if (error) throw error
      setNewSoal({ kategori: "", pertanyaan: "", opsi_a: "", opsi_b: "", opsi_c: "", opsi_d: "", jawaban: "" })
      setSoalOpen(false)
      showToast("Soal berhasil ditambahkan")
    } catch (err: any) { showToast("Gagal menambah soal: " + err.message, "error") }
    finally { setIsSaving(false) }
  }

  const handleDeleteSoal = async (id: string) => {
    if (!confirm("Hapus soal ini?")) return
    const { error } = await supabase.from("exam_questions").delete().eq("id", id)
    if (error) showToast("Gagal menghapus: " + error.message, "error")
    else showToast("Soal dihapus")
  }

  // ─── Jadwal Handlers ──────────────────────────────────────
  const handleAddJadwal = async () => {
    if (!newJadwal.gelombang || !newJadwal.tanggal || !newJadwal.jam_mulai || !newJadwal.jam_selesai || !newJadwal.lokasi) return
    setIsSaving(true)
    try {
      const { error } = await supabase.from("exam_schedules").insert({
        gelombang: newJadwal.gelombang,
        tanggal: newJadwal.tanggal,
        jam_mulai: newJadwal.jam_mulai,
        jam_selesai: newJadwal.jam_selesai,
        lokasi: newJadwal.lokasi,
        kapasitas_peserta: 0,
      })
      if (error) throw error
      setNewJadwal({ gelombang: "", tanggal: "", jam_mulai: "", jam_selesai: "", lokasi: "" })
      setJadwalOpen(false)
      showToast("Jadwal ujian ditambahkan")
    } catch (err: any) { showToast("Gagal: " + err.message, "error") }
    finally { setIsSaving(false) }
  }

  const handleDeleteJadwal = async (id: string) => {
    if (!confirm("Hapus jadwal ini?")) return
    const { error } = await supabase.from("exam_schedules").delete().eq("id", id)
    if (error) showToast("Gagal menghapus: " + error.message, "error")
    else showToast("Jadwal dihapus")
  }

  // ─── Ruang Handlers ───────────────────────────────────────
  const handleAddRuang = async () => {
    if (!newRuang.nama || !newRuang.kapasitas) return
    setIsSaving(true)
    try {
      const { error } = await supabase.from("exam_rooms").insert({
        nama: newRuang.nama,
        kapasitas: Number(newRuang.kapasitas),
        status: newRuang.status,
      })
      if (error) throw error
      setNewRuang({ nama: "", kapasitas: "", status: "Tersedia" })
      setRuangOpen(false)
      showToast("Ruang ujian ditambahkan")
    } catch (err: any) { showToast("Gagal: " + err.message, "error") }
    finally { setIsSaving(false) }
  }

  const handleDeleteRuang = async (id: string) => {
    if (!confirm("Hapus ruang ini?")) return
    const { error } = await supabase.from("exam_rooms").delete().eq("id", id)
    if (error) showToast("Gagal menghapus: " + error.message, "error")
    else showToast("Ruang dihapus")
  }

  // ─── Pengawas Handlers ────────────────────────────────────
  const handleAddPengawas = async () => {
    if (!newPengawas.nama || !newPengawas.nip) return
    setIsSaving(true)
    try {
      const { error } = await supabase.from("exam_proctors").insert({
        nama: newPengawas.nama,
        nip: newPengawas.nip,
        ruang: newPengawas.ruang,
        status: newPengawas.status,
      })
      if (error) throw error
      setNewPengawas({ nama: "", nip: "", ruang: "", status: "Aktif" })
      setPengawasOpen(false)
      showToast("Pengawas ditambahkan")
    } catch (err: any) { showToast("Gagal: " + err.message, "error") }
    finally { setIsSaving(false) }
  }

  const handleDeletePengawas = async (id: string) => {
    if (!confirm("Hapus pengawas ini?")) return
    const { error } = await supabase.from("exam_proctors").delete().eq("id", id)
    if (error) showToast("Gagal menghapus: " + error.message, "error")
    else showToast("Pengawas dihapus")
  }

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">Memuat data ujian dari database...</p>
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
          <h1 className="text-3xl font-bold">Manajemen Ujian</h1>
          <p className="text-sm text-muted-foreground">Kelola soal CBT, jadwal ujian, ruang, dan pengawas</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchAll} className="gap-2">
          <RefreshCw className="h-4 w-4" />Refresh
        </Button>
      </div>

      <Tabs defaultValue="soal" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="soal">Soal CBT ({soal.length})</TabsTrigger>
          <TabsTrigger value="jadwal">Jadwal Ujian ({jadwal.length})</TabsTrigger>
          <TabsTrigger value="ruang">Ruang Ujian ({ruang.length})</TabsTrigger>
          <TabsTrigger value="pengawas">Pengawas ({pengawas.length})</TabsTrigger>
        </TabsList>

        {/* Soal CBT Tab */}
        <TabsContent value="soal" className="space-y-4">
          <div className="flex justify-between items-center">
            <CardDescription>Kelola bank soal ujian CBT</CardDescription>
            <Dialog open={soalOpen} onOpenChange={setSoalOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2"><Plus className="h-4 w-4" />Tambah Soal</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader><DialogTitle>Tambah Soal Baru</DialogTitle></DialogHeader>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                  <div>
                    <Label>Kategori Soal <span className="text-red-500">*</span></Label>
                    <Select value={newSoal.kategori} onValueChange={(v) => setNewSoal({ ...newSoal, kategori: v })}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pengetahuan Umum">Pengetahuan Umum</SelectItem>
                        <SelectItem value="Matematika">Matematika</SelectItem>
                        <SelectItem value="Bahasa Inggris">Bahasa Inggris</SelectItem>
                        <SelectItem value="IPA">IPA</SelectItem>
                        <SelectItem value="Bahasa Indonesia">Bahasa Indonesia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Pertanyaan <span className="text-red-500">*</span></Label>
                    <Textarea placeholder="Masukkan pertanyaan..." rows={3} value={newSoal.pertanyaan} onChange={(e) => setNewSoal({ ...newSoal, pertanyaan: e.target.value })} className="mt-1" />
                  </div>
                  {(["a", "b", "c", "d"] as const).map((opt) => (
                    <div key={opt}>
                      <Label>Opsi {opt.toUpperCase()}</Label>
                      <Input placeholder={`Masukkan opsi ${opt.toUpperCase()}`} value={(newSoal as any)[`opsi_${opt}`]} onChange={(e) => setNewSoal({ ...newSoal, [`opsi_${opt}`]: e.target.value })} className="mt-1" />
                    </div>
                  ))}
                  <div>
                    <Label>Jawaban Benar <span className="text-red-500">*</span></Label>
                    <Select value={newSoal.jawaban} onValueChange={(v) => setNewSoal({ ...newSoal, jawaban: v })}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Pilih jawaban" /></SelectTrigger>
                      <SelectContent>
                        {["A", "B", "C", "D"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full" disabled={!newSoal.kategori || !newSoal.pertanyaan || !newSoal.jawaban || isSaving} onClick={handleAddSoal}>
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Simpan Soal
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Card>
            <CardContent className="pt-6">
              {soal.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">Belum ada soal. Tambahkan soal pertama!</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No.</TableHead>
                      <TableHead>Pertanyaan</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Jawaban</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {soal.map((s, idx) => (
                      <TableRow key={s.id}>
                        <TableCell>{s.nomor || idx + 1}</TableCell>
                        <TableCell className="max-w-sm truncate">{s.pertanyaan}</TableCell>
                        <TableCell>{s.kategori}</TableCell>
                        <TableCell className="font-bold">{s.jawaban}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteSoal(s.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Jadwal Ujian Tab */}
        <TabsContent value="jadwal" className="space-y-4">
          <div className="flex justify-between items-center">
            <CardDescription>Kelola jadwal ujian untuk setiap gelombang</CardDescription>
            <Dialog open={jadwalOpen} onOpenChange={setJadwalOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2"><Plus className="h-4 w-4" />Tambah Jadwal</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Tambah Jadwal Ujian Baru</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Gelombang <span className="text-red-500">*</span></Label>
                    <Select value={newJadwal.gelombang} onValueChange={(v) => setNewJadwal({ ...newJadwal, gelombang: v })}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Pilih gelombang" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gelombang 1">Gelombang 1</SelectItem>
                        <SelectItem value="Gelombang 2">Gelombang 2</SelectItem>
                        <SelectItem value="Gelombang 3">Gelombang 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Tanggal Ujian <span className="text-red-500">*</span></Label>
                    <Input type="date" value={newJadwal.tanggal} onChange={(e) => setNewJadwal({ ...newJadwal, tanggal: e.target.value })} className="mt-1" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Jam Mulai</Label>
                      <Input type="time" value={newJadwal.jam_mulai} onChange={(e) => setNewJadwal({ ...newJadwal, jam_mulai: e.target.value })} className="mt-1" />
                    </div>
                    <div>
                      <Label>Jam Selesai</Label>
                      <Input type="time" value={newJadwal.jam_selesai} onChange={(e) => setNewJadwal({ ...newJadwal, jam_selesai: e.target.value })} className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label>Lokasi/Ruang <span className="text-red-500">*</span></Label>
                    <Select value={newJadwal.lokasi} onValueChange={(v) => setNewJadwal({ ...newJadwal, lokasi: v })}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Pilih ruang" /></SelectTrigger>
                      <SelectContent>
                        {ruang.map((r) => <SelectItem key={r.id} value={r.nama}>{r.nama}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full" disabled={!newJadwal.gelombang || !newJadwal.tanggal || !newJadwal.lokasi || isSaving} onClick={handleAddJadwal}>
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Simpan Jadwal
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Card>
            <CardContent className="pt-6">
              {jadwal.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">Belum ada jadwal ujian</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Gelombang</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Waktu</TableHead>
                      <TableHead>Lokasi</TableHead>
                      <TableHead>Peserta</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jadwal.map((j) => (
                      <TableRow key={j.id}>
                        <TableCell className="font-medium">{j.gelombang}</TableCell>
                        <TableCell>{j.tanggal}</TableCell>
                        <TableCell>{j.jam_mulai} - {j.jam_selesai}</TableCell>
                        <TableCell>{j.lokasi}</TableCell>
                        <TableCell>{j.kapasitas_peserta} orang</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteJadwal(j.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ruang Ujian Tab */}
        <TabsContent value="ruang" className="space-y-4">
          <div className="flex justify-between items-center">
            <CardDescription>Kelola ruang ujian dan kapasitasnya</CardDescription>
            <Dialog open={ruangOpen} onOpenChange={setRuangOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2"><Plus className="h-4 w-4" />Tambah Ruang</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Tambah Ruang Ujian Baru</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Nama Ruang <span className="text-red-500">*</span></Label>
                    <Input placeholder="Lab Komputer D" value={newRuang.nama} onChange={(e) => setNewRuang({ ...newRuang, nama: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label>Kapasitas <span className="text-red-500">*</span></Label>
                    <Input type="number" placeholder="50" value={newRuang.kapasitas} onChange={(e) => setNewRuang({ ...newRuang, kapasitas: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select value={newRuang.status} onValueChange={(v) => setNewRuang({ ...newRuang, status: v })}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tersedia">Tersedia</SelectItem>
                        <SelectItem value="Pemeliharaan">Pemeliharaan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full" disabled={!newRuang.nama || !newRuang.kapasitas || isSaving} onClick={handleAddRuang}>
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Simpan Ruang
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Card>
            <CardContent className="pt-6">
              {ruang.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">Belum ada ruang ujian</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Ruang</TableHead>
                      <TableHead>Kapasitas</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ruang.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.nama}</TableCell>
                        <TableCell>{r.kapasitas} orang</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${r.status === "Tersedia" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                            {r.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteRuang(r.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pengawas Tab */}
        <TabsContent value="pengawas" className="space-y-4">
          <div className="flex justify-between items-center">
            <CardDescription>Kelola daftar pengawas ujian</CardDescription>
            <Dialog open={pengawasOpen} onOpenChange={setPengawasOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2"><Plus className="h-4 w-4" />Tambah Pengawas</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Tambah Pengawas Baru</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Nama Pengawas <span className="text-red-500">*</span></Label>
                    <Input placeholder="Nama lengkap" value={newPengawas.nama} onChange={(e) => setNewPengawas({ ...newPengawas, nama: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label>NIP <span className="text-red-500">*</span></Label>
                    <Input placeholder="19YYMMDD..." value={newPengawas.nip} onChange={(e) => setNewPengawas({ ...newPengawas, nip: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label>Ruang Tugas</Label>
                    <Select value={newPengawas.ruang} onValueChange={(v) => setNewPengawas({ ...newPengawas, ruang: v })}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Pilih ruang" /></SelectTrigger>
                      <SelectContent>
                        {ruang.map((r) => <SelectItem key={r.id} value={r.nama}>{r.nama}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select value={newPengawas.status} onValueChange={(v) => setNewPengawas({ ...newPengawas, status: v })}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aktif">Aktif</SelectItem>
                        <SelectItem value="Cuti">Cuti</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full" disabled={!newPengawas.nama || !newPengawas.nip || isSaving} onClick={handleAddPengawas}>
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Simpan Pengawas
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Card>
            <CardContent className="pt-6">
              {pengawas.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">Belum ada pengawas</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>NIP</TableHead>
                      <TableHead>Ruang Tugas</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pengawas.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.nama}</TableCell>
                        <TableCell>{p.nip}</TableCell>
                        <TableCell>{p.ruang || "-"}</TableCell>
                        <TableCell>
                          <Badge className={p.status === "Aktif" ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-amber-100 text-amber-800 hover:bg-amber-100"}>
                            {p.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeletePengawas(p.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
    </div>
  )
}
