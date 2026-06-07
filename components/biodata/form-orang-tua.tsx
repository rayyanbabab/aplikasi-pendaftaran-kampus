"use client"

import { useRegistration } from "@/contexts/registration-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PENDIDIKAN_LIST, PEKERJAAN_LIST, PENGHASILAN_LIST } from "@/lib/mock-data"

export function FormOrangTua() {
  const { registration, updateDataOrangTua } = useRegistration()

  if (!registration) return null

  const data = registration.dataOrangTua

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Orang Tua / Wali</CardTitle>
        <CardDescription>Lengkapi informasi data orang tua atau wali Anda</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Data Ayah */}
        <div className="space-y-4">
          <h3 className="font-semibold text-primary">Data Ayah</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="namaAyah">Nama Lengkap Ayah</Label>
              <Input
                id="namaAyah"
                value={data.namaAyah}
                onChange={(e) => updateDataOrangTua({ namaAyah: e.target.value })}
                placeholder="Masukkan nama lengkap ayah"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nikAyah">NIK Ayah</Label>
              <Input
                id="nikAyah"
                value={data.nikAyah}
                onChange={(e) => updateDataOrangTua({ nikAyah: e.target.value.replace(/\D/g, "").slice(0, 16) })}
                placeholder="16 digit NIK"
                maxLength={16}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Pendidikan Terakhir Ayah</Label>
              <Select
                value={data.pendidikanAyah}
                onValueChange={(value) => updateDataOrangTua({ pendidikanAyah: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih pendidikan" />
                </SelectTrigger>
                <SelectContent>
                  {PENDIDIKAN_LIST.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Pekerjaan Ayah</Label>
              <Select
                value={data.pekerjaanAyah}
                onValueChange={(value) => updateDataOrangTua({ pekerjaanAyah: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih pekerjaan" />
                </SelectTrigger>
                <SelectContent>
                  {PEKERJAAN_LIST.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Penghasilan Ayah</Label>
              <Select
                value={data.penghasilanAyah}
                onValueChange={(value) => updateDataOrangTua({ penghasilanAyah: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih penghasilan" />
                </SelectTrigger>
                <SelectContent>
                  {PENGHASILAN_LIST.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="noHpAyah">No. HP Ayah</Label>
              <Input
                id="noHpAyah"
                value={data.noHpAyah}
                onChange={(e) => updateDataOrangTua({ noHpAyah: e.target.value })}
                placeholder="08xxxxxxxxxx"
              />
            </div>
          </div>
        </div>

        {/* Data Ibu */}
        <div className="space-y-4">
          <h3 className="font-semibold text-primary">Data Ibu</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="namaIbu">Nama Lengkap Ibu</Label>
              <Input
                id="namaIbu"
                value={data.namaIbu}
                onChange={(e) => updateDataOrangTua({ namaIbu: e.target.value })}
                placeholder="Masukkan nama lengkap ibu"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nikIbu">NIK Ibu</Label>
              <Input
                id="nikIbu"
                value={data.nikIbu}
                onChange={(e) => updateDataOrangTua({ nikIbu: e.target.value.replace(/\D/g, "").slice(0, 16) })}
                placeholder="16 digit NIK"
                maxLength={16}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Pendidikan Terakhir Ibu</Label>
              <Select
                value={data.pendidikanIbu}
                onValueChange={(value) => updateDataOrangTua({ pendidikanIbu: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih pendidikan" />
                </SelectTrigger>
                <SelectContent>
                  {PENDIDIKAN_LIST.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Pekerjaan Ibu</Label>
              <Select
                value={data.pekerjaanIbu}
                onValueChange={(value) => updateDataOrangTua({ pekerjaanIbu: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih pekerjaan" />
                </SelectTrigger>
                <SelectContent>
                  {PEKERJAAN_LIST.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Penghasilan Ibu</Label>
              <Select
                value={data.penghasilanIbu}
                onValueChange={(value) => updateDataOrangTua({ penghasilanIbu: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih penghasilan" />
                </SelectTrigger>
                <SelectContent>
                  {PENGHASILAN_LIST.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="noHpIbu">No. HP Ibu</Label>
              <Input
                id="noHpIbu"
                value={data.noHpIbu}
                onChange={(e) => updateDataOrangTua({ noHpIbu: e.target.value })}
                placeholder="08xxxxxxxxxx"
              />
            </div>
          </div>
        </div>

        {/* Alamat Orang Tua */}
        <div className="space-y-4">
          <h3 className="font-semibold text-primary">Alamat Orang Tua</h3>
          <div className="space-y-2">
            <Label htmlFor="alamatOrangTua">Alamat Lengkap Orang Tua</Label>
            <Textarea
              id="alamatOrangTua"
              value={data.alamatOrangTua}
              onChange={(e) => updateDataOrangTua({ alamatOrangTua: e.target.value })}
              placeholder="Alamat lengkap tempat tinggal orang tua"
              rows={3}
            />
          </div>
        </div>

        {/* Data Wali (Opsional) */}
        <div className="space-y-4">
          <h3 className="font-semibold text-primary">Data Wali (Opsional)</h3>
          <p className="text-sm text-muted-foreground">Isi jika berbeda dengan orang tua kandung</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="namaWali">Nama Wali</Label>
              <Input
                id="namaWali"
                value={data.namaWali || ""}
                onChange={(e) => updateDataOrangTua({ namaWali: e.target.value })}
                placeholder="Nama lengkap wali"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="noHpWali">No. HP Wali</Label>
              <Input
                id="noHpWali"
                value={data.noHpWali || ""}
                onChange={(e) => updateDataOrangTua({ noHpWali: e.target.value })}
                placeholder="08xxxxxxxxxx"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hubunganWali">Hubungan dengan Wali</Label>
              <Input
                id="hubunganWali"
                value={data.hubunganWali || ""}
                onChange={(e) => updateDataOrangTua({ hubunganWali: e.target.value })}
                placeholder="Paman/Bibi/dll"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
