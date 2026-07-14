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
} from "lucide-react"
import { useRegistration } from "@/contexts/registration-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  draft: { label: "Draft", color: "bg-secondary text-secondary-foreground", icon: Clock },
  menunggu_verifikasi: { label: "Menunggu Verifikasi", color: "bg-amber-100 text-amber-800", icon: Clock },
  berkas_ditolak: { label: "Berkas Ditolak", color: "bg-red-100 text-red-800", icon: AlertCircle },
  berkas_diterima: { label: "Berkas Diterima", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
  lulus_seleksi: { label: "Lulus Seleksi", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
  tidak_lulus: { label: "Tidak Lulus", color: "bg-red-100 text-red-800", icon: AlertCircle },
  daftar_ulang: { label: "Daftar Ulang", color: "bg-primary/10 text-primary", icon: CheckCircle2 },
}

const quickActions = [
  { href: "/dashboard/biodata", label: "Lengkapi Biodata", icon: User, description: "Data pribadi, orang tua, sekolah" },
  { href: "/dashboard/berkas", label: "Upload Berkas", icon: FileText, description: "Foto, KTP, Ijazah, dll" },
  { href: "/dashboard/kuliah", label: "Pilih Program Studi", icon: School, description: "Fakultas dan jurusan" },
  { href: "/dashboard/pembayaran", label: "Pembayaran", icon: CreditCard, description: "Biaya pendaftaran" },
  { href: "/dashboard/status", label: "Cek Status", icon: ClipboardCheck, description: "Status pendaftaran" },
  { href: "/dashboard/cetak", label: "Cetak Dokumen", icon: Printer, description: "Formulir dan kartu" },
]

export default function DashboardPage() {
  const { registration, completionPercentage } = useRegistration()

  const status = registration?.status || "draft"
  const statusInfo = statusConfig[status]
  const StatusIcon = statusInfo.icon

  // Calculate section completion
  const getDocumentProgress = () => {
    if (!registration) return 0
    const docs = registration.documents || []
    const requiredDocs = docs.filter((d) => d.required)
    const uploadedDocs = requiredDocs.filter((d) => d.file)
    return requiredDocs.length > 0 ? Math.round((uploadedDocs.length / requiredDocs.length) * 100) : 0
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Selamat datang di Portal Pendaftaran Mahasiswa Baru</p>
      </div>

      {/* Status Overview */}
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Status Pendaftaran</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", statusInfo.color)}>
                <StatusIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">{statusInfo.label}</p>
                {registration?.noPendaftaran && (
                  <p className="text-xs text-muted-foreground">No: {registration.noPendaftaran}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Progress Pendaftaran</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">{completionPercentage}%</span>
                  <span className="text-muted-foreground">Selesai</span>
                </div>
                <Progress value={completionPercentage} className="h-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Berkas Upload</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">{getDocumentProgress()}%</span>
                  <span className="text-muted-foreground">Terupload</span>
                </div>
                <Progress value={getDocumentProgress()} className="h-3" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert for incomplete registration */}
      {completionPercentage < 100 && status === "draft" && (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-amber-800">Pendaftaran Belum Lengkap</p>
              <p className="text-sm text-amber-700">
                Lengkapi semua data dan upload berkas untuk menyelesaikan pendaftaran.
              </p>
            </div>
            <Button asChild size="sm">
              <Link href="/dashboard/biodata">Lanjutkan</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="mb-4 text-lg font-semibold">Menu Cepat</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="h-full transition-colors hover:bg-secondary/50">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{action.label}</p>
                    <p className="truncate text-sm text-muted-foreground">{action.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity / Timeline */}
      {registration && (registration.statusHistory || []).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Riwayat Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(registration.statusHistory || []).slice(-5).reverse().map((item, index) => {
                const config = statusConfig[item.status]
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full", config.color)}>
                      <config.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{config.label}</p>
                      <p className="text-sm text-muted-foreground">{item.note}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.timestamp).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
