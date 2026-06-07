"use client"

import { useRegistration } from "@/contexts/registration-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function FormSekolah() {
  const { registration, updateDataSekolah } = useRegistration()

  if (!registration) return null

  const data = registration.dataSekolah

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString())

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Sekolah Asal</CardTitle>
        <CardDescription>Lengkapi informasi sekolah asal Anda</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Nama Sekolah & NPSN */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="namaSekolah">Nama Sekolah</Label>
            <Input
              id="namaSekolah"
              value={data.namaSekolah}
              onChange={(e) => updateDataSekolah({ namaSekolah: e.target.value })}
              placeholder="Nama lengkap sekolah"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="npsn">NPSN (Nomor Pokok Sekolah Nasional)</Label>
            <Input
              id="npsn"
              value={data.npsn}
              onChange={(e) => updateDataSekolah({ npsn: e.target.value.replace(/\D/g, "").slice(0, 8) })}
              placeholder="8 digit NPSN"
              maxLength={8}
            />
          </div>
        </div>

        {/* Jenjang & Jurusan */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Jenjang Pendidikan</Label>
            <Select
              value={data.jenjang}
              onValueChange={(value: "sma" | "smk" | "ma") => updateDataSekolah({ jenjang: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenjang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sma">SMA (Sekolah Menengah Atas)</SelectItem>
                <SelectItem value="smk">SMK (Sekolah Menengah Kejuruan)</SelectItem>
                <SelectItem value="ma">MA (Madrasah Aliyah)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="jurusan">Jurusan / Program Keahlian</Label>
            <Input
              id="jurusan"
              value={data.jurusan}
              onChange={(e) => updateDataSekolah({ jurusan: e.target.value })}
              placeholder="IPA / IPS / Teknik Informatika / dll"
            />
          </div>
        </div>

        {/* Tahun Lulus */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Tahun Lulus</Label>
            <Select
              value={data.tahunLulus}
              onValueChange={(value) => updateDataSekolah({ tahunLulus: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih tahun lulus" />
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
          <div className="space-y-2">
            <Label htmlFor="nisn">NISN (Nomor Induk Siswa Nasional)</Label>
            <Input
              id="nisn"
              value={data.nisn}
              onChange={(e) => updateDataSekolah({ nisn: e.target.value.replace(/\D/g, "").slice(0, 10) })}
              placeholder="10 digit NISN"
              maxLength={10}
            />
          </div>
        </div>

        {/* No Ijazah */}
        <div className="space-y-2">
          <Label htmlFor="noIjazah">Nomor Ijazah / SKL</Label>
          <Input
            id="noIjazah"
            value={data.noIjazah}
            onChange={(e) => updateDataSekolah({ noIjazah: e.target.value })}
            placeholder="Nomor ijazah atau surat keterangan lulus"
          />
        </div>

        {/* Alamat Sekolah */}
        <div className="space-y-2">
          <Label htmlFor="alamatSekolah">Alamat Sekolah</Label>
          <Textarea
            id="alamatSekolah"
            value={data.alamatSekolah}
            onChange={(e) => updateDataSekolah({ alamatSekolah: e.target.value })}
            placeholder="Alamat lengkap sekolah"
            rows={2}
          />
        </div>

        {/* Kabupaten & Provinsi Sekolah */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="kabupatenSekolah">Kabupaten/Kota Sekolah</Label>
            <Input
              id="kabupatenSekolah"
              value={data.kabupatenSekolah}
              onChange={(e) => updateDataSekolah({ kabupatenSekolah: e.target.value })}
              placeholder="Kabupaten/Kota"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="provinsiSekolah">Provinsi Sekolah</Label>
            <Input
              id="provinsiSekolah"
              value={data.provinsiSekolah}
              onChange={(e) => updateDataSekolah({ provinsiSekolah: e.target.value })}
              placeholder="Provinsi"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
