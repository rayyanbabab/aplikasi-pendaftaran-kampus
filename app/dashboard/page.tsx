"use client"

import Link from "next/link"
import {
  User,
  FileText,
  School,
  CreditCard,
  ClipboardCheck,
  Printer,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  FileCheck,
} from "lucide-react"
import { useRegistration } from "@/contexts/registration-context"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const statusConfig: Record<string, { label: string; badgeVariant: "default" | "secondary" | "destructive" | "outline"; icon: React.ElementType; description: string }> = {
  draft: {
    label: "Draft Pendaftaran",
    badgeVariant: "secondary",
    icon: Clock,
    description: "Formulir pendaftaran sedang diisi. Lengkapi seluruh berkas untuk proses seleksi.",
  },
  menunggu_verifikasi: {
    label: "Menunggu Verifikasi",
    badgeVariant: "default",
    icon: Clock,
    description: "Dokumen pendaftaran Anda telah disubmit dan sedang diperiksa oleh panitia PMB.",
  },
  berkas_ditolak: {
    label: "Berkas Perlu Perbaikan",
    badgeVariant: "destructive",
    icon: AlertCircle,
    description: "Beberapa dokumen tidak sesuai standar. Silakan periksa catatan dan unggah ulang.",
  },
  berkas_diterima: {
    label: "Berkas Terverifikasi",
    badgeVariant: "default",
    icon: CheckCircle2,
    description: "Seluruh berkas persyaratan telah divalidasi. Anda siap mengikuti tahapan seleksi.",
  },
  lulus_seleksi: {
    label: "Diterima / Lulus Seleksi",
    badgeVariant: "default",
    icon: CheckCircle2,
    description: "Selamat! Anda dinyatakan lolos seleksi penerimaan mahasiswa baru.",
  },
  tidak_lulus: {
    label: "Belum Berhasil",
    badgeVariant: "destructive",
    icon: AlertCircle,
    description: "Mohon maaf, nilai seleksi belum memenuhi kuota. Anda dapat mencoba gelombang berikutnya.",
  },
  daftar_ulang: {
    label: "Masa Registrasi Ulang",
    badgeVariant: "default",
    icon: CheckCircle2,
    description: "Lakukan penetapan UKT dan pembayaran biaya registrasi ulang semester perdana.",
  },
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { registration, completionPercentage } = useRegistration()

  const status = registration?.status || "draft"
  const statusInfo = statusConfig[status] || statusConfig.draft
  const StatusIcon = statusInfo.icon

  // Calculate detailed progress per stage
  const docs = registration?.documents || []
  const requiredDocs = docs.filter((d) => d.required)
  const uploadedDocs = requiredDocs.filter((d) => d.file && d.file.status !== "rejected")
  const isDocsComplete = requiredDocs.length > 0 && uploadedDocs.length === requiredDocs.length

  const prodiCount = (registration?.pilihanProdi || []).length
  const isProdiComplete = prodiCount > 0

  const studentName = registration?.dataPribadi?.namaLengkap || registration?.biodata?.namaLengkap || user?.name
  const isBiodataComplete = Boolean(
    (registration?.dataPribadi?.namaLengkap || registration?.biodata?.namaLengkap) &&
    (registration?.dataPribadi?.nik || registration?.biodata?.nik) &&
    (registration?.dataSekolah?.namaSekolah || registration?.biodata?.asalSekolah)
  )

  const paymentStatus = registration?.pembayaran?.status || "unpaid"
  const isPaymentComplete = paymentStatus === "verified"

  // Determine next action for the student
  const getNextAction = () => {
    if (!isBiodataComplete) {
      return {
        title: "Lengkapi Biodata Calon Mahasiswa",
        desc: "Mohon mengisi data identitas diri, NIK, alamat domisili, dan asal sekolah.",
        href: "/dashboard/biodata",
        buttonText: "Isi Biodata Sekarang",
      }
    }
    if (!isProdiComplete) {
      return {
        title: "Tentukan Pilihan Program Studi",
        desc: "Pilih hingga maksimal 3 program studi dan jalur masuk yang Anda minati.",
        href: "/dashboard/kuliah",
        buttonText: "Pilih Program Studi",
      }
    }
    if (!isDocsComplete) {
      return {
        title: `Unggah Berkas Wajib (${uploadedDocs.length}/${requiredDocs.length} Lengkap)`,
        desc: "Masih terdapat dokumen persyaratan wajib yang belum diunggah atau perlu diperbaiki.",
        href: "/dashboard/berkas",
        buttonText: "Unggah Berkas Persyaratan",
      }
    }
    if (!isPaymentComplete) {
      return {
        title: "Konfirmasi Pembayaran Biaya Pendaftaran",
        desc: "Selesaikan pembayaran biaya formulir pendaftaran Rp 250.000 melalui Virtual Account atau QRIS.",
        href: "/dashboard/pembayaran",
        buttonText: "Lakukan Pembayaran",
      }
    }
    return {
      title: "Data Pendaftaran Lengkap",
      desc: "Seluruh tahapan administrasi telah Anda selesaikan. Pantau status seleksi dan cetak dokumen resmi.",
      href: "/dashboard/cetak",
      buttonText: "Cetak Kartu Peserta",
    }
  }

  const nextAction = getNextAction()

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Official Identity & Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            <GraduationCap className="h-4 w-4" />
            Portal Pendaftaran Mahasiswa Baru
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            Halo, {studentName || "Calon Mahasiswa Baru"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Tahun Akademik 2025/2026 • Universitas Nusantara
          </p>
        </div>

        {registration?.noPendaftaran && (
          <div className="rounded-lg bg-card border border-border p-3 text-right shrink-0">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
              Nomor Pendaftaran
            </p>
            <p className="font-mono font-bold text-base sm:text-lg text-foreground">
              {registration.noPendaftaran}
            </p>
          </div>
        )}
      </div>

      {/* Main Next Action Banner (Direct User Guidance) */}
      <Card className="border border-primary/20 bg-primary/5 shadow-xs overflow-hidden">
        <CardContent className="p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Aksi Berikutnya yang Perlu Dilakukan
              </p>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-serif text-foreground">
              {nextAction.title}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {nextAction.desc}
            </p>
          </div>

          <Link href={nextAction.href} className="shrink-0 w-full sm:w-auto">
            <Button className="w-full sm:w-auto gap-2 text-xs font-semibold px-5">
              {nextAction.buttonText}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Registration Milestone Tracker (5 Core Stages) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-serif font-bold text-foreground">
            Kelengkapan Berkas & Tahapan Pendaftaran
          </h2>
          <span className="text-xs text-muted-foreground font-mono">
            {completionPercentage}% Selesai
          </span>
        </div>
        <Progress value={completionPercentage} className="h-2" />

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {/* Step 1: Biodata */}
          <Link href="/dashboard/biodata" className="block group">
            <div className={cn(
              "p-3.5 rounded-lg border text-left transition-all h-full flex flex-col justify-between",
              isBiodataComplete
                ? "bg-card border-border hover:border-primary/40"
                : "bg-secondary/40 border-border hover:border-primary/40"
            )}>
              <div>
                <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">
                  Tahap 01
                </span>
                <p className="text-xs font-semibold text-foreground mt-0.5 group-hover:text-primary transition-colors">
                  Biodata Siswa
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-[11px]">
                {isBiodataComplete ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="text-emerald-700 font-medium">Lengkap</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                    <span className="text-amber-700 font-medium">Belum Lengkap</span>
                  </>
                )}
              </div>
            </div>
          </Link>

          {/* Step 2: Prodi */}
          <Link href="/dashboard/kuliah" className="block group">
            <div className={cn(
              "p-3.5 rounded-lg border text-left transition-all h-full flex flex-col justify-between",
              isProdiComplete
                ? "bg-card border-border hover:border-primary/40"
                : "bg-secondary/40 border-border hover:border-primary/40"
            )}>
              <div>
                <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">
                  Tahap 02
                </span>
                <p className="text-xs font-semibold text-foreground mt-0.5 group-hover:text-primary transition-colors">
                  Pilihan Kuliah
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-[11px]">
                {isProdiComplete ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="text-emerald-700 font-medium">{prodiCount} Prodi</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                    <span className="text-amber-700 font-medium">Pilih Prodi</span>
                  </>
                )}
              </div>
            </div>
          </Link>

          {/* Step 3: Berkas */}
          <Link href="/dashboard/berkas" className="block group">
            <div className={cn(
              "p-3.5 rounded-lg border text-left transition-all h-full flex flex-col justify-between",
              isDocsComplete
                ? "bg-card border-border hover:border-primary/40"
                : "bg-secondary/40 border-border hover:border-primary/40"
            )}>
              <div>
                <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">
                  Tahap 03
                </span>
                <p className="text-xs font-semibold text-foreground mt-0.5 group-hover:text-primary transition-colors">
                  Upload Dokumen
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-[11px]">
                {isDocsComplete ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="text-emerald-700 font-medium">Lengkap ({uploadedDocs.length})</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                    <span className="text-amber-700 font-medium">{uploadedDocs.length}/{requiredDocs.length} Dokumen</span>
                  </>
                )}
              </div>
            </div>
          </Link>

          {/* Step 4: Pembayaran */}
          <Link href="/dashboard/pembayaran" className="block group">
            <div className={cn(
              "p-3.5 rounded-lg border text-left transition-all h-full flex flex-col justify-between",
              isPaymentComplete
                ? "bg-card border-border hover:border-primary/40"
                : "bg-secondary/40 border-border hover:border-primary/40"
            )}>
              <div>
                <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">
                  Tahap 04
                </span>
                <p className="text-xs font-semibold text-foreground mt-0.5 group-hover:text-primary transition-colors">
                  Biaya Formulir
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-[11px]">
                {paymentStatus === "verified" ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="text-emerald-700 font-medium">Lunas</span>
                  </>
                ) : paymentStatus === "pending" ? (
                  <>
                    <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                    <span className="text-amber-700 font-medium">Verifikasi</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span className="text-slate-600 font-medium">Belum Bayar</span>
                  </>
                )}
              </div>
            </div>
          </Link>

          {/* Step 5: Status & Cetak */}
          <Link href="/dashboard/status" className="block group col-span-2 sm:col-span-1">
            <div className="p-3.5 rounded-lg border bg-card border-border hover:border-primary/40 text-left transition-all h-full flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">
                  Tahap 05
                </span>
                <p className="text-xs font-semibold text-foreground mt-0.5 group-hover:text-primary transition-colors">
                  Status & Ujian
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-[11px]">
                <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="text-foreground font-medium truncate">{statusInfo.label}</span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Official Status Card & Quick Navigation Section */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Status Detail Card */}
        <Card className="lg:col-span-5 border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-serif">Status Pendaftaran Terkini</CardTitle>
            <CardDescription className="text-xs">Informasi evaluasi admisi oleh panitia seleksi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-secondary/40 border border-border">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg border border-border bg-card text-foreground/85 flex items-center justify-center shrink-0 mt-0.5">
                  <StatusIcon className="h-5 w-5" />
                </div>
                <div>
                  <Badge variant={statusInfo.badgeVariant} className="text-xs mb-1">
                    {statusInfo.label}
                  </Badge>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {statusInfo.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Tahun Akademik:</span>
                <span className="font-semibold text-foreground">2025/2026 Ganjil</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Pilihan Program Studi 1:</span>
                <span className="font-semibold text-foreground">
                  {registration?.pilihanProdi?.[0] ? "Terdaftar" : "Belum Memilih"}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Dokumen Wajib:</span>
                <span className="font-semibold text-foreground">
                  {uploadedDocs.length} dari {requiredDocs.length} terunggah
                </span>
              </div>
            </div>

            <Link href="/dashboard/status" className="block pt-2">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Lihat Detail Riwayat Status
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quick Menu Grid */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-serif font-bold text-foreground">
              Menu Formulir Calon Mahasiswa
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-3.5">
            {[
              {
                href: "/dashboard/biodata",
                title: "Lengkapi Biodata",
                desc: "Data diri, orang tua, dan riwayat sekolah",
                icon: User,
              },
              {
                href: "/dashboard/kuliah",
                title: "Pilihan Program Studi",
                desc: "Fakultas, program studi, dan jalur masuk",
                icon: School,
              },
              {
                href: "/dashboard/berkas",
                title: "Unggah Dokumen",
                desc: "Pas foto, KTP, KK, dan ijazah/SKL",
                icon: FileText,
              },
              {
                href: "/dashboard/pembayaran",
                title: "Pembayaran Registrasi",
                desc: "Virtual account dan verifikasi bukti transfer",
                icon: CreditCard,
              },
              {
                href: "/dashboard/cetak",
                title: "Cetak Dokumen Pendaftaran",
                desc: "Unduh formulir registrasi dan kartu ujian",
                icon: Printer,
              },
              {
                href: "/rekomendasi",
                title: "Rekomendasi Penjurusan",
                desc: "Konsultasi kecocokan nilai dan prodi",
                icon: GraduationCap,
              },
            ].map((menu) => (
              <Link key={menu.href} href={menu.href} className="block group">
                <Card className="h-full border border-border bg-card hover:border-primary/40 hover:bg-secondary/20 transition-colors">
                  <CardContent className="p-4 flex items-start gap-3.5">
                    <div className="h-9 w-9 rounded-lg border border-border bg-secondary text-foreground/80 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                      <menu.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                        {menu.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                        {menu.desc}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/60 shrink-0 self-center" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
