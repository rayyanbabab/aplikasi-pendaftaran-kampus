import type { Role, RoleType, Permission } from "@/types/roles";

// Definisi Role dengan permissions masing-masing
export const ROLES: Record<RoleType, Role> = {
  super_admin: {
    id: "super_admin",
    name: "Super Admin",
    description: "Akses penuh ke seluruh sistem termasuk pengaturan dan manajemen user",
    color: "bg-red-500",
    icon: "Shield",
    permissions: [
      // Semua permission
      "dashboard.view",
      "dashboard.analytics",
      "dashboard.executive",
      "users.view",
      "users.create",
      "users.edit",
      "users.delete",
      "roles.manage",
      "pmb.gelombang.manage",
      "pmb.jalur.manage",
      "pmb.kuota.manage",
      "pmb.tahun_akademik.manage",
      "pendaftar.view",
      "pendaftar.create",
      "pendaftar.edit",
      "pendaftar.delete",
      "pendaftar.export",
      "verifikasi.berkas.view",
      "verifikasi.berkas.approve",
      "verifikasi.berkas.reject",
      "keuangan.pembayaran.view",
      "keuangan.pembayaran.verify",
      "keuangan.laporan.view",
      "keuangan.laporan.export",
      "ujian.soal.manage",
      "ujian.jadwal.manage",
      "ujian.ruang.manage",
      "ujian.pengawas.manage",
      "ujian.nilai.view",
      "ujian.nilai.input",
      "ujian.wawancara.manage",
      "pengumuman.manage",
      "pengumuman.broadcast",
      "sistem.settings",
      "sistem.backup",
      "sistem.audit_log",
    ],
  },
  admin_pmb: {
    id: "admin_pmb",
    name: "Admin PMB",
    description: "Mengelola proses penerimaan mahasiswa baru secara keseluruhan",
    color: "bg-blue-500",
    icon: "UserCog",
    permissions: [
      "dashboard.view",
      "dashboard.analytics",
      "pmb.gelombang.manage",
      "pmb.jalur.manage",
      "pmb.kuota.manage",
      "pmb.tahun_akademik.manage",
      "pendaftar.view",
      "pendaftar.create",
      "pendaftar.edit",
      "pendaftar.delete",
      "pendaftar.export",
      "verifikasi.berkas.view",
      "verifikasi.berkas.approve",
      "verifikasi.berkas.reject",
      "ujian.jadwal.manage",
      "ujian.ruang.manage",
      "ujian.pengawas.manage",
      "ujian.nilai.view",
      "pengumuman.manage",
      "pengumuman.broadcast",
    ],
  },
  verifikator: {
    id: "verifikator",
    name: "Verifikator",
    description: "Memverifikasi kelengkapan dan keabsahan berkas pendaftar",
    color: "bg-green-500",
    icon: "CheckCircle",
    permissions: [
      "dashboard.view",
      "pendaftar.view",
      "verifikasi.berkas.view",
      "verifikasi.berkas.approve",
      "verifikasi.berkas.reject",
    ],
  },
  keuangan: {
    id: "keuangan",
    name: "Keuangan",
    description: "Mengelola verifikasi pembayaran dan laporan keuangan PMB",
    color: "bg-yellow-500",
    icon: "Wallet",
    permissions: [
      "dashboard.view",
      "pendaftar.view",
      "keuangan.pembayaran.view",
      "keuangan.pembayaran.verify",
      "keuangan.laporan.view",
      "keuangan.laporan.export",
    ],
  },
  penguji: {
    id: "penguji",
    name: "Penguji",
    description: "Mengelola soal ujian, penilaian, dan wawancara calon mahasiswa",
    color: "bg-purple-500",
    icon: "ClipboardList",
    permissions: [
      "dashboard.view",
      "pendaftar.view",
      "ujian.soal.manage",
      "ujian.jadwal.manage",
      "ujian.nilai.view",
      "ujian.nilai.input",
      "ujian.wawancara.manage",
    ],
  },
  calon_mahasiswa: {
    id: "calon_mahasiswa",
    name: "Calon Mahasiswa",
    description: "Mendaftar dan mengikuti proses seleksi penerimaan mahasiswa baru",
    color: "bg-cyan-500",
    icon: "GraduationCap",
    permissions: [
      "portal.biodata.manage",
      "portal.berkas.upload",
      "portal.pembayaran.upload",
      "portal.status.view",
      "portal.ujian.ikut",
      "portal.dokumen.cetak",
    ],
  },
};

// Helper functions

/**
 * Mendapatkan role berdasarkan ID
 */
export function getRole(roleId: RoleType): Role {
  return ROLES[roleId];
}

/**
 * Mendapatkan semua role sebagai array
 */
export function getAllRoles(): Role[] {
  return Object.values(ROLES);
}

/**
 * Mendapatkan role untuk admin/staff (bukan calon mahasiswa)
 */
export function getAdminRoles(): Role[] {
  return Object.values(ROLES).filter((role) => role.id !== "calon_mahasiswa");
}

/**
 * Mengecek apakah role memiliki permission tertentu
 */
export function hasPermission(roleId: RoleType, permission: Permission): boolean {
  const role = ROLES[roleId];
  return role.permissions.includes(permission);
}

/**
 * Mengecek apakah role memiliki salah satu dari permission yang diberikan
 */
export function hasAnyPermission(roleId: RoleType, permissions: Permission[]): boolean {
  const role = ROLES[roleId];
  return permissions.some((permission) => role.permissions.includes(permission));
}

/**
 * Mengecek apakah role memiliki semua permission yang diberikan
 */
export function hasAllPermissions(roleId: RoleType, permissions: Permission[]): boolean {
  const role = ROLES[roleId];
  return permissions.every((permission) => role.permissions.includes(permission));
}

/**
 * Mendapatkan warna badge berdasarkan role
 */
export function getRoleBadgeColor(roleId: RoleType): string {
  return ROLES[roleId].color;
}

/**
 * Mengecek apakah user adalah admin (bukan calon mahasiswa)
 */
export function isAdmin(roleId: RoleType): boolean {
  return roleId !== "calon_mahasiswa";
}

/**
 * Mengecek apakah user adalah super admin
 */
export function isSuperAdmin(roleId: RoleType): boolean {
  return roleId === "super_admin";
}
