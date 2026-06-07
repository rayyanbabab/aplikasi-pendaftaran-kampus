// Role types untuk Aplikasi Pendaftaran Kampus

export type RoleType =
  | "super_admin"
  | "admin_pmb"
  | "verifikator"
  | "keuangan"
  | "penguji"
  | "calon_mahasiswa";

export interface Role {
  id: RoleType;
  name: string;
  description: string;
  color: string;
  icon: string;
  permissions: Permission[];
}

export type Permission =
  // Dashboard
  | "dashboard.view"
  | "dashboard.analytics"
  | "dashboard.executive"
  // User Management
  | "users.view"
  | "users.create"
  | "users.edit"
  | "users.delete"
  | "roles.manage"
  // PMB Management
  | "pmb.gelombang.manage"
  | "pmb.jalur.manage"
  | "pmb.kuota.manage"
  | "pmb.tahun_akademik.manage"
  // Pendaftar
  | "pendaftar.view"
  | "pendaftar.create"
  | "pendaftar.edit"
  | "pendaftar.delete"
  | "pendaftar.export"
  // Verifikasi
  | "verifikasi.berkas.view"
  | "verifikasi.berkas.approve"
  | "verifikasi.berkas.reject"
  // Keuangan
  | "keuangan.pembayaran.view"
  | "keuangan.pembayaran.verify"
  | "keuangan.laporan.view"
  | "keuangan.laporan.export"
  // Ujian
  | "ujian.soal.manage"
  | "ujian.jadwal.manage"
  | "ujian.ruang.manage"
  | "ujian.pengawas.manage"
  | "ujian.nilai.view"
  | "ujian.nilai.input"
  | "ujian.wawancara.manage"
  // Pengumuman
  | "pengumuman.manage"
  | "pengumuman.broadcast"
  // Sistem
  | "sistem.settings"
  | "sistem.backup"
  | "sistem.audit_log"
  // Portal Calon Mahasiswa
  | "portal.biodata.manage"
  | "portal.berkas.upload"
  | "portal.pembayaran.upload"
  | "portal.status.view"
  | "portal.ujian.ikut"
  | "portal.dokumen.cetak";

export interface User {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}
