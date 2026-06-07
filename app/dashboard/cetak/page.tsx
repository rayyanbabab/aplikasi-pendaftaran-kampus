"use client"

import { useState } from "react"
import { Printer, Download } from "lucide-react"
import { useRegistration } from "@/contexts/registration-context"
import { FAKULTAS_LIST, PRODI_LIST } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"
import {
  FormRegistrasiTemplate,
  KartuPesertaTemplate,
  BuktiPembayaranTemplate,
  SuratKelulusanTemplate,
} from "@/components/cetak/print-templates"

export default function CetakPage() {
  const { registration } = useRegistration()
  const [selectedDocument, setSelectedDocument] = useState<"form" | "kartu" | "bukti" | "surat">("form")

  if (!registration) return null

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = async () => {
    // In a real application, this would use html2pdf or similar
    alert(
      "Fitur download PDF akan tersedia setelah integrasi html2pdf. Untuk saat ini, gunakan fitur print ke PDF dari browser Anda."
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Cetak Dokumen</h1>
        <p className="text-muted-foreground">
          Cetak dan download dokumen penting terkait pendaftaran Anda
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Anda dapat mencetak dokumen berikut menggunakan tombol Print di browser Anda atau memilih &quot;Save as PDF&quot;.
        </AlertDescription>
      </Alert>

      {/* Print UI - Hidden on Print */}
      <div className="print:hidden">
        <Tabs value={selectedDocument} onValueChange={(val) => setSelectedDocument(val as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="form">Formulir</TabsTrigger>
            <TabsTrigger value="kartu">Kartu Peserta</TabsTrigger>
            <TabsTrigger value="bukti">Bukti Pembayaran</TabsTrigger>
            <TabsTrigger value="surat">Surat Kelulusan</TabsTrigger>
          </TabsList>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-6">
            <Button onClick={handlePrint} className="flex-1">
              <Printer className="mr-2 h-4 w-4" />
              Cetak
            </Button>
            <Button variant="outline" onClick={handleDownload} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>

          {/* Tabs Content */}
          <TabsContent value="form" className="mt-6">
            <FormRegistrasiTemplate registration={registration} />
          </TabsContent>

          <TabsContent value="kartu" className="mt-6">
            <KartuPesertaTemplate registration={registration} />
          </TabsContent>

          <TabsContent value="bukti" className="mt-6">
            <BuktiPembayaranTemplate registration={registration} />
          </TabsContent>

          <TabsContent value="surat" className="mt-6">
            {registration.status === "lulus_seleksi" ? (
              <SuratKelulusanTemplate registration={registration} />
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    Surat kelulusan hanya tersedia setelah Anda lulus seleksi
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Print View - Shown only on Print */}
      <div className="hidden print:block">
        {selectedDocument === "form" && <FormRegistrasiTemplate registration={registration} />}
        {selectedDocument === "kartu" && <KartuPesertaTemplate registration={registration} />}
        {selectedDocument === "bukti" && <BuktiPembayaranTemplate registration={registration} />}
        {selectedDocument === "surat" && registration.status === "lulus_seleksi" && (
          <SuratKelulusanTemplate registration={registration} />
        )}
      </div>
    </div>
  )
}
