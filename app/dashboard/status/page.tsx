"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRegistration } from "@/contexts/registration-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Award,
  FileText,
  Info,
  ArrowRight,
  RefreshCw,
  Printer,
  Calendar,
  ShieldCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"

const statusConfig = {
  draft: {
    label: "Draft Pendaftaran",
    description: "Formulir pendaftaran belum disubmit secara final.",
    icon: FileText,
    badgeColor: "bg-secondary text-secondary-foreground border-border",
    ringColor: "text-muted-foreground",
  },
  menunggu_verifikasi: {
    label: "Menunggu Verifikasi Berkas",
    description: "Dokumen pendaftaran Anda sedang dalam antrean verifikasi tim admisi.",
    icon: Clock,
    badgeColor: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    ringColor: "text-blue-600",
  },
  berkas_ditolak: {
    label: "Berkas Perlu Perbaikan",
    description: "Beberapa dokumen tidak memenuhi persyaratan resmi. Silakan unggah ulang.",
    icon: AlertCircle,
    badgeColor: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
    ringColor: "text-red-600",
  },
  berkas_diterima: {
    label: "Berkas Terverifikasi",
    description: "Seluruh berkas persyaratan telah divalidasi. Anda berhak mengikuti tahapan seleksi.",
    icon: CheckCircle2,
    badgeColor: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    ringColor: "text-emerald-600",
  },
  lulus_seleksi: {
    label: "Dinyatakan Lolos Seleksi",
    description: "Selamat! Anda dinyatakan diterima sebagai calon mahasiswa baru.",
    icon: Award,
    badgeColor: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    ringColor: "text-emerald-600",
  },
  tidak_lulus: {
    label: "Belum Memenuhi Kuota",
    description: "Nilai seleksi Anda belum memenuhi kuota program studi pilihan pada gelombang ini.",
    icon: XCircle,
    badgeColor: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
    ringColor: "text-red-600",
  },
  daftar_ulang: {
    label: "Masa Registrasi Ulang",
    description: "Silakan selesaikan pembayaran biaya UKT semester 1 untuk penetapan NIM resmi.",
    icon: CheckCircle2,
    badgeColor: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    ringColor: "text-amber-600",
  },
}

const statusTimeline = [
  { id: "draft", label: "Pengisian Formulir", order: 1, desc: "Biodata, pilihan prodi, dan upload berkas persyaratan" },
  { id: "menunggu_verifikasi", label: "Verifikasi Berkas", order: 2, desc: "Pemeriksaan keabsahan dokumen oleh panitia PMB" },
  { id: "berkas_diterima", label: "Pelaksanaan Ujian / CBT", order: 3, desc: "Ujian seleksi berbasis komputer daring atau luring" },
  { id: "lulus_seleksi", label: "Pengumuman Kelulusan", order: 4, desc: "Penerbitan Surat Keputusan Penerimaan Mahasiswa Baru" },
  { id: "daftar_ulang", label: "Registrasi Ulang & UKT", order: 5, desc: "Pembayaran UKT perdana dan penerbitan NIM" },
]

export default function StatusPage() {
  const { registration } = useRegistration()
  const [isRefreshing, setIsRefreshing] = useState(false)

  if (!registration) return null

  const currentStatus = registration.status || "draft"
  const config = statusConfig[currentStatus as keyof typeof statusConfig] || statusConfig.draft
  const Icon = config.icon

  // Determine progress
  const currentOrder = statusTimeline.findIndex((s) => s.id === currentStatus) + 1

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 800)
  }

  return (
    <div className="space-y-8 p-6 sm:p-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            <ShieldCheck className="h-4 w-4" />
            Sistem Informasi Admisi
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            Status Seleksi & Kelulusan
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Pantau perkembangan verifikasi berkas dan pengumuman hasil seleksi secara real-time.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-2 text-xs self-start sm:self-auto"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
          Muat Ulang Status
        </Button>
      </div>

      {/* Current Status Banner */}
      <Card className="border border-border shadow-xs overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-border">
            <div className="flex items-start gap-4">
              <div className={cn("rounded-2xl p-3.5 border", config.badgeColor)}>
                <Icon className="h-7 w-7" />
              </div>
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <Badge variant="outline" className={cn("text-xs font-semibold", config.badgeColor)}>
                    {config.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">T.A. 2025/2026</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-foreground">
                  {config.description}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Pendaftar: <span className="font-semibold text-foreground">{registration?.dataPribadi?.namaLengkap || registration?.biodata?.namaLengkap || "Calon Mahasiswa"}</span>
                </p>
              </div>
            </div>

            {registration.noPendaftaran && (
              <div className="rounded-xl bg-secondary/50 border border-border p-4 text-left sm:text-right shrink-0 w-full md:w-auto">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
                  Nomor Pendaftaran
                </p>
                <p className="text-lg font-bold font-mono text-primary mt-0.5">
                  {registration.noPendaftaran}
                </p>
              </div>
            )}
          </div>

          {/* Conditional Guidance Alerts */}
          <div className="pt-6">
            {currentStatus === "berkas_ditolak" && (
              <Alert variant="destructive" className="border-destructive/30">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs sm:text-sm">
                  <p className="font-semibold mb-1">Catatan Tim Verifikator:</p>
                  <p>Dokumen pindaian Kartu Keluarga atau Ijazah buram atau tidak terbaca. Silakan menuju menu Unggah Berkas untuk mengunggah dokumen perbaikan.</p>
                  <div className="mt-3">
                    <Link href="/dashboard/berkas">
                      <Button size="sm" variant="destructive" className="text-xs gap-1.5">
                        Perbaiki Dokumen Sekarang
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {currentStatus === "lulus_seleksi" && (
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-5 text-emerald-950 dark:text-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="font-serif font-bold text-base sm:text-lg text-emerald-900 dark:text-emerald-200">
                    Selamat! Anda Dinyatakan Lolos Seleksi PMB
                  </p>
                  <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 mt-1">
                    SK Kelulusan Rektor telah diterbitkan. Unduh Surat Penerimaan Resmi (Letter of Acceptance) dan selesaikan tahapan registrasi ulang.
                  </p>
                </div>
                <Link href="/dashboard/cetak" className="shrink-0">
                  <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs gap-2">
                    <Printer className="h-3.5 w-3.5" />
                    Cetak Bukti Diterima
                  </Button>
                </Link>
              </div>
            )}

            {currentStatus === "draft" && (
              <div className="rounded-xl bg-secondary/50 border border-border p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-sm text-foreground">
                    Formulir Pendaftaran Belum Lengkap
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Lengkapi biodata diri, tentukan program studi pilihan, dan unggah dokumen pendukung agar dapat diproses oleh panitia.
                  </p>
                </div>
                <Link href="/dashboard/biodata" className="shrink-0">
                  <Button size="sm" className="text-xs gap-1.5 font-semibold">
                    Lengkapi Biodata
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Structured Admission Milestones (Interactive Progression) */}
      <Card className="border border-border shadow-xs">
        <CardHeader>
          <CardTitle className="text-lg font-serif">Alur Tahapan Seleksi Masuk</CardTitle>
          <CardDescription className="text-xs">
            Rangkaian proses seleksi dari pendaftaran awal hingga penerbitan Nomor Induk Mahasiswa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {statusTimeline.map((step, index) => {
              const isPast = step.order < currentOrder
              const isCurrent = step.id === currentStatus || (step.order === currentOrder)
              const isFuture = step.order > currentOrder

              return (
                <div key={step.id} className="flex gap-4 items-start">
                  {/* Step Marker */}
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-mono font-bold transition-colors",
                        isPast
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : isCurrent
                          ? "border-primary bg-primary text-primary-foreground shadow-xs ring-4 ring-primary/10"
                          : "border-border bg-card text-muted-foreground"
                      )}
                    >
                      {isPast ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        step.order
                      )}
                    </div>
                    {index < statusTimeline.length - 1 && (
                      <div
                        className={cn(
                          "w-0.5 h-12 my-1 transition-colors",
                          isPast ? "bg-emerald-600" : "bg-border"
                        )}
                      />
                    )}
                  </div>

                  {/* Step Description */}
                  <div className="flex-1 pt-1 pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <h4
                        className={cn(
                          "font-bold text-sm",
                          isCurrent ? "text-primary" : isPast ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {step.label}
                      </h4>
                      {isCurrent && (
                        <Badge variant="outline" className="text-[10px] py-0 border-primary/30 text-primary">
                          Tahap Aktif
                        </Badge>
                      )}
                      {isPast && (
                        <Badge variant="secondary" className="text-[10px] py-0 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30">
                          Selesai
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
