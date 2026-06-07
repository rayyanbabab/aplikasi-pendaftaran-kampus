"use client"

import { useState } from "react"
import { Plus, Trash2, Info } from "lucide-react"
import { useRegistration } from "@/contexts/registration-context"
import { FAKULTAS_LIST, PRODI_LIST, GELOMBANG_LIST, JALUR_MASUK } from "@/lib/mock-data"
import type { PilihanProdi, JalurMasuk } from "@/types/registration"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

export default function KuliahPage() {
  const { registration, setPilihanProdi } = useRegistration()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [selectedFakultas, setSelectedFakultas] = useState("")
  const [selectedProdi, setSelectedProdi] = useState("")
  const [selectedJalur, setSelectedJalur] = useState<JalurMasuk>("snbp")
  const [selectedGelombang, setSelectedGelombang] = useState("")

  if (!registration) return null

  const filteredProdi = selectedFakultas
    ? PRODI_LIST.filter((p) => p.fakultasId === selectedFakultas)
    : []

  const handleOpenDialog = (index?: number) => {
    if (index !== undefined) {
      const pilihan = registration.pilihanProdi[index]
      setEditingIndex(index)
      setSelectedFakultas(pilihan.fakultasId)
      setSelectedProdi(pilihan.prodiId)
      setSelectedJalur(pilihan.jalurMasuk)
      setSelectedGelombang(pilihan.gelombang)
    } else {
      setEditingIndex(null)
      setSelectedFakultas("")
      setSelectedProdi("")
      setSelectedJalur("snbp")
      setSelectedGelombang("")
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!selectedFakultas || !selectedProdi || !selectedGelombang) return

    const urutan = editingIndex !== null ? (editingIndex + 1) : (registration.pilihanProdi.length + 1) as 1 | 2 | 3
    
    // Check if already selected (allow editing same index)
    const isDuplicate = registration.pilihanProdi.some(
      (p, idx) => p.prodiId === selectedProdi && idx !== editingIndex
    )

    if (isDuplicate) {
      alert("Program studi ini sudah dipilih. Pilih yang berbeda.")
      return
    }

    if (registration.pilihanProdi.length >= 3 && editingIndex === null) {
      alert("Maksimal 3 pilihan program studi")
      return
    }

    const newPilihan: PilihanProdi = {
      urutan: urutan as 1 | 2 | 3,
      fakultasId: selectedFakultas,
      prodiId: selectedProdi,
      jalurMasuk: selectedJalur,
      gelombang: selectedGelombang,
    }

    const updated = editingIndex !== null
      ? registration.pilihanProdi.map((p, idx) => (idx === editingIndex ? newPilihan : p))
      : [...registration.pilihanProdi, newPilihan]

    setPilihanProdi(updated)
    setIsDialogOpen(false)
  }

  const handleRemove = (index: number) => {
    const updated = registration.pilihanProdi.filter((_, idx) => idx !== index)
    setPilihanProdi(updated)
  }

  const selectedProdiData = selectedProdi ? PRODI_LIST.find((p) => p.id === selectedProdi) : null
  const selectedGelombangData = selectedGelombang ? GELOMBANG_LIST.find((g) => g.id === selectedGelombang) : null
  const selectedJalurData = JALUR_MASUK.find((j) => j.id === selectedJalur)

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Pilihan Kuliah</h1>
        <p className="text-muted-foreground">Pilih program studi, jalur masuk, dan gelombang pendaftaran</p>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Anda dapat memilih hingga 3 program studi dalam urutan preferensi. Pastikan semua pilihan disesuaikan dengan kemampuan dan minat Anda.
        </AlertDescription>
      </Alert>

      {/* Current Selections */}
      {registration.pilihanProdi.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold">Pilihan Anda</h2>
          <div className="space-y-2">
            {registration.pilihanProdi.map((pilihan, idx) => {
              const fakultas = FAKULTAS_LIST.find((f) => f.id === pilihan.fakultasId)
              const prodi = PRODI_LIST.find((p) => p.id === pilihan.prodiId)
              const gelombang = GELOMBANG_LIST.find((g) => g.id === pilihan.gelombang)
              const jalur = JALUR_MASUK.find((j) => j.id === pilihan.jalurMasuk)

              return (
                <Card key={idx}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="default">Pilihan {idx + 1}</Badge>
                          <h3 className="font-semibold">{prodi?.nama}</h3>
                        </div>
                        <div className="grid gap-2 text-sm text-muted-foreground">
                          <p>
                            <span className="font-medium text-foreground">Fakultas:</span> {fakultas?.nama}
                          </p>
                          <p>
                            <span className="font-medium text-foreground">Jalur Masuk:</span> {jalur?.nama}
                          </p>
                          <p>
                            <span className="font-medium text-foreground">Gelombang:</span> {gelombang?.nama}
                          </p>
                          <p>
                            <span className="font-medium text-foreground">Biaya Registrasi:</span> Rp{" "}
                            {prodi?.biayaRegistrasi.toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(idx)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleRemove(idx)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Add/Edit Pilihan Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={() => handleOpenDialog()}
            disabled={registration.pilihanProdi.length >= 3 && editingIndex === null}
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            {editingIndex !== null ? "Edit Pilihan" : "Tambah Pilihan"}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingIndex !== null ? "Edit Pilihan" : "Tambah Pilihan Program Studi"}</DialogTitle>
            <DialogDescription>
              Pilih program studi, jalur masuk, dan gelombang pendaftaran Anda
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Fakultas Selection */}
            <div className="space-y-3">
              <Label>Fakultas</Label>
              <Select value={selectedFakultas} onValueChange={setSelectedFakultas}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Fakultas" />
                </SelectTrigger>
                <SelectContent>
                  {FAKULTAS_LIST.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedFakultas && (
                <p className="text-xs text-muted-foreground">
                  {FAKULTAS_LIST.find((f) => f.id === selectedFakultas)?.deskripsi}
                </p>
              )}
            </div>

            {/* Program Studi Selection */}
            <div className="space-y-3">
              <Label>Program Studi</Label>
              <Select value={selectedProdi} onValueChange={setSelectedProdi} disabled={!selectedFakultas}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Program Studi" />
                </SelectTrigger>
                <SelectContent>
                  {filteredProdi.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nama} ({p.jenjang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedProdiData && (
                <div className="rounded-lg bg-secondary/30 p-3 text-sm space-y-2">
                  <p>
                    <span className="font-medium">Deskripsi:</span> {selectedProdiData.deskripsi}
                  </p>
                  <p>
                    <span className="font-medium">Akreditasi:</span> {selectedProdiData.akreditasi}
                  </p>
                  <p>
                    <span className="font-medium">Biaya Registrasi:</span> Rp{" "}
                    {selectedProdiData.biayaRegistrasi.toLocaleString("id-ID")}
                  </p>
                  <p>
                    <span className="font-medium">Kuota:</span> {selectedProdiData.kuota}
                  </p>
                </div>
              )}
            </div>

            {/* Jalur Masuk Selection */}
            <div className="space-y-3">
              <Label>Jalur Masuk</Label>
              <Select value={selectedJalur} onValueChange={(value) => setSelectedJalur(value as JalurMasuk)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Jalur Masuk" />
                </SelectTrigger>
                <SelectContent>
                  {JALUR_MASUK.map((j) => (
                    <SelectItem key={j.id} value={j.id}>
                      {j.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedJalurData && (
                <div className="rounded-lg bg-secondary/30 p-3 text-sm space-y-2">
                  <p className="font-medium">{selectedJalurData.fullName}</p>
                  <p className="text-muted-foreground">{selectedJalurData.deskripsi}</p>
                  <div>
                    <p className="font-medium text-xs mb-1">Syarat:</p>
                    <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
                      {selectedJalurData.syarat.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Gelombang Selection */}
            <div className="space-y-3">
              <Label>Gelombang</Label>
              <Select value={selectedGelombang} onValueChange={setSelectedGelombang}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Gelombang" />
                </SelectTrigger>
                <SelectContent>
                  {GELOMBANG_LIST.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedGelombangData && (
                <div className="rounded-lg bg-secondary/30 p-3 text-sm space-y-2">
                  <p>
                    <span className="font-medium">Buka:</span>{" "}
                    {new Date(selectedGelombangData.tanggalBuka).toLocaleDateString("id-ID")}
                  </p>
                  <p>
                    <span className="font-medium">Tutup:</span>{" "}
                    {new Date(selectedGelombangData.tanggalTutup).toLocaleDateString("id-ID")}
                  </p>
                  {selectedGelombangData.tanggalUjian && (
                    <p>
                      <span className="font-medium">Ujian:</span>{" "}
                      {new Date(selectedGelombangData.tanggalUjian).toLocaleDateString("id-ID")}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">Pengumuman:</span>{" "}
                    {new Date(selectedGelombangData.tanggalPengumuman).toLocaleDateString("id-ID")}
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleSave}
              disabled={!selectedFakultas || !selectedProdi || !selectedGelombang}
            >
              {editingIndex !== null ? "Simpan Perubahan" : "Tambah Pilihan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {registration.pilihanProdi.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-3">
              <p className="text-muted-foreground">Belum ada pilihan program studi</p>
              <p className="text-sm text-muted-foreground">
                Klik tombol di atas untuk memulai memilih program studi Anda
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
