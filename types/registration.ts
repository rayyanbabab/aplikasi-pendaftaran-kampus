// Registration Types for Portal Calon Mahasiswa
import type { RoleType } from "@/types/roles"

export type ApplicationStatus =
  | "draft"
  | "menunggu_verifikasi"
  | "berkas_ditolak"
  | "berkas_diterima"
  | "lulus_seleksi"
  | "tidak_lulus"
  | "daftar_ulang"

export type DocumentType = "foto" | "ktp" | "kk" | "ijazah" | "rapor" | "sertifikat"

export type DocumentStatus = "pending" | "uploaded" | "verified" | "rejected"

export type PaymentMethod = "virtual_account" | "qris" | "ewallet"

export type PaymentStatus = "unpaid" | "pending" | "verified" | "failed"

export type JalurMasuk = "snbp" | "snbt" | "mandiri" | "prestasi" | "kip"

export interface User {
  id: string
  email: string
  phone: string
  name: string
  role: RoleType
  isVerified: boolean
  createdAt: string
}

export interface DataPribadi {
  namaLengkap: string
  nik: string
  tempatLahir: string
  tanggalLahir: string
  jenisKelamin: "laki-laki" | "perempuan" | ""
  agama: string
  kewarganegaraan: string
  alamat: string
  rt: string
  rw: string
  kelurahan: string
  kecamatan: string
  kabupaten: string
  provinsi: string
  kodePos: string
  noHp: string
  email: string
}

export interface DataOrangTua {
  namaAyah: string
  nikAyah: string
  pekerjaanAyah: string
  pendidikanAyah: string
  penghasilanAyah: string
  noHpAyah: string
  namaIbu: string
  nikIbu: string
  pekerjaanIbu: string
  pendidikanIbu: string
  penghasilanIbu: string
  noHpIbu: string
  alamatOrangTua: string
  namaWali?: string
  noHpWali?: string
  hubunganWali?: string
}

export interface DataSekolah {
  namaSekolah: string
  npsn: string
  jenjang: "sma" | "smk" | "ma" | ""
  jurusan: string
  alamatSekolah: string
  kabupatenSekolah: string
  provinsiSekolah: string
  tahunLulus: string
  nisn: string
  noIjazah: string
}

export interface NilaiRapor {
  id: string
  semester: string
  matematika: number | null
  bahasaIndonesia: number | null
  bahasaInggris: number | null
  ipa: number | null
  ips: number | null
  rataRata: number | null
}

export interface Prestasi {
  id: string
  nama: string
  tingkat: "sekolah" | "kecamatan" | "kabupaten" | "provinsi" | "nasional" | "internasional"
  tahun: string
  penyelenggara: string
  peringkat: string
  buktiFile?: UploadedFile
}

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  uploadedAt: string
  previewUrl?: string
  status: DocumentStatus
  rejectionReason?: string
}

export interface DocumentUpload {
  type: DocumentType
  label: string
  required: boolean
  allowedFormats: string[]
  maxSize: number // in MB
  file?: UploadedFile
}

export interface PilihanProdi {
  urutan: 1 | 2 | 3
  fakultasId: string
  prodiId: string
  jalurMasuk: JalurMasuk
  gelombang: string
}

export interface Pembayaran {
  id: string
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  virtualAccountNumber?: string
  bankCode?: string
  qrisCode?: string
  ewalletProvider?: string
  ewalletNumber?: string
  buktiTransfer?: UploadedFile
  paidAt?: string
  verifiedAt?: string
  expiredAt: string
  createdAt: string
}

export interface RegistrationData {
  userId: string
  dataPribadi: DataPribadi
  dataOrangTua: DataOrangTua
  dataSekolah: DataSekolah
  nilaiRapor: NilaiRapor[]
  prestasi: Prestasi[]
  documents: DocumentUpload[]
  pilihanProdi: PilihanProdi[]
  pembayaran?: Pembayaran
  status: ApplicationStatus
  statusHistory: StatusHistoryItem[]
  noPendaftaran?: string
  createdAt: string
  updatedAt: string
}

export interface StatusHistoryItem {
  status: ApplicationStatus
  timestamp: string
  note?: string
}

// Faculty & Program Data Types
export interface Fakultas {
  id: string
  nama: string
  kode: string
  deskripsi: string
  icon: string
}

export interface ProgramStudi {
  id: string
  fakultasId: string
  nama: string
  kode: string
  jenjang: "S1" | "D3" | "D4"
  akreditasi: "A" | "B" | "C" | "Unggul" | "Baik Sekali" | "Baik"
  biayaRegistrasi: number
  biayaSpp: number
  kuota: number
  deskripsi: string
}

export interface Gelombang {
  id: string
  nama: string
  tanggalBuka: string
  tanggalTutup: string
  tanggalUjian?: string
  tanggalPengumuman: string
  kuota: number
  isActive: boolean
}
