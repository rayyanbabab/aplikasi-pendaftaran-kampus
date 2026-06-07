import type { Fakultas, ProgramStudi, Gelombang, DocumentUpload } from "@/types/registration"

export const FAKULTAS_LIST: Fakultas[] = [
  {
    id: "fk",
    nama: "Fakultas Kedokteran",
    kode: "FK",
    deskripsi: "Menghasilkan dokter profesional dan peneliti medis berkualitas",
    icon: "Stethoscope",
  },
  {
    id: "ft",
    nama: "Fakultas Teknik",
    kode: "FT",
    deskripsi: "Mencetak insinyur handal dan inovatif untuk pembangunan bangsa",
    icon: "Wrench",
  },
  {
    id: "feb",
    nama: "Fakultas Ekonomi & Bisnis",
    kode: "FEB",
    deskripsi: "Membentuk pemimpin bisnis dan ekonom masa depan",
    icon: "TrendingUp",
  },
  {
    id: "fh",
    nama: "Fakultas Hukum",
    kode: "FH",
    deskripsi: "Mendidik praktisi hukum berintegritas tinggi",
    icon: "Scale",
  },
  {
    id: "fikom",
    nama: "Fakultas Ilmu Komunikasi",
    kode: "FIKOM",
    deskripsi: "Mengembangkan profesional komunikasi dan media",
    icon: "Radio",
  },
  {
    id: "fkip",
    nama: "Fakultas Keguruan & Ilmu Pendidikan",
    kode: "FKIP",
    deskripsi: "Menyiapkan pendidik berkualitas untuk Indonesia",
    icon: "GraduationCap",
  },
  {
    id: "fmipa",
    nama: "Fakultas MIPA",
    kode: "FMIPA",
    deskripsi: "Pusat riset dan pengembangan sains dasar",
    icon: "Atom",
  },
  {
    id: "fisip",
    nama: "Fakultas Ilmu Sosial & Politik",
    kode: "FISIP",
    deskripsi: "Melahirkan ahli sosial dan politik berwawasan global",
    icon: "Users",
  },
]

export const PRODI_LIST: ProgramStudi[] = [
  // Fakultas Kedokteran
  {
    id: "kedokteran",
    fakultasId: "fk",
    nama: "Pendidikan Dokter",
    kode: "KD",
    jenjang: "S1",
    akreditasi: "Unggul",
    biayaRegistrasi: 500000,
    biayaSpp: 25000000,
    kuota: 100,
    deskripsi: "Program studi untuk menjadi dokter umum profesional",
  },
  {
    id: "keperawatan",
    fakultasId: "fk",
    nama: "Ilmu Keperawatan",
    kode: "KP",
    jenjang: "S1",
    akreditasi: "A",
    biayaRegistrasi: 350000,
    biayaSpp: 12000000,
    kuota: 150,
    deskripsi: "Membentuk perawat profesional berstandar internasional",
  },
  // Fakultas Teknik
  {
    id: "teknik-informatika",
    fakultasId: "ft",
    nama: "Teknik Informatika",
    kode: "TI",
    jenjang: "S1",
    akreditasi: "Unggul",
    biayaRegistrasi: 400000,
    biayaSpp: 15000000,
    kuota: 200,
    deskripsi: "Program studi teknologi informasi dan pengembangan software",
  },
  {
    id: "teknik-sipil",
    fakultasId: "ft",
    nama: "Teknik Sipil",
    kode: "TS",
    jenjang: "S1",
    akreditasi: "A",
    biayaRegistrasi: 400000,
    biayaSpp: 14000000,
    kuota: 150,
    deskripsi: "Membangun infrastruktur dan konstruksi berkualitas",
  },
  {
    id: "teknik-elektro",
    fakultasId: "ft",
    nama: "Teknik Elektro",
    kode: "TE",
    jenjang: "S1",
    akreditasi: "A",
    biayaRegistrasi: 400000,
    biayaSpp: 14000000,
    kuota: 120,
    deskripsi: "Pengembangan sistem kelistrikan dan elektronika",
  },
  {
    id: "teknik-mesin",
    fakultasId: "ft",
    nama: "Teknik Mesin",
    kode: "TM",
    jenjang: "S1",
    akreditasi: "A",
    biayaRegistrasi: 400000,
    biayaSpp: 14000000,
    kuota: 120,
    deskripsi: "Desain dan manufaktur sistem mekanik",
  },
  // Fakultas Ekonomi & Bisnis
  {
    id: "manajemen",
    fakultasId: "feb",
    nama: "Manajemen",
    kode: "MN",
    jenjang: "S1",
    akreditasi: "Unggul",
    biayaRegistrasi: 350000,
    biayaSpp: 13000000,
    kuota: 250,
    deskripsi: "Mengelola organisasi dan bisnis secara profesional",
  },
  {
    id: "akuntansi",
    fakultasId: "feb",
    nama: "Akuntansi",
    kode: "AK",
    jenjang: "S1",
    akreditasi: "Unggul",
    biayaRegistrasi: 350000,
    biayaSpp: 13000000,
    kuota: 200,
    deskripsi: "Profesi akuntan dan audit berkualitas",
  },
  {
    id: "ekonomi-pembangunan",
    fakultasId: "feb",
    nama: "Ekonomi Pembangunan",
    kode: "EP",
    jenjang: "S1",
    akreditasi: "A",
    biayaRegistrasi: 350000,
    biayaSpp: 12000000,
    kuota: 100,
    deskripsi: "Analisis ekonomi dan perencanaan pembangunan",
  },
  // Fakultas Hukum
  {
    id: "ilmu-hukum",
    fakultasId: "fh",
    nama: "Ilmu Hukum",
    kode: "IH",
    jenjang: "S1",
    akreditasi: "A",
    biayaRegistrasi: 350000,
    biayaSpp: 12000000,
    kuota: 180,
    deskripsi: "Pendidikan hukum untuk praktisi dan akademisi",
  },
  // Fakultas Ilmu Komunikasi
  {
    id: "ilmu-komunikasi",
    fakultasId: "fikom",
    nama: "Ilmu Komunikasi",
    kode: "IK",
    jenjang: "S1",
    akreditasi: "A",
    biayaRegistrasi: 350000,
    biayaSpp: 12000000,
    kuota: 200,
    deskripsi: "Komunikasi massa dan media digital",
  },
  {
    id: "jurnalistik",
    fakultasId: "fikom",
    nama: "Jurnalistik",
    kode: "JR",
    jenjang: "S1",
    akreditasi: "A",
    biayaRegistrasi: 350000,
    biayaSpp: 11000000,
    kuota: 100,
    deskripsi: "Jurnalisme profesional dan media",
  },
  // FKIP
  {
    id: "pgsd",
    fakultasId: "fkip",
    nama: "Pendidikan Guru SD",
    kode: "PGSD",
    jenjang: "S1",
    akreditasi: "A",
    biayaRegistrasi: 300000,
    biayaSpp: 10000000,
    kuota: 200,
    deskripsi: "Guru sekolah dasar profesional",
  },
  {
    id: "pend-matematika",
    fakultasId: "fkip",
    nama: "Pendidikan Matematika",
    kode: "PM",
    jenjang: "S1",
    akreditasi: "A",
    biayaRegistrasi: 300000,
    biayaSpp: 10000000,
    kuota: 100,
    deskripsi: "Guru matematika berkualitas",
  },
  // FMIPA
  {
    id: "matematika",
    fakultasId: "fmipa",
    nama: "Matematika",
    kode: "MT",
    jenjang: "S1",
    akreditasi: "A",
    biayaRegistrasi: 350000,
    biayaSpp: 11000000,
    kuota: 80,
    deskripsi: "Riset matematika murni dan terapan",
  },
  {
    id: "fisika",
    fakultasId: "fmipa",
    nama: "Fisika",
    kode: "FS",
    jenjang: "S1",
    akreditasi: "A",
    biayaRegistrasi: 350000,
    biayaSpp: 11000000,
    kuota: 80,
    deskripsi: "Ilmu fisika dan aplikasinya",
  },
  // FISIP
  {
    id: "ilmu-politik",
    fakultasId: "fisip",
    nama: "Ilmu Politik",
    kode: "IP",
    jenjang: "S1",
    akreditasi: "A",
    biayaRegistrasi: 350000,
    biayaSpp: 11000000,
    kuota: 100,
    deskripsi: "Politik dan pemerintahan",
  },
  {
    id: "hubungan-internasional",
    fakultasId: "fisip",
    nama: "Hubungan Internasional",
    kode: "HI",
    jenjang: "S1",
    akreditasi: "A",
    biayaRegistrasi: 350000,
    biayaSpp: 12000000,
    kuota: 100,
    deskripsi: "Diplomasi dan hubungan antar negara",
  },
]

export const GELOMBANG_LIST: Gelombang[] = [
  {
    id: "gel-1-2025",
    nama: "Gelombang 1 - 2025/2026",
    tanggalBuka: "2025-01-02",
    tanggalTutup: "2025-03-31",
    tanggalUjian: "2025-04-15",
    tanggalPengumuman: "2025-04-30",
    kuota: 500,
    isActive: false,
  },
  {
    id: "gel-2-2025",
    nama: "Gelombang 2 - 2025/2026",
    tanggalBuka: "2025-04-01",
    tanggalTutup: "2025-06-30",
    tanggalUjian: "2025-07-10",
    tanggalPengumuman: "2025-07-25",
    kuota: 400,
    isActive: true,
  },
  {
    id: "gel-3-2025",
    nama: "Gelombang 3 - 2025/2026",
    tanggalBuka: "2025-07-01",
    tanggalTutup: "2025-08-15",
    tanggalUjian: "2025-08-25",
    tanggalPengumuman: "2025-09-05",
    kuota: 300,
    isActive: false,
  },
]

export const JALUR_MASUK = [
  {
    id: "snbp",
    nama: "SNBP",
    fullName: "Seleksi Nasional Berdasarkan Prestasi",
    deskripsi: "Seleksi berdasarkan prestasi akademik dan non-akademik tanpa tes",
    syarat: ["Siswa SMA/SMK/MA kelas 12", "Nilai rapor semester 1-5", "Prestasi akademik/non-akademik"],
  },
  {
    id: "snbt",
    nama: "SNBT",
    fullName: "Seleksi Nasional Berdasarkan Tes",
    deskripsi: "Seleksi melalui ujian tertulis berbasis komputer",
    syarat: ["Lulusan SMA/SMK/MA tahun 2023-2025", "Mengikuti UTBK", "Skor UTBK minimum"],
  },
  {
    id: "mandiri",
    nama: "Mandiri",
    fullName: "Seleksi Mandiri Universitas",
    deskripsi: "Seleksi yang diselenggarakan secara mandiri oleh universitas",
    syarat: ["Lulusan SMA/SMK/MA", "Mengikuti tes mandiri", "Memenuhi passing grade"],
  },
  {
    id: "prestasi",
    nama: "Jalur Prestasi",
    fullName: "Seleksi Jalur Prestasi",
    deskripsi: "Seleksi khusus bagi siswa berprestasi tingkat nasional/internasional",
    syarat: ["Juara 1-3 tingkat nasional/internasional", "Sertifikat prestasi asli", "Rekomendasi sekolah"],
  },
  {
    id: "kip",
    nama: "KIP-Kuliah",
    fullName: "Kartu Indonesia Pintar Kuliah",
    deskripsi: "Program bantuan biaya pendidikan bagi mahasiswa kurang mampu",
    syarat: ["Keluarga kurang mampu", "Memiliki KIP atau surat keterangan", "Lulus seleksi akademik"],
  },
]

export const AGAMA_LIST = [
  "Islam",
  "Kristen",
  "Katolik",
  "Hindu",
  "Buddha",
  "Konghucu",
]

export const PENDIDIKAN_LIST = [
  "SD/Sederajat",
  "SMP/Sederajat",
  "SMA/Sederajat",
  "D1",
  "D2",
  "D3",
  "D4/S1",
  "S2",
  "S3",
]

export const PEKERJAAN_LIST = [
  "PNS",
  "TNI/Polri",
  "Pegawai Swasta",
  "Wiraswasta",
  "Petani",
  "Nelayan",
  "Buruh",
  "Pensiunan",
  "Tidak Bekerja",
  "Lainnya",
]

export const PENGHASILAN_LIST = [
  "< Rp 1.000.000",
  "Rp 1.000.000 - Rp 3.000.000",
  "Rp 3.000.000 - Rp 5.000.000",
  "Rp 5.000.000 - Rp 10.000.000",
  "> Rp 10.000.000",
]

export const INITIAL_DOCUMENTS: DocumentUpload[] = [
  {
    type: "foto",
    label: "Pas Foto 3x4",
    required: true,
    allowedFormats: ["image/jpeg", "image/png"],
    maxSize: 2,
  },
  {
    type: "ktp",
    label: "KTP / Kartu Identitas",
    required: true,
    allowedFormats: ["image/jpeg", "image/png", "application/pdf"],
    maxSize: 5,
  },
  {
    type: "kk",
    label: "Kartu Keluarga",
    required: true,
    allowedFormats: ["image/jpeg", "image/png", "application/pdf"],
    maxSize: 5,
  },
  {
    type: "ijazah",
    label: "Ijazah / SKL",
    required: true,
    allowedFormats: ["image/jpeg", "image/png", "application/pdf"],
    maxSize: 5,
  },
  {
    type: "rapor",
    label: "Rapor Semester 1-5",
    required: true,
    allowedFormats: ["image/jpeg", "image/png", "application/pdf"],
    maxSize: 10,
  },
  {
    type: "sertifikat",
    label: "Sertifikat Prestasi (Opsional)",
    required: false,
    allowedFormats: ["image/jpeg", "image/png", "application/pdf"],
    maxSize: 10,
  },
]

export const BANK_LIST = [
  { code: "BCA", name: "Bank Central Asia" },
  { code: "BNI", name: "Bank Negara Indonesia" },
  { code: "BRI", name: "Bank Rakyat Indonesia" },
  { code: "Mandiri", name: "Bank Mandiri" },
  { code: "BSI", name: "Bank Syariah Indonesia" },
]

export const EWALLET_LIST = [
  { id: "gopay", name: "GoPay" },
  { id: "ovo", name: "OVO" },
  { id: "dana", name: "DANA" },
  { id: "shopeepay", name: "ShopeePay" },
  { id: "linkaja", name: "LinkAja" },
]

export function generateNoPendaftaran(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, "0")
  return `PMB${year}${random}`
}

export function generateVirtualAccount(bankCode: string): string {
  const prefix = bankCode === "BCA" ? "1234" : bankCode === "BNI" ? "8810" : bankCode === "BRI" ? "0023" : "8899"
  const random = Math.floor(Math.random() * 10000000000).toString().padStart(10, "0")
  return prefix + random
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}
