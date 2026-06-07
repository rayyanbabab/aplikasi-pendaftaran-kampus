"use client"

import { useRegistration } from "@/contexts/registration-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { DocumentUploadCard } from "@/components/berkas/document-upload-card"

export default function BerkasPage() {
  const { registration } = useRegistration()

  if (!registration) return null

  // Calculate completion for documents
  const requiredDocs = registration.documents.filter((d) => d.required)
  const uploadedDocs = requiredDocs.filter((d) => d.file && d.file.status !== "rejected")
  const documentProgress = requiredDocs.length > 0 ? (uploadedDocs.length / requiredDocs.length) * 100 : 0

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Upload Berkas</h1>
        <p className="text-muted-foreground">Unggah dokumen-dokumen yang diperlukan untuk pendaftaran</p>
      </div>

      {/* Progress Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Kelengkapan Dokumen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>
                {uploadedDocs.length} dari {requiredDocs.length} dokumen wajib
              </span>
              <span className="font-medium">{Math.round(documentProgress)}%</span>
            </div>
            <Progress value={documentProgress} className="h-2" />
          </div>
          <p className="text-xs text-muted-foreground">
            Lengkapi semua dokumen yang wajib diupload untuk dapat melanjutkan ke tahap selanjutnya
          </p>
        </CardContent>
      </Card>

      {/* Required Documents */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Dokumen Wajib</h2>
          <p className="text-sm text-muted-foreground">Semua dokumen dibawah ini harus diupload</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {registration.documents
            .filter((doc) => doc.required)
            .map((doc) => (
              <DocumentUploadCard key={doc.type} document={doc} />
            ))}
        </div>
      </div>

      {/* Optional Documents */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Dokumen Tambahan (Opsional)</h2>
          <p className="text-sm text-muted-foreground">
            Dokumen tambahan dapat meningkatkan peluang Anda untuk diterima
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {registration.documents
            .filter((doc) => !doc.required)
            .map((doc) => (
              <DocumentUploadCard key={doc.type} document={doc} />
            ))}
        </div>
      </div>
    </div>
  )
}
