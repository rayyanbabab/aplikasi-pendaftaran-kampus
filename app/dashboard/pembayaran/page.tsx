"use client"

import { useState, useRef } from "react"
import { useRegistration } from "@/contexts/registration-context"
import { PRODI_LIST } from "@/lib/mock-data"
import type { PaymentMethod, UploadedFile } from "@/types/registration"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Info, Copy, Eye, Trash2, Upload, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"

const BANK_LIST = [
  { code: "BCA", name: "Bank Central Asia" },
  { code: "Mandiri", name: "Bank Mandiri" },
  { code: "BNI", name: "Bank Nasional Indonesia" },
  { code: "BRI", name: "Bank Rakyat Indonesia" },
]

const EWALLET_LIST = [
  { id: "gopay", name: "GoPay" },
  { id: "ovo", name: "OVO" },
  { id: "dana", name: "DANA" },
  { id: "linkaja", name: "LinkAja" },
]

export default function PembayaranPage() {
  const { registration, initPayment, uploadBuktiTransfer, removePaymentProof, resetPayment } = useRegistration()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<"method" | "proof">(registration?.pembayaran ? "proof" : "method")
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | "">(registration?.pembayaran?.method || "")
  const [selectedBank, setSelectedBank] = useState("")
  const [selectedEwallet, setSelectedEwallet] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  if (!registration) return null

  // Get selected program info
  const pilihanProdi = registration.pilihanProdi || []
  const selectedProdi = pilihanProdi[0]
    ? PRODI_LIST.find((p) => p.id === pilihanProdi[0].prodiId)
    : null

  const amount = selectedProdi?.biayaRegistrasi || 0
  const payment = registration.pembayaran
  const proofFile = payment?.buktiTransfer

  const handleSelectMethod = (method: PaymentMethod) => {
    setSelectedMethod(method)
    if (method === "virtual_account") {
      setSelectedBank("")
    } else if (method === "ewallet") {
      setSelectedEwallet("")
    }
  }

  const handleInitPayment = () => {
    if (!selectedProdi) {
      alert("Pilih program studi terlebih dahulu")
      return
    }

    if (selectedMethod === "virtual_account" && !selectedBank) {
      alert("Pilih bank untuk virtual account")
      return
    }

    if (selectedMethod === "ewallet" && !selectedEwallet) {
      alert("Pilih e-wallet")
      return
    }

    initPayment(
      selectedMethod as PaymentMethod,
      selectedMethod === "virtual_account" ? selectedBank : undefined,
      selectedMethod === "ewallet" ? selectedEwallet : undefined
    )

    setStep("proof")
  }

  const handleFileSelect = async (selectedFile: File) => {
    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"]
    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Format file tidak didukung. Gunakan JPG, PNG, atau PDF")
      return
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("Ukuran file terlalu besar. Maksimal 5MB")
      return
    }

    setIsLoading(true)

    const reader = new FileReader()
    reader.onload = (e) => {
      const base64String = e.target?.result as string

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

      uploadBuktiTransfer(uploadedFile)
      setIsLoading(false)
    }

    reader.readAsDataURL(selectedFile)
  }

  const handleRemoveProof = () => {
    removePaymentProof()
  }

  const handleResetPayment = () => {
    if (confirm("Apakah Anda yakin ingin mengganti metode pembayaran? Bukti transfer yang sudah diupload akan dihapus.")) {
      resetPayment()
      setStep("method")
      setSelectedMethod("")
      setSelectedBank("")
      setSelectedEwallet("")
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Pembayaran</h1>
        <p className="text-muted-foreground">Lengkapi pembayaran biaya pendaftaran untuk melanjutkan</p>
      </div>

      {/* Amount Summary */}
      {selectedProdi && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ringkasan Pembayaran</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <p className="text-sm">Program Studi: <span className="font-semibold">{selectedProdi.nama}</span></p>
              <div className="flex items-baseline justify-between pt-2 border-t">
                <span className="text-sm font-medium">Total Pembayaran:</span>
                <span className="text-2xl font-bold">Rp {amount.toLocaleString("id-ID")}</span>
              </div>
            </div>
            {payment && (
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status Pembayaran:</span>
                  <Badge className={cn(
                    payment.status === "verified" && "bg-green-100 text-green-800",
                    payment.status === "pending" && "bg-yellow-100 text-yellow-800",
                    payment.status === "unpaid" && "bg-red-100 text-red-800",
                  )}>
                    {payment.status === "verified" && "Terverifikasi"}
                    {payment.status === "pending" && "Menunggu Verifikasi"}
                    {payment.status === "unpaid" && "Belum Dibayar"}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Payment Method Selection */}
      {step === "method" && !payment && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Pilih Metode Pembayaran</h2>
          
          {/* Virtual Account Option */}
          <Card
            className={cn(
              "cursor-pointer border-2 transition-colors",
              selectedMethod === "virtual_account"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
            onClick={() => handleSelectMethod("virtual_account")}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base">Virtual Account</CardTitle>
                  <CardDescription>Transfer ke nomor rekening virtual unik Anda</CardDescription>
                </div>
                <CreditCard className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardHeader>
          </Card>

          {/* QRIS Option */}
          <Card
            className={cn(
              "cursor-pointer border-2 transition-colors",
              selectedMethod === "qris"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
            onClick={() => handleSelectMethod("qris")}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base">QRIS</CardTitle>
                  <CardDescription>Scan kode QR dengan aplikasi pembayaran apapun</CardDescription>
                </div>
                <div className="h-10 w-10 bg-secondary rounded" />
              </div>
            </CardHeader>
          </Card>

          {/* E-Wallet Option */}
          <Card
            className={cn(
              "cursor-pointer border-2 transition-colors",
              selectedMethod === "ewallet"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
            onClick={() => handleSelectMethod("ewallet")}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base">E-Wallet</CardTitle>
                  <CardDescription>GoPay, OVO, DANA, atau LinkAja</CardDescription>
                </div>
                <CreditCard className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardHeader>
          </Card>

          {/* Additional Options for Selected Method */}
          {selectedMethod === "virtual_account" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Pilih Bank</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select value={selectedBank} onValueChange={setSelectedBank}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {BANK_LIST.map((bank) => (
                      <SelectItem key={bank.code} value={bank.code}>
                        {bank.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}

          {selectedMethod === "ewallet" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Pilih E-Wallet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select value={selectedEwallet} onValueChange={setSelectedEwallet}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih E-Wallet" />
                  </SelectTrigger>
                  <SelectContent>
                    {EWALLET_LIST.map((ew) => (
                      <SelectItem key={ew.id} value={ew.id}>
                        {ew.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}

          <Button
            onClick={handleInitPayment}
            disabled={!selectedMethod}
            className="w-full"
          >
            Lanjutkan ke Upload Bukti
          </Button>
        </div>
      )}

      {/* Payment Details & Proof Upload */}
      {(step === "proof" && payment) && (
        <div className="space-y-6">
          {/* Payment Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Detail Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {/* Virtual Account Details */}
                {payment.method === "virtual_account" && payment.virtualAccountNumber && (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm">Bank</Label>
                      <p className="text-lg font-semibold mt-1">{payment.bankCode}</p>
                    </div>
                    <div>
                      <Label className="text-sm">Nomor Virtual Account</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="flex-1 rounded bg-secondary p-3 font-mono text-lg font-semibold">
                          {payment.virtualAccountNumber}
                        </code>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            navigator.clipboard.writeText(payment.virtualAccountNumber!)
                            alert("Nomor VA disalin ke clipboard")
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Transfer ke nomor virtual account ini sebesar Rp {amount.toLocaleString("id-ID")}. Nomor ini akan otomatis verifikasi setelah transfer diterima.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {/* QRIS Details */}
                {payment.method === "qris" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center rounded-lg bg-secondary/50 py-8">
                      <div className="text-center">
                        <div className="h-32 w-32 mx-auto bg-white rounded-lg mb-2 flex items-center justify-center">
                          <div className="text-xs text-muted-foreground">QRIS Code</div>
                        </div>
                        <p className="text-sm text-muted-foreground">Scan dengan aplikasi pembayaran apapun</p>
                      </div>
                    </div>
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Scan kode QR di atas dengan aplikasi pembayaran Anda (GoPay, OVO, DANA, dll). Pembayaran akan langsung terverifikasi.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {/* E-Wallet Details */}
                {payment.method === "ewallet" && payment.ewalletProvider && (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm">E-Wallet</Label>
                      <p className="text-lg font-semibold mt-1">{payment.ewalletProvider.toUpperCase()}</p>
                    </div>
                    {payment.ewalletNumber && (
                      <div>
                        <Label className="text-sm">Nomor Tujuan</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="flex-1 rounded bg-secondary p-3 font-mono font-semibold">
                            {payment.ewalletNumber}
                          </code>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              navigator.clipboard.writeText(payment.ewalletNumber!)
                              alert("Nomor disalin ke clipboard")
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Transfer sebesar Rp {amount.toLocaleString("id-ID")} melalui aplikasi {payment.ewalletProvider.toUpperCase()} Anda. Pembayaran akan terverifikasi setelah kami menerima transfer.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {/* Expiration */}
                <div className="pt-3 border-t">
                  <p className="text-xs text-muted-foreground">
                    Berlaku sampai: {new Date(payment.expiredAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Change payment method button */}
          {payment.status !== "verified" && (
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={handleResetPayment}>
                Ganti Metode Pembayaran
              </Button>
            </div>
          )}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upload Bukti Transfer</CardTitle>
              <CardDescription>Upload screenshot atau foto bukti pembayaran Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!proofFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer rounded-lg border-2 border-dashed border-current/30 bg-current/5 p-8 text-center transition-colors hover:border-current/50 hover:bg-current/10"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Drag file ke sini atau klik untuk memilih</p>
                      <p className="text-xs text-muted-foreground">JPG, PNG, atau PDF. Maks. 5MB</p>
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
                    accept=".jpg,.jpeg,.png,.pdf"
                    disabled={isLoading}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  {proofFile.previewUrl && (
                    <img
                      src={proofFile.previewUrl}
                      alt={proofFile.name}
                      className="aspect-video w-full rounded-lg object-cover"
                    />
                  )}
                  <div className="flex items-center justify-between rounded-lg bg-secondary/20 p-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{proofFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(proofFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {proofFile.previewUrl && (
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={handleRemoveProof}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Bukti transfer akan diverifikasi oleh admin. Anda akan menerima notifikasi setelah verifikasi selesai.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
