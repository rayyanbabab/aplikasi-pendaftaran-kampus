"use client"

import { useState } from "react"
import Link from "next/link"
import {
  CreditCard,
  Calculator,
  CheckCircle2,
  FileText,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

const SKEMA_JALUR = [
  {
    nama: "Jalur Reguler (SNBP / SNBT / Mandiri)",
    deskripsi: "Penetapan Uang Kuliah Tunggal (UKT) berkeadilan berdasarkan data verifikasi kemampuan finansial penanggung.",
    kisaran: "Rp 2.400.000 s.d. Rp 6.800.000",
    periode: "Per semester (tidak ada biaya SKS)",
    poin: [
      "Pembayaran UKT dapat dicicil 3 termin per semester tanpa bunga",
      "Termasuk seluruh akses laboratorium, modul digital, dan praktikum",
      "Tidak dipungut uang gedung / uang pangkal tambahan untuk jalur reguler",
    ],
  },
  {
    nama: "Jalur Beasiswa KIP-Kuliah & Prestasi",
    deskripsi: "Subsidi penuh dan beasiswa parsial bagi siswa berprestasi akademik, talenta sains, seni, atau pemegang KIP.",
    kisaran: "Biaya Kuliah Rp 0 (Bebas Biaya)",
    periode: "Hingga 8 semester perkuliahan",
    poin: [
      "Pembebasan 100% biaya UKT dan biaya praktikum",
      "Bantuan biaya hidup bulanan langsung dari Kemendikbudristek",
      "Pendampingan akademik intensif oleh dosen pembimbing khusus",
    ],
  },
  {
    nama: "Kelas Profesional / Sore",
    deskripsi: "Perkuliahan fleksibel terakreditasi bagi lulusan diploma atau mahasiswa yang telah aktif bekerja.",
    kisaran: "Rp 3.850.000",
    periode: "Biaya tetap per semester",
    poin: [
      "Model pembelajaran hybrid kombinasi kuliah daring dan tatap muka",
      "Skema cicilan bulanan fleksibel bekerja sama dengan bank mitra",
      "Konversi SKS transkrip diploma yang transparan dan terstandar",
    ],
  },
]

const PRODI_OPTIONS = [
  { id: "ti", nama: "Teknik Informatika (S1)", baseUKT: 4500000 },
  { id: "kedokteran", nama: "Pendidikan Dokter (S1)", baseUKT: 12500000 },
  { id: "hukum", nama: "Ilmu Hukum (S1)", baseUKT: 3800000 },
  { id: "manajemen", nama: "Manajemen Bisnis (S1)", baseUKT: 4000000 },
  { id: "komunikasi", nama: "Ilmu Komunikasi (S1)", baseUKT: 3900000 },
  { id: "farmasi", nama: "Farmasi Klinis (S1)", baseUKT: 5500000 },
]

const INCOME_TIERS = [
  { id: "tier1", label: "Kurang dari Rp 2.500.000 (Pemegang KIP/PKH)", multiplier: 0, labelKelompok: "Kelompok I (KIP-K)", bebasBiaya: true },
  { id: "tier2", label: "Rp 2.500.000 s.d. Rp 5.000.000", multiplier: 0.6, labelKelompok: "Kelompok II", bebasBiaya: false },
  { id: "tier3", label: "Rp 5.000.000 s.d. Rp 10.000.000", multiplier: 0.85, labelKelompok: "Kelompok III", bebasBiaya: false },
  { id: "tier4", label: "Rp 10.000.000 s.d. Rp 20.000.000", multiplier: 1.0, labelKelompok: "Kelompok IV", bebasBiaya: false },
  { id: "tier5", label: "Lebih dari Rp 20.000.000", multiplier: 1.25, labelKelompok: "Kelompok V", bebasBiaya: false },
]

export function BiayaKuliah() {
  const [selectedProdiId, setSelectedProdiId] = useState(PRODI_OPTIONS[0].id)
  const [selectedIncomeId, setSelectedIncomeId] = useState(INCOME_TIERS[1].id)

  const currentProdi = PRODI_OPTIONS.find((p) => p.id === selectedProdiId) || PRODI_OPTIONS[0]
  const currentIncome = INCOME_TIERS.find((i) => i.id === selectedIncomeId) || INCOME_TIERS[1]

  const estimatedUKT = currentIncome.bebasBiaya
    ? 0
    : Math.round(currentProdi.baseUKT * currentIncome.multiplier)

  const installmentPerTerm = Math.round(estimatedUKT / 3)

  return (
    <section id="biaya" className="bg-background py-20 sm:py-28 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
            Transparansi Pembiayaan
          </p>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-foreground leading-snug mb-3">
            Struktur Biaya Kuliah Tunggal (UKT) Berkeadilan
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Tidak ada pungutan tersembunyi. Skema Uang Kuliah Tunggal (UKT) mencakup seluruh biaya akademik, praktikum, dan ujian, dengan opsi cicilan bertahap per semester.
          </p>
        </div>

        {/* 3 Core Scheme Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {SKEMA_JALUR.map((skema) => (
            <div
              key={skema.nama}
              className="rounded-2xl border border-border bg-card p-6 sm:p-7 flex flex-col justify-between hover:border-primary/40 transition-all shadow-xs"
            >
              <div>
                <h3 className="font-serif font-bold text-lg text-foreground mb-2">
                  {skema.nama}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                  {skema.deskripsi}
                </p>

                <div className="rounded-xl bg-secondary/50 border border-border p-4 mb-6">
                  <p className="text-xs text-muted-foreground font-medium">Estimasi Biaya:</p>
                  <p className="font-serif font-bold text-xl text-foreground mt-0.5">
                    {skema.kisaran}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1 font-mono">{skema.periode}</p>
                </div>

                <div className="space-y-3">
                  {skema.poin.map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-foreground/80 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive UKT Simulator Box */}
        <div className="rounded-2xl border border-primary/20 bg-secondary/20 p-6 sm:p-10 shadow-xs">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-border mb-8">
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                <Calculator className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-foreground">
                  Simulasi Estimasi UKT Calon Mahasiswa
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Hitung perkiraan biaya per semester berdasarkan program studi dan penghasilan penanggung biaya.
                </p>
              </div>
            </div>

            <Badge variant="outline" className="text-xs border-primary/30 text-primary font-mono py-1 px-3">
              Perhitungan Resmi TA 2025/2026
            </Badge>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Form Inputs (Left) */}
            <div className="lg:col-span-6 space-y-5">
              <div>
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-2">
                  1. Pilih Program Studi Peminatan
                </label>
                <Select value={selectedProdiId} onValueChange={setSelectedProdiId}>
                  <SelectTrigger className="w-full bg-card h-11 text-xs sm:text-sm">
                    <SelectValue placeholder="Pilih Program Studi" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODI_OPTIONS.map((prodi) => (
                      <SelectItem key={prodi.id} value={prodi.id} className="text-xs sm:text-sm">
                        {prodi.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-2">
                  2. Estimasi Gabungan Penghasilan Orang Tua / Wali
                </label>
                <Select value={selectedIncomeId} onValueChange={setSelectedIncomeId}>
                  <SelectTrigger className="w-full bg-card h-11 text-xs sm:text-sm">
                    <SelectValue placeholder="Pilih Rentang Penghasilan" />
                  </SelectTrigger>
                  <SelectContent>
                    {INCOME_TIERS.map((tier) => (
                      <SelectItem key={tier.id} value={tier.id} className="text-xs sm:text-sm">
                        {tier.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                <span>Hasil simulasi bersifat estimasi acuan sebelum verifikasi slip penghasilan resmi di sistem.</span>
              </div>
            </div>

            {/* Live Calculation Output Card (Right) */}
            <div className="lg:col-span-6">
              <div className="rounded-xl border border-border bg-card p-6 sm:p-7 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <span className="text-xs font-medium text-muted-foreground">Kategori Penetapan</span>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {currentIncome.labelKelompok}
                  </Badge>
                </div>

                <div className="my-5">
                  <p className="text-xs text-muted-foreground">Estimasi UKT per Semester:</p>
                  <p className="font-serif font-bold text-3xl sm:text-4xl text-primary mt-1">
                    {currentIncome.bebasBiaya ? (
                      <span className="text-emerald-600">Rp 0 (Subsidi 100%)</span>
                    ) : (
                      `Rp ${estimatedUKT.toLocaleString("id-ID")}`
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Program: <span className="font-medium text-foreground">{currentProdi.nama}</span>
                  </p>
                </div>

                {!currentIncome.bebasBiaya && (
                  <div className="rounded-lg bg-secondary/50 p-3.5 border border-border/80 mb-6 text-xs">
                    <p className="font-semibold text-foreground mb-1">Skema Opsi Cicilan 3 Tahap:</p>
                    <div className="grid grid-cols-3 gap-2 text-muted-foreground font-mono text-[11px] mt-2">
                      <div className="p-2 bg-card rounded border border-border">
                        <span className="block text-[10px] text-muted-foreground">Termin 1 (Awal)</span>
                        <span className="font-bold text-foreground">Rp {installmentPerTerm.toLocaleString("id-ID")}</span>
                      </div>
                      <div className="p-2 bg-card rounded border border-border">
                        <span className="block text-[10px] text-muted-foreground">Termin 2 (UTS)</span>
                        <span className="font-bold text-foreground">Rp {installmentPerTerm.toLocaleString("id-ID")}</span>
                      </div>
                      <div className="p-2 bg-card rounded border border-border">
                        <span className="block text-[10px] text-muted-foreground">Termin 3 (UAS)</span>
                        <span className="font-bold text-foreground">Rp {installmentPerTerm.toLocaleString("id-ID")}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <Link href="/auth/register" className="w-full">
                    <Button className="w-full font-semibold text-xs h-10 gap-2">
                      Lanjutkan Pendaftaran dengan Skema Ini
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
