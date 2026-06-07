"use client"

import { FAKULTAS_LIST, PRODI_LIST } from "@/lib/mock-data"
import type { RegistrationData } from "@/types/registration"
import { Card } from "@/components/ui/card"

interface TemplateProps {
  registration: RegistrationData
}

export function FormRegistrasiTemplate({ registration }: TemplateProps) {
  const pribadi = registration.dataPribadi
  const ortu = registration.dataOrangTua
  const sekolah = registration.dataSekolah
  const selectedProdi = registration.pilihanProdi[0]
    ? PRODI_LIST.find((p) => p.id === registration.pilihanProdi[0].prodiId)
    : null

  return (
    <div className="print:bg-white bg-white p-8 space-y-6 print:p-12">
      {/* Header */}
      <div className="text-center border-b-2 border-black pb-4">
        <h1 className="text-2xl font-bold">FORMULIR PENDAFTARAN</h1>
        <p className="text-sm text-muted-foreground">Calon Mahasiswa Tahun Akademik 2025/2026</p>
        {registration.noPendaftaran && (
          <p className="text-sm font-semibold mt-2">No. Pendaftaran: {registration.noPendaftaran}</p>
        )}
      </div>

      {/* Data Pribadi Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold border-b-2 border-gray-300 pb-2">DATA PRIBADI</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold">Nama Lengkap:</p>
            <p>{pribadi.namaLengkap || "-"}</p>
          </div>
          <div>
            <p className="font-semibold">NIK:</p>
            <p>{pribadi.nik || "-"}</p>
          </div>
          <div>
            <p className="font-semibold">Tempat/Tanggal Lahir:</p>
            <p>
              {pribadi.tempatLahir || "-"} / {pribadi.tanggalLahir || "-"}
            </p>
          </div>
          <div>
            <p className="font-semibold">Jenis Kelamin:</p>
            <p>{pribadi.jenisKelamin || "-"}</p>
          </div>
          <div>
            <p className="font-semibold">Agama:</p>
            <p>{pribadi.agama || "-"}</p>
          </div>
          <div>
            <p className="font-semibold">Kewarganegaraan:</p>
            <p>{pribadi.kewarganegaraan || "-"}</p>
          </div>
          <div className="col-span-2">
            <p className="font-semibold">Alamat:</p>
            <p>{pribadi.alamat || "-"}</p>
          </div>
          <div>
            <p className="font-semibold">No. HP:</p>
            <p>{pribadi.noHp || "-"}</p>
          </div>
          <div>
            <p className="font-semibold">Email:</p>
            <p>{pribadi.email || "-"}</p>
          </div>
        </div>
      </div>

      {/* Data Sekolah */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold border-b-2 border-gray-300 pb-2">DATA SEKOLAH ASAL</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold">Nama Sekolah:</p>
            <p>{sekolah.namaSekolah || "-"}</p>
          </div>
          <div>
            <p className="font-semibold">NPSN:</p>
            <p>{sekolah.npsn || "-"}</p>
          </div>
          <div>
            <p className="font-semibold">Jenjang:</p>
            <p>{sekolah.jenjang || "-"}</p>
          </div>
          <div>
            <p className="font-semibold">Jurusan:</p>
            <p>{sekolah.jurusan || "-"}</p>
          </div>
          <div>
            <p className="font-semibold">Tahun Lulus:</p>
            <p>{sekolah.tahunLulus || "-"}</p>
          </div>
        </div>
      </div>

      {/* Program Selection */}
      {selectedProdi && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold border-b-2 border-gray-300 pb-2">PROGRAM PILIHAN</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold">Program Studi:</p>
              <p>{selectedProdi.nama}</p>
            </div>
            <div>
              <p className="font-semibold">Jalur Masuk:</p>
              <p>{registration.pilihanProdi[0].jalurMasuk.toUpperCase()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="pt-8 border-t-2 border-black text-center text-xs text-muted-foreground">
        <p>Dokumen ini dicetak secara otomatis oleh sistem</p>
        <p>Tanggal Cetak: {new Date().toLocaleDateString("id-ID")}</p>
      </div>
    </div>
  )
}

export function KartuPesertaTemplate({ registration }: TemplateProps) {
  const pribadi = registration.dataPribadi

  return (
    <div className="print:bg-white bg-white p-8 print:p-4 max-w-sm mx-auto">
      <div className="border-4 border-black p-6 space-y-4">
        {/* Header */}
        <div className="text-center border-b-2 border-black pb-3">
          <h1 className="text-xl font-bold">KARTU PESERTA UJIAN</h1>
          <p className="text-xs">Tahun Akademik 2025/2026</p>
        </div>

        {/* Nomor Pendaftaran */}
        <div className="text-center py-3 bg-gray-100">
          <p className="text-xs font-semibold">No. Pendaftaran</p>
          <p className="text-lg font-mono font-bold">{registration.noPendaftaran || "XXXXXXXXXX"}</p>
        </div>

        {/* Photo Placeholder */}
        <div className="flex justify-center">
          <div className="w-20 h-24 bg-gray-300 border-2 border-black flex items-center justify-center">
            <span className="text-xs text-gray-600">Foto</span>
          </div>
        </div>

        {/* Data */}
        <div className="space-y-2 text-xs">
          <div className="grid grid-cols-3 gap-2">
            <span className="font-semibold col-span-1">Nama</span>
            <span className="col-span-2">: {pribadi.namaLengkap || "-"}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="font-semibold col-span-1">NIK</span>
            <span className="col-span-2">: {pribadi.nik || "-"}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="font-semibold col-span-1">Tempat Lahir</span>
            <span className="col-span-2">: {pribadi.tempatLahir || "-"}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="font-semibold col-span-1">Tgl. Lahir</span>
            <span className="col-span-2">: {pribadi.tanggalLahir || "-"}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center border-t-2 border-black pt-3">
          <p className="text-xs font-semibold">Pemegang Kartu</p>
          <div className="h-12 mt-2"></div>
          <p className="text-xs">({pribadi.namaLengkap || "_______________"})</p>
        </div>
      </div>
    </div>
  )
}

export function BuktiPembayaranTemplate({ registration }: TemplateProps) {
  const payment = registration.pembayaran
  const selectedProdi = registration.pilihanProdi[0]
    ? PRODI_LIST.find((p) => p.id === registration.pilihanProdi[0].prodiId)
    : null

  return (
    <div className="print:bg-white bg-white p-8 print:p-12 space-y-6">
      {/* Header */}
      <div className="text-center border-b-2 border-black pb-4">
        <h1 className="text-2xl font-bold">BUKTI PEMBAYARAN</h1>
        <p className="text-sm text-muted-foreground">Biaya Pendaftaran Online</p>
      </div>

      {/* Transaction Details */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold">No. Pendaftaran:</p>
            <p className="font-mono">{registration.noPendaftaran || "-"}</p>
          </div>
          <div>
            <p className="font-semibold">Tanggal Pembayaran:</p>
            <p>{payment?.paidAt ? new Date(payment.paidAt).toLocaleDateString("id-ID") : "-"}</p>
          </div>
          <div>
            <p className="font-semibold">Metode Pembayaran:</p>
            <p>
              {payment?.method === "virtual_account"
                ? "Virtual Account"
                : payment?.method === "qris"
                  ? "QRIS"
                  : payment?.method === "ewallet"
                    ? "E-Wallet"
                    : "-"}
            </p>
          </div>
          <div>
            <p className="font-semibold">Status:</p>
            <p className="font-semibold text-green-700">{payment?.status === "verified" ? "TERVERIFIKASI" : "PENDING"}</p>
          </div>
        </div>

        {/* Amount */}
        <div className="border-t-2 border-gray-300 pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold">Program Studi:</p>
              <p>{selectedProdi?.nama || "-"}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">Jumlah:</p>
              <p className="text-lg font-bold">
                Rp {payment?.amount.toLocaleString("id-ID") || "0"}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Detail */}
        {payment?.virtualAccountNumber && (
          <div className="bg-gray-50 p-4 rounded text-sm">
            <p className="font-semibold">Virtual Account:</p>
            <p className="font-mono text-lg">{payment.virtualAccountNumber}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-8 border-t-2 border-black text-center text-xs text-muted-foreground">
        <p>Terima kasih telah melakukan pembayaran.</p>
        <p>Dokumen ini adalah bukti pembayaran resmi dan dapat disimpan untuk keperluan administrasi.</p>
        <p>Tanggal Cetak: {new Date().toLocaleDateString("id-ID")}</p>
      </div>
    </div>
  )
}

export function SuratKelulusanTemplate({ registration }: TemplateProps) {
  const pribadi = registration.dataPribadi
  const selectedProdi = registration.pilihanProdi[0]
    ? PRODI_LIST.find((p) => p.id === registration.pilihanProdi[0].prodiId)
    : null

  return (
    <div className="print:bg-white bg-white p-8 print:p-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <p className="text-xs font-semibold tracking-widest">UNIVERSITAS NEGARA</p>
        <h1 className="text-3xl font-bold">SURAT KELULUSAN</h1>
        <p className="text-sm text-muted-foreground">Tahun Akademik 2025/2026</p>
      </div>

      {/* Main Content */}
      <div className="space-y-6 text-justify text-sm leading-relaxed">
        <p>
          Berdasarkan hasil seleksi dan evaluasi yang telah dilaksanakan, dengan ini kami menyatakan
          bahwa:
        </p>

        {/* Candidate Info */}
        <div className="border-l-4 border-black pl-6 py-4 bg-gray-50">
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-semibold">Nama Lengkap:</span> {pribadi.namaLengkap}
            </p>
            <p>
              <span className="font-semibold">No. Pendaftaran:</span> {registration.noPendaftaran}
            </p>
            <p>
              <span className="font-semibold">Program Studi:</span> {selectedProdi?.nama}
            </p>
            <p>
              <span className="font-semibold">Jalur Masuk:</span> {registration.pilihanProdi[0]?.jalurMasuk.toUpperCase()}
            </p>
          </div>
        </div>

        <p>
          <span className="font-bold">DITERIMA</span> sebagai Mahasiswa Baru pada{" "}
          <span className="font-semibold">{selectedProdi?.nama}</span> Universitas Negara tahun akademik
          2025/2026.
        </p>

        <p>
          Anda diminta untuk melakukan Daftar Ulang (registrasi administrasi) dengan membawa dokumen
          asli dan menyertakan biaya daftar ulang sesuai dengan jadwal yang telah ditentukan.
        </p>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <p className="font-semibold mb-2">PENTING:</p>
          <p>
            Apabila Anda tidak melakukan daftar ulang sesuai jadwal yang ditentukan, maka tempat Anda
            akan diberikan kepada peserta pendaftar berikutnya.
          </p>
        </div>
      </div>

      {/* Signature */}
      <div className="flex justify-between pt-12">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Peserta Pendaftar,</p>
          <div className="h-16 mt-8"></div>
          <p className="text-xs font-semibold">({pribadi.namaLengkap})</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Universitas,</p>
          <div className="h-16 mt-8"></div>
          <p className="text-xs font-semibold">(Kepala Bagian Admisi)</p>
        </div>
      </div>

      {/* Date */}
      <div className="text-center border-t-2 border-black pt-4">
        <p className="text-xs text-muted-foreground">
          Dicetak pada: {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  )
}
