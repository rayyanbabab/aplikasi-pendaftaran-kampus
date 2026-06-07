"use client"

import { useState, useRef } from "react"
import { Upload, File, CheckCircle2, AlertCircle, X, Eye } from "lucide-react"
import { useRegistration } from "@/contexts/registration-context"
import type { DocumentUpload, UploadedFile } from "@/types/registration"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const documentLabels: Record<string, { label: string; description: string }> = {
  foto: { label: "Foto Terbaru", description: "Foto berwarna 4x6 atau 3x4" },
  ktp: { label: "KTP", description: "Fotokopi KTP yang jelas" },
  kk: { label: "Kartu Keluarga", description: "Fotokopi kartu keluarga" },
  ijazah: { label: "Ijazah", description: "Fotokopi ijazah atau SKL" },
  rapor: { label: "Rapor", description: "Fotokopi rapor semester terakhir" },
  sertifikat: { label: "Sertifikat", description: "Sertifikat prestasi (opsional)" },
}

const statusColors = {
  pending: "bg-yellow-50 border-yellow-200",
  uploaded: "bg-blue-50 border-blue-200",
  verified: "bg-green-50 border-green-200",
  rejected: "bg-red-50 border-red-200",
}

const statusIcons = {
  pending: <AlertCircle className="h-4 w-4 text-yellow-600" />,
  uploaded: <Upload className="h-4 w-4 text-blue-600" />,
  verified: <CheckCircle2 className="h-4 w-4 text-green-600" />,
  rejected: <AlertCircle className="h-4 w-4 text-red-600" />,
}

const statusLabels = {
  pending: "Menunggu Upload",
  uploaded: "Sudah Diupload",
  verified: "Terverifikasi",
  rejected: "Ditolak",
}

export function DocumentUploadCard({ document }: { document: DocumentUpload }) {
  const { uploadDocument, removeDocument } = useRegistration()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const docInfo = documentLabels[document.type] || { label: document.label, description: "" }
  const file = document.file
  const status = file?.status || "pending"

  const handleFileSelect = async (selectedFile: File) => {
    // Validate file type
    if (!document.allowedFormats.includes(selectedFile.type)) {
      alert(
        `Format file tidak didukung. Gunakan: ${document.allowedFormats.join(", ")}`
      )
      return
    }

    // Validate file size (convert MB to bytes)
    if (selectedFile.size > document.maxSize * 1024 * 1024) {
      alert(`Ukuran file terlalu besar. Maksimal ${document.maxSize}MB`)
      return
    }

    setIsLoading(true)

    // Convert file to base64
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64String = e.target?.result as string

      // Create preview URL for images
      let previewUrl: string | undefined
      if (selectedFile.type.startsWith("image/")) {
        previewUrl = base64String
      }

      const uploadedFile: UploadedFile = {
        id: `file_${Date.now()}`,
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        uploadedAt: new Date().toISOString(),
        previewUrl,
        status: "uploaded",
      }

      uploadDocument(document.type, uploadedFile)
      setIsLoading(false)
    }

    reader.readAsDataURL(selectedFile)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  return (
    <Card
      className={`relative overflow-hidden border-2 transition-colors ${
        isDragging ? "border-primary bg-primary/5" : statusColors[status]
      }`}
    >
      <CardContent className="p-4">
        {/* Header with status badge */}
        <div className="mb-4 flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-sm">{docInfo.label}</h3>
            <p className="text-xs text-muted-foreground">{docInfo.description}</p>
          </div>
          {document.required && (
            <Badge variant="default" className="shrink-0 text-xs">
              Wajib
            </Badge>
          )}
        </div>

        {/* Upload area or file display */}
        {!file ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer rounded-lg border-2 border-dashed border-current/30 bg-current/5 p-6 text-center transition-colors hover:border-current/50 hover:bg-current/10"
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-6 w-6 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium">
                  Drag file ke sini atau klik untuk memilih
                </p>
                <p className="text-xs text-muted-foreground">
                  Maks. {document.maxSize}MB
                </p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileSelect(e.target.files[0])
                }
              }}
              accept={document.allowedFormats.join(",")}
              disabled={isLoading}
            />
          </div>
        ) : (
          <div className="space-y-3">
            {/* File preview or icon */}
            {file.previewUrl ? (
              <img
                src={file.previewUrl}
                alt={file.name}
                className="aspect-video w-full rounded-lg object-cover"
              />
            ) : (
              <div className="flex items-center justify-center rounded-lg bg-secondary/20 py-8">
                <File className="h-8 w-8 text-muted-foreground" />
              </div>
            )}

            {/* File info */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {statusIcons[status]}
                </div>
              </div>

              {/* Status badge */}
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {statusLabels[status]}
                </Badge>
              </div>

              {/* Rejection reason */}
              {status === "rejected" && file.rejectionReason && (
                <div className="rounded-lg bg-red-50 p-2 text-xs text-red-700">
                  <p className="font-medium">Alasan penolakan:</p>
                  <p>{file.rejectionReason}</p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              {file.previewUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    const link = window.document.createElement("a")
                    link.href = file.previewUrl!
                    link.download = file.name
                    link.click()
                  }}
                >
                  <Eye className="mr-1 h-3 w-3" />
                  Lihat
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-destructive hover:text-destructive"
                onClick={() => removeDocument(document.type)}
              >
                <X className="mr-1 h-3 w-3" />
                Hapus
              </Button>
              {status === "rejected" && (
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  Upload Ulang
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
