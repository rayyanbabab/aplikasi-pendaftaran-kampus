"use client"

import { useState } from "react"
import { Plus, Trash2, Edit2, X, Check } from "lucide-react"
import { useRegistration } from "@/contexts/registration-context"
import type { NilaiRapor } from "@/types/registration"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const SEMESTERS = [
  "Semester 1 - Kelas 10",
  "Semester 2 - Kelas 10",
  "Semester 1 - Kelas 11",
  "Semester 2 - Kelas 11",
  "Semester 1 - Kelas 12",
]

export function NilaiRaporList() {
  const { registration, addNilaiRapor, updateNilaiRapor, removeNilaiRapor } = useRegistration()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<NilaiRapor, "id">>({
    semester: "",
    matematika: null,
    bahasaIndonesia: null,
    bahasaInggris: null,
    ipa: null,
    ips: null,
    rataRata: null,
  })

  if (!registration) return null

  const resetForm = () => {
    setFormData({
      semester: "",
      matematika: null,
      bahasaIndonesia: null,
      bahasaInggris: null,
      ipa: null,
      ips: null,
      rataRata: null,
    })
    setEditingId(null)
  }

  const handleOpenDialog = (nilai?: NilaiRapor) => {
    if (nilai) {
      setEditingId(nilai.id)
      setFormData({
        semester: nilai.semester,
        matematika: nilai.matematika,
        bahasaIndonesia: nilai.bahasaIndonesia,
        bahasaInggris: nilai.bahasaInggris,
        ipa: nilai.ipa,
        ips: nilai.ips,
        rataRata: nilai.rataRata,
      })
    } else {
      resetForm()
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!formData.semester) return

    // Calculate average
    const values = [
      formData.matematika,
      formData.bahasaIndonesia,
      formData.bahasaInggris,
      formData.ipa,
      formData.ips,
    ].filter((v) => v !== null) as number[]

    const rataRata = values.length > 0 ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100 : null

    const dataWithAvg = { ...formData, rataRata }

    if (editingId) {
      updateNilaiRapor(editingId, dataWithAvg)
    } else {
      addNilaiRapor(dataWithAvg)
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const handleInputChange = (field: keyof Omit<NilaiRapor, "id" | "semester" | "rataRata">, value: string) => {
    const numValue = value === "" ? null : parseFloat(value)
    if (numValue !== null && (numValue < 0 || numValue > 100)) return
    setFormData((prev) => ({ ...prev, [field]: numValue }))
  }

  const nilaiRapor = registration.nilaiRapor || []
  const usedSemesters = nilaiRapor.map((n) => n.semester)
  const availableSemesters = SEMESTERS.filter((s) => !usedSemesters.includes(s) || s === formData.semester)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Nilai Rapor</CardTitle>
          <CardDescription>Input nilai rapor semester 1-5</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} disabled={nilaiRapor.length >= 5}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Nilai
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Nilai Rapor" : "Tambah Nilai Rapor"}</DialogTitle>
              <DialogDescription>
                Masukkan nilai rapor untuk semester yang dipilih
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Semester</Label>
                <Select
                  value={formData.semester}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, semester: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSemesters.map((sem) => (
                      <SelectItem key={sem} value={sem}>
                        {sem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="matematika">Matematika</Label>
                  <Input
                    id="matematika"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.matematika ?? ""}
                    onChange={(e) => handleInputChange("matematika", e.target.value)}
                    placeholder="0-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bahasaIndonesia">B. Indonesia</Label>
                  <Input
                    id="bahasaIndonesia"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.bahasaIndonesia ?? ""}
                    onChange={(e) => handleInputChange("bahasaIndonesia", e.target.value)}
                    placeholder="0-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bahasaInggris">B. Inggris</Label>
                  <Input
                    id="bahasaInggris"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.bahasaInggris ?? ""}
                    onChange={(e) => handleInputChange("bahasaInggris", e.target.value)}
                    placeholder="0-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ipa">IPA</Label>
                  <Input
                    id="ipa"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.ipa ?? ""}
                    onChange={(e) => handleInputChange("ipa", e.target.value)}
                    placeholder="0-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ips">IPS</Label>
                  <Input
                    id="ips"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.ips ?? ""}
                    onChange={(e) => handleInputChange("ips", e.target.value)}
                    placeholder="0-100"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleSave} disabled={!formData.semester}>
                Simpan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {nilaiRapor.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
            <p className="text-muted-foreground">Belum ada nilai rapor yang diinput</p>
            <p className="text-sm text-muted-foreground">Klik tombol &quot;Tambah Nilai&quot; untuk memulai</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Semester</TableHead>
                  <TableHead className="text-center">MTK</TableHead>
                  <TableHead className="text-center">B.Indo</TableHead>
                  <TableHead className="text-center">B.Ing</TableHead>
                  <TableHead className="text-center">IPA</TableHead>
                  <TableHead className="text-center">IPS</TableHead>
                  <TableHead className="text-center">Rata-rata</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nilaiRapor.map((nilai) => (
                  <TableRow key={nilai.id}>
                    <TableCell className="font-medium">{nilai.semester}</TableCell>
                    <TableCell className="text-center">{nilai.matematika ?? "-"}</TableCell>
                    <TableCell className="text-center">{nilai.bahasaIndonesia ?? "-"}</TableCell>
                    <TableCell className="text-center">{nilai.bahasaInggris ?? "-"}</TableCell>
                    <TableCell className="text-center">{nilai.ipa ?? "-"}</TableCell>
                    <TableCell className="text-center">{nilai.ips ?? "-"}</TableCell>
                    <TableCell className="text-center font-semibold">{nilai.rataRata ?? "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(nilai)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeNilaiRapor(nilai.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
