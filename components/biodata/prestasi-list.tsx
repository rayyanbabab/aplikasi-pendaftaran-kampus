"use client"

import { useState } from "react"
import { Plus, Trash2, Edit2, Trophy } from "lucide-react"
import { useRegistration } from "@/contexts/registration-context"
import type { Prestasi } from "@/types/registration"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

const TINGKAT_LIST = [
  { value: "sekolah", label: "Sekolah" },
  { value: "kecamatan", label: "Kecamatan" },
  { value: "kabupaten", label: "Kabupaten/Kota" },
  { value: "provinsi", label: "Provinsi" },
  { value: "nasional", label: "Nasional" },
  { value: "internasional", label: "Internasional" },
]

const tingkatColors: Record<string, string> = {
  sekolah: "bg-secondary text-secondary-foreground",
  kecamatan: "bg-blue-100 text-blue-800",
  kabupaten: "bg-green-100 text-green-800",
  provinsi: "bg-amber-100 text-amber-800",
  nasional: "bg-primary/10 text-primary",
  internasional: "bg-purple-100 text-purple-800",
}

export function PrestasiList() {
  const { registration, addPrestasi, updatePrestasi, removePrestasi } = useRegistration()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<Prestasi, "id">>({
    nama: "",
    tingkat: "sekolah",
    tahun: "",
    penyelenggara: "",
    peringkat: "",
  })

  if (!registration) return null

  const resetForm = () => {
    setFormData({
      nama: "",
      tingkat: "sekolah",
      tahun: "",
      penyelenggara: "",
      peringkat: "",
    })
    setEditingId(null)
  }

  const handleOpenDialog = (prestasi?: Prestasi) => {
    if (prestasi) {
      setEditingId(prestasi.id)
      setFormData({
        nama: prestasi.nama,
        tingkat: prestasi.tingkat,
        tahun: prestasi.tahun,
        penyelenggara: prestasi.penyelenggara,
        peringkat: prestasi.peringkat,
      })
    } else {
      resetForm()
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!formData.nama || !formData.tahun) return

    if (editingId) {
      updatePrestasi(editingId, formData)
    } else {
      addPrestasi(formData)
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => (currentYear - i).toString())

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Prestasi</CardTitle>
          <CardDescription>Tambahkan prestasi akademik maupun non-akademik</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Prestasi
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Prestasi" : "Tambah Prestasi"}</DialogTitle>
              <DialogDescription>
                Masukkan detail prestasi yang Anda raih
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Prestasi / Lomba</Label>
                <Input
                  id="nama"
                  value={formData.nama}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nama: e.target.value }))}
                  placeholder="Contoh: Olimpiade Matematika"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tingkat</Label>
                  <Select
                    value={formData.tingkat}
                    onValueChange={(value: Prestasi["tingkat"]) =>
                      setFormData((prev) => ({ ...prev, tingkat: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tingkat" />
                    </SelectTrigger>
                    <SelectContent>
                      {TINGKAT_LIST.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tahun</Label>
                  <Select
                    value={formData.tahun}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, tahun: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tahun" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="penyelenggara">Penyelenggara</Label>
                <Input
                  id="penyelenggara"
                  value={formData.penyelenggara}
                  onChange={(e) => setFormData((prev) => ({ ...prev, penyelenggara: e.target.value }))}
                  placeholder="Contoh: Kemendikbud"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="peringkat">Peringkat / Pencapaian</Label>
                <Input
                  id="peringkat"
                  value={formData.peringkat}
                  onChange={(e) => setFormData((prev) => ({ ...prev, peringkat: e.target.value }))}
                  placeholder="Contoh: Juara 1, Medali Emas"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleSave} disabled={!formData.nama || !formData.tahun}>
                Simpan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {(registration.prestasi || []).length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
            <Trophy className="mb-2 h-10 w-10 text-muted-foreground/50" />
            <p className="text-muted-foreground">Belum ada prestasi yang ditambahkan</p>
            <p className="text-sm text-muted-foreground">Prestasi bersifat opsional namun dapat meningkatkan peluang Anda</p>
          </div>
        ) : (
          <div className="space-y-3">
            {(registration.prestasi || []).map((prestasi) => {
              const tingkatInfo = TINGKAT_LIST.find((t) => t.value === prestasi.tingkat)
              return (
                <div
                  key={prestasi.id}
                  className="flex items-start gap-4 rounded-lg border p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{prestasi.nama}</p>
                        <p className="text-sm text-muted-foreground">
                          {prestasi.penyelenggara} - {prestasi.tahun}
                        </p>
                      </div>
                      <Badge className={tingkatColors[prestasi.tingkat]}>
                        {tingkatInfo?.label}
                      </Badge>
                    </div>
                    {prestasi.peringkat && (
                      <p className="mt-1 text-sm font-medium text-primary">{prestasi.peringkat}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(prestasi)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removePrestasi(prestasi.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
