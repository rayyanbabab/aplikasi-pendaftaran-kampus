"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"

const statusConfig = {
  draft: {
    label: "Draft",
    description: "Pendaftaran belum disubmit",
    icon: FileText,
    color: "bg-slate-100 text-slate-800",
    textColor: "text-slate-600",
  },
  menunggu_verifikasi: {
    label: "Menunggu Verifikasi",
    description: "Berkas Anda sedang diverifikasi",
    icon: Clock,
    color: "bg-blue-100 text-blue-800",
    textColor: "text-blue-600",
  },
  berkas_ditolak: {
    label: "Berkas Ditolak",
    description: "Berkas Anda ditolak, silakan upload ulang",
    icon: AlertCircle,
    color: "bg-red-100 text-red-800",
    textColor: "text-red-600",
  },
  berkas_diterima: {
    label: "Berkas Diterima",
    description: "Berkas Anda telah diterima",
    icon: CheckCircle2,
    color: "bg-green-100 text-green-800",
    textColor: "text-green-600",
  },
  lulus_seleksi: {
    label: "Lulus Seleksi",
    description: "Selamat! Anda lulus seleksi",
    icon: Award,
    color: "bg-emerald-100 text-emerald-800",
    textColor: "text-emerald-600",
  },
  tidak_lulus: {
    label: "Tidak Lulus",
    description: "Mohon maaf, Anda tidak lulus seleksi",
    icon: XCircle,
    color: "bg-red-100 text-red-800",
    textColor: "text-red-600",
  },
  daftar_ulang: {
    label: "Daftar Ulang",
    description: "Silakan lakukan daftar ulang",
    icon: FileText,
    color: "bg-amber-100 text-amber-800",
    textColor: "text-amber-600",
  },
}

const statusTimeline = [
  { id: "draft", label: "Mengisi Data", order: 1 },
  { id: "menunggu_verifikasi", label: "Verifikasi", order: 2 },
  { id: "berkas_diterima", label: "Berkas Diterima", order: 3 },
  { id: "lulus_seleksi", label: "Lulus Seleksi", order: 4 },
  { id: "daftar_ulang", label: "Daftar Ulang", order: 5 },
]

export default function StatusPage() {
  const { registration } = useRegistration()

  if (!registration) return null

  const currentStatus = registration.status
  const config = statusConfig[currentStatus as keyof typeof statusConfig]
  const Icon = config.icon

  // Determine progress
  const currentOrder = statusTimeline.findIndex((s) => s.id === currentStatus) + 1

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Status Pendaftaran</h1>
        <p className="text-muted-foreground">Pantau perkembangan status pendaftaran Anda</p>
      </div>

      {/* Current Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>Status Saat Ini</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-4">
            <div className={`rounded-full p-3 ${config.color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{config.label}</h2>
              <p className="text-muted-foreground">{config.description}</p>
            </div>
          </div>

          {/* Registration Number */}
          {registration.noPendaftaran && (
            <div className="rounded-lg bg-secondary/30 p-4">
              <p className="text-xs text-muted-foreground mb-1">Nomor Pendaftaran</p>
              <code className="text-lg font-mono font-semibold">{registration.noPendaftaran}</code>
            </div>
          )}

          {/* Rejection Details */}
          {currentStatus === "berkas_ditolak" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-semibold mb-1">Alasan Penolakan:</p>
                <p>Beberapa dokumen tidak sesuai dengan standar. Silakan upload ulang dokumen yang sesuai.</p>
              </AlertDescription>
            </Alert>
          )}

          {/* Success Message */}
          {currentStatus === "lulus_seleksi" && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <p className="font-semibold mb-1">Selamat!</p>
                <p>Anda telah diterima di program studi pilihan. Segera lakukan daftar ulang untuk menyelesaikan proses pendaftaran.</p>
              </AlertDescription>
            </Alert>
          )}

          {/* Not Passed Message */}
          {currentStatus === "tidak_lulus" && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-semibold mb-1">Mohon Maaf</p>
                <p>Anda tidak lulus dalam seleksi kali ini. Anda masih dapat mendaftar di gelombang berikutnya.</p>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Tahapan Pendaftaran</CardTitle>
          <CardDescription>Progres pendaftaran Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statusTimeline.map((step, index) => {
              const isActive = step.order <= currentOrder
              const isCurrent = step.id === currentStatus

              return (
                <div key={step.id} className="flex gap-4">
                  {/* Timeline line and dot */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30 bg-muted"
                      }`}
                    >
                      {isActive ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                      )}
                    </div>
                    {index < statusTimeline.length - 1 && (
                      <div
                        className={`w-0.5 h-12 transition-colors ${
                          isActive ? "bg-primary" : "bg-muted-foreground/20"
                        }`}
                      />
                    )}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2">
                      <p className={`font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.label}
                      </p>
                      {isCurrent && (
                        <Badge variant="default" className="text-xs">
                          Saat ini
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Status History */}
      {registration.statusHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Status</CardTitle>
            <CardDescription>Perubahan status pendaftaran Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {registration.statusHistory
                .slice()
                .reverse()
                .map((history, index) => {
                  const histConfig = statusConfig[history.status as keyof typeof statusConfig]
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-lg border p-3"
                    >
                      <div className={`rounded-full p-2 ${histConfig.color}`}>
                        <histConfig.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{histConfig.label}</p>
                        {history.note && (
                          <p className="text-sm text-muted-foreground mt-0.5">{history.note}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(history.timestamp).toLocaleDateString("id-ID", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
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

      {/* Next Steps */}
      {currentStatus !== "tidak_lulus" && currentStatus !== "daftar_ulang" && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-4 w-4" />
              Langkah Berikutnya
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3">
            {currentStatus === "draft" && (
              <div className="space-y-2">
                <p>Lengkapi semua tahapan pendaftaran berikut:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Isi data biodata lengkap</li>
                  <li>Upload dokumen yang diperlukan</li>
                  <li>Pilih program studi dan gelombang</li>
                  <li>Lakukan pembayaran biaya registrasi</li>
                  <li>Submit pendaftaran</li>
                </ul>
              </div>
            )}

            {currentStatus === "menunggu_verifikasi" && (
              <div className="space-y-2">
                <p>Pendaftaran Anda sedang diproses. Kami akan segera memverifikasi berkas Anda.</p>
                <p className="font-semibold">Estimasi: 3-5 hari kerja</p>
              </div>
            )}

            {currentStatus === "berkas_diterima" && (
              <div className="space-y-2">
                <p>Berkas Anda telah diterima. Tunggu pengumuman hasil seleksi.</p>
                <p className="text-muted-foreground">Jadwal pengumuman akan ditampilkan di halaman ini.</p>
              </div>
            )}

            {currentStatus === "lulus_seleksi" && (
              <div className="space-y-2">
                <p>Anda lulus seleksi! Segera lakukan daftar ulang untuk menyelesaikan proses pendaftaran.</p>
                <p className="text-muted-foreground">Batas waktu daftar ulang hingga akhir Agustus 2025.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
