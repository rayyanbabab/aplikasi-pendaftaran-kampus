"use client"

import { useRegistration } from "@/contexts/registration-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AGAMA_LIST } from "@/lib/mock-data"

export function FormDataPribadi() {
  const { registration, updateDataPribadi } = useRegistration()

  if (!registration) return null

  const data = registration.dataPribadi

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Pribadi</CardTitle>
        <CardDescription>Lengkapi informasi data diri Anda</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Nama & NIK */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="namaLengkap">Nama Lengkap (Sesuai KTP)</Label>
            <Input
              id="namaLengkap"
              value={data.namaLengkap ?? ""}
              onChange={(e) => updateDataPribadi({ namaLengkap: e.target.value })}
              placeholder="Masukkan nama lengkap"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nik">NIK (Nomor Induk Kependudukan)</Label>
            <Input
              id="nik"
              value={data.nik ?? ""}
              onChange={(e) => updateDataPribadi({ nik: e.target.value.replace(/\D/g, "").slice(0, 16) })}
              placeholder="16 digit NIK"
              maxLength={16}
            />
          </div>
        </div>

        {/* Tempat & Tanggal Lahir */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="tempatLahir">Tempat Lahir</Label>
            <Input
              id="tempatLahir"
              value={data.tempatLahir ?? ""}
              onChange={(e) => updateDataPribadi({ tempatLahir: e.target.value })}
              placeholder="Kota tempat lahir"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
            <Input
              id="tanggalLahir"
              type="date"
              value={data.tanggalLahir ?? ""}
              onChange={(e) => updateDataPribadi({ tanggalLahir: e.target.value })}
            />
          </div>
        </div>

        {/* Jenis Kelamin & Agama */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Jenis Kelamin</Label>
            <Select
              value={data.jenisKelamin ?? ""}
              onValueChange={(value: "laki-laki" | "perempuan") => updateDataPribadi({ jenisKelamin: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis kelamin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="laki-laki">Laki-laki</SelectItem>
                <SelectItem value="perempuan">Perempuan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Agama</Label>
            <Select
              value={data.agama ?? ""}
              onValueChange={(value) => updateDataPribadi({ agama: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih agama" />
              </SelectTrigger>
              <SelectContent>
                {AGAMA_LIST.map((agama) => (
                  <SelectItem key={agama} value={agama}>
                    {agama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Kewarganegaraan */}
        <div className="space-y-2">
          <Label htmlFor="kewarganegaraan">Kewarganegaraan</Label>
          <Input
            id="kewarganegaraan"
            value={data.kewarganegaraan ?? ""}
            onChange={(e) => updateDataPribadi({ kewarganegaraan: e.target.value })}
            placeholder="Indonesia"
          />
        </div>

        {/* Alamat */}
        <div className="space-y-2">
          <Label htmlFor="alamat">Alamat Lengkap</Label>
          <Textarea
            id="alamat"
            value={data.alamat ?? ""}
            onChange={(e) => updateDataPribadi({ alamat: e.target.value })}
            placeholder="Nama jalan, nomor rumah, gang, dsb."
            rows={3}
          />
        </div>

        {/* RT/RW */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="rt">RT</Label>
            <Input
              id="rt"
              value={data.rt ?? ""}
              onChange={(e) => updateDataPribadi({ rt: e.target.value.replace(/\D/g, "").slice(0, 3) })}
              placeholder="001"
              maxLength={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rw">RW</Label>
            <Input
              id="rw"
              value={data.rw ?? ""}
              onChange={(e) => updateDataPribadi({ rw: e.target.value.replace(/\D/g, "").slice(0, 3) })}
              placeholder="001"
              maxLength={3}
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label htmlFor="kodePos">Kode Pos</Label>
            <Input
              id="kodePos"
              value={data.kodePos ?? ""}
              onChange={(e) => updateDataPribadi({ kodePos: e.target.value.replace(/\D/g, "").slice(0, 5) })}
              placeholder="12345"
              maxLength={5}
            />
          </div>
        </div>

        {/* Kelurahan & Kecamatan */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="kelurahan">Kelurahan/Desa</Label>
            <Input
              id="kelurahan"
              value={data.kelurahan ?? ""}
              onChange={(e) => updateDataPribadi({ kelurahan: e.target.value })}
              placeholder="Nama kelurahan/desa"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="kecamatan">Kecamatan</Label>
            <Input
              id="kecamatan"
              value={data.kecamatan ?? ""}
              onChange={(e) => updateDataPribadi({ kecamatan: e.target.value })}
              placeholder="Nama kecamatan"
            />
          </div>
        </div>

        {/* Kabupaten & Provinsi */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="kabupaten">Kabupaten/Kota</Label>
            <Input
              id="kabupaten"
              value={data.kabupaten ?? ""}
              onChange={(e) => updateDataPribadi({ kabupaten: e.target.value })}
              placeholder="Nama kabupaten/kota"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="provinsi">Provinsi</Label>
            <Input
              id="provinsi"
              value={data.provinsi ?? ""}
              onChange={(e) => updateDataPribadi({ provinsi: e.target.value })}
              placeholder="Nama provinsi"
            />
          </div>
        </div>

        {/* Kontak */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="noHp">No. HP / WhatsApp</Label>
            <Input
              id="noHp"
              value={data.noHp ?? ""}
              onChange={(e) => updateDataPribadi({ noHp: e.target.value })}
              placeholder="08xxxxxxxxxx"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.email ?? ""}
              onChange={(e) => updateDataPribadi({ email: e.target.value })}
              placeholder="nama@email.com"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
