"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Download } from "lucide-react"

// Mock data
const statistikData = [
  { name: "Gelombang 1", total: 450, terima: 380, tolak: 70 },
  { name: "Gelombang 2", total: 520, terima: 420, tolak: 100 },
  { name: "Gelombang 3", total: 380, terima: 300, tolak: 80 },
]

const auditLog = [
  { id: 1, waktu: "2024-06-13 15:45", user: "Admin 1", aksi: "Verifikasi berkas", detail: "Pendaftar PMB24001 - Berkas ditolak", status: "Sukses" },
  { id: 2, waktu: "2024-06-13 14:20", user: "Admin 2", aksi: "Broadcast email", detail: "750 pendaftar - Hasil pengumuman", status: "Sukses" },
  { id: 3, waktu: "2024-06-13 13:10", user: "Admin 1", aksi: "Ubah kuota", detail: "TI SNBP: 50 → 55", status: "Sukses" },
  { id: 4, waktu: "2024-06-13 11:30", user: "Admin 3", aksi: "Tambah soal", detail: "10 soal CBT ditambahkan", status: "Sukses" },
  { id: 5, waktu: "2024-06-13 10:15", user: "Admin 2", aksi: "Verifikasi pembayaran", detail: "Pendaftar PMB24002 - Pembayaran terverifikasi", status: "Sukses" },
]

const loginHistory = [
  { id: 1, waktu: "2024-06-13 15:30", user: "Admin 1", email: "admin1@univ.ac.id", status: "Berhasil", ipAddress: "192.168.1.100" },
  { id: 2, waktu: "2024-06-13 14:00", user: "Admin 2", email: "admin2@univ.ac.id", status: "Berhasil", ipAddress: "192.168.1.101" },
  { id: 3, waktu: "2024-06-13 13:15", user: "Admin 3", email: "admin3@univ.ac.id", status: "Berhasil", ipAddress: "192.168.1.102" },
  { id: 4, waktu: "2024-06-13 10:45", user: "Admin 1", email: "admin1@univ.ac.id", status: "Gagal (Password salah)", ipAddress: "192.168.1.100" },
]

export default function ReportsPage() {
  const [filterJenis, setFilterJenis] = useState("semua")
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [filterGelombang, setFilterGelombang] = useState("all")
  const [filterProdi, setFilterProdi] = useState("all")
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const exportCSV = (filename: string, data: Record<string, string | number>[], headers: string[]) => {
    const csvRows = [
      headers.join(","),
      ...data.map(row => headers.map(h => `"${String((row as any)[h] ?? '').replace(/"/g, '""')}"`).join(","))
    ]
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    showToast(`${filename} berhasil diunduh`)
  }

  const handleExportRegistrants = () => {
    const data = [
      { "No": "PMB24001", "Nama": "Budi Santoso", "Email": "budi@example.com", "Prodi": "Teknik Informatika", "Jalur": "SNBP", "Status": "Menunggu" },
      { "No": "PMB24002", "Nama": "Siti Nurhaliza", "Email": "siti@example.com", "Prodi": "Manajemen", "Jalur": "SNBT", "Status": "Diterima" },
    ]
    exportCSV("data-pendaftar.csv", data, ["No", "Nama", "Email", "Prodi", "Jalur", "Status"])
  }

  const handleExportStatistik = () => {
    const data = statistikData.map(d => ({ Gelombang: d.name, Total: d.total, Diterima: d.terima, Ditolak: d.tolak }))
    exportCSV("statistik-pmb.csv", data, ["Gelombang", "Total", "Diterima", "Ditolak"])
  }

  const handleExportVerifikasi = () => {
    const data = [
      { No: "PMB24001", Nama: "Budi Santoso", Berkas: "Pending", Pembayaran: "Pending" },
      { No: "PMB24002", Nama: "Siti Nurhaliza", Berkas: "Disetujui", Pembayaran: "Pending" },
    ]
    exportCSV("laporan-verifikasi.csv", data, ["No", "Nama", "Berkas", "Pembayaran"])
  }

  const handleExportUjian = () => {
    const data = [
      { Gelombang: "Gelombang 1", Tanggal: "2024-06-15", Lokasi: "Lab Komputer A", Peserta: 45 },
      { Gelombang: "Gelombang 1", Tanggal: "2024-06-16", Lokasi: "Lab Komputer B", Peserta: 38 },
    ]
    exportCSV("laporan-ujian.csv", data, ["Gelombang", "Tanggal", "Lokasi", "Peserta"])
  }

  const exportHandlers: Record<string, () => void> = {
    "Data Pendaftar Lengkap": handleExportRegistrants,
    "Statistik Pendaftaran": handleExportStatistik,
    "Laporan Verifikasi": handleExportVerifikasi,
    "Laporan Ujian": handleExportUjian,
  }

  const reportItems = [
    { name: "Data Pendaftar Lengkap", desc: "Export semua data pendaftar dengan biodata" },
    { name: "Statistik Pendaftaran", desc: "Grafik dan statistik per gelombang/prodi" },
    { name: "Laporan Verifikasi", desc: "Status verifikasi berkas dan pembayaran" },
    { name: "Laporan Ujian", desc: "Hasil dan statistik ujian CBT" },
  ]

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {toast && <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-green-600 px-5 py-3 text-white shadow-lg">{toast}</div>}
      <div>
        <h1 className="text-3xl font-bold">Laporan &amp; Audit</h1>
        <p className="text-sm text-muted-foreground">Export laporan, statistik PMB, audit log, dan riwayat aktivitas</p>
      </div>

      <Tabs defaultValue="statistik" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="statistik">Statistik PMB</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="login">Login History</TabsTrigger>
        </TabsList>

        {/* Statistik Tab */}
        <TabsContent value="statistik" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistik Pendaftaran PMB</CardTitle>
              <CardDescription>Ringkasan pendaftaran per gelombang</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statistikData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#3b82f6" name="Total Pendaftar" />
                  <Bar dataKey="terima" fill="#10b981" name="Diterima" />
                  <Bar dataKey="tolak" fill="#ef4444" name="Ditolak" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Pendaftar Keseluruhan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1.350</div>
                <p className="text-xs text-muted-foreground mt-2">+8% dari periode sebelumnya</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Diterima Keseluruhan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1.100</div>
                <p className="text-xs text-muted-foreground mt-2">Acceptance Rate: 81.5%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Ditolak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">250</div>
                <p className="text-xs text-muted-foreground mt-2">Rejection Rate: 18.5%</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Export Data Tab */}
        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Data</CardTitle>
              <CardDescription>Unduh data dalam format CSV</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pilih Jenis Laporan */}
              <div>
                <Label className="font-semibold">Pilih Jenis Laporan</Label>
                <div className="grid gap-3 mt-3">
                  {reportItems.map((item) => (
                    <div
                      key={item.name}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        selectedReport === item.name
                          ? "border-primary bg-primary/10"
                          : "hover:bg-accent"
                      }`}
                      onClick={() => setSelectedReport(item.name)}
                    >
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filter */}
              <div className="border-t pt-4">
                <Label className="font-semibold">Filter Data (Opsional)</Label>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <Label className="text-sm">Gelombang</Label>
                    <Select value={filterGelombang} onValueChange={setFilterGelombang}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Semua gelombang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua gelombang</SelectItem>
                        <SelectItem value="g1">Gelombang 1</SelectItem>
                        <SelectItem value="g2">Gelombang 2</SelectItem>
                        <SelectItem value="g3">Gelombang 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm">Program Studi</Label>
                    <Select value={filterProdi} onValueChange={setFilterProdi}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Semua prodi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua prodi</SelectItem>
                        <SelectItem value="ti">Teknik Informatika</SelectItem>
                        <SelectItem value="mn">Manajemen</SelectItem>
                        <SelectItem value="ts">Teknik Sipil</SelectItem>
                        <SelectItem value="hk">Hukum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Export Button */}
              <div className="border-t pt-4">
                <Button
                  className="w-full gap-2"
                  disabled={!selectedReport}
                  onClick={() => selectedReport && exportHandlers[selectedReport]?.()}
                >
                  <Download className="h-4 w-4" />
                  {selectedReport ? `Download "${selectedReport}" (CSV)` : "Pilih laporan terlebih dahulu"}
                </Button>
                {!selectedReport && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">Pilih jenis laporan di atas, lalu klik tombol download</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Log Tab */}
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
              <CardDescription>Riwayat semua aktivitas admin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Select value={filterJenis} onValueChange={setFilterJenis}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semua">Semua Aksi</SelectItem>
                    <SelectItem value="verifikasi">Verifikasi</SelectItem>
                    <SelectItem value="broadcast">Broadcast</SelectItem>
                    <SelectItem value="ubah">Ubah Data</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Cari..." className="flex-1" />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Aksi</TableHead>
                    <TableHead>Detail</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLog
                    .filter(log => filterJenis === "semua" || log.aksi.toLowerCase().includes(filterJenis))
                    .map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">{log.waktu}</TableCell>
                      <TableCell className="font-medium">{log.user}</TableCell>
                      <TableCell>{log.aksi}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{log.detail}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                          {log.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Login History Tab */}
        <TabsContent value="login" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Login History</CardTitle>
              <CardDescription>Riwayat login admin portal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Input type="date" className="w-40" />
                <Input placeholder="Cari user..." className="flex-1" />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loginHistory.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">{log.waktu}</TableCell>
                      <TableCell className="font-medium">{log.user}</TableCell>
                      <TableCell className="text-sm">{log.email}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{log.ipAddress}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          log.status === "Berhasil" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {log.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
