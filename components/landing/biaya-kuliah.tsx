import { CheckCircle, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const PAKET_BIAYA = [
  {
    nama: "Reguler",
    uktMin: "2.400.000",
    uktMax: "6.500.000",
    ukt: "Rp 2,4 jt – 6,5 jt",
    uktp: "UKT per semester",
    spp: "Rp 500.000",
    highlight: false,
    badge: null,
    fitur: [
      "Disesuaikan kemampuan ekonomi",
      "Cicilan tersedia 3 tahap",
      "KIP-Kuliah diterima",
      "Beasiswa prestasi tersedia",
      "Akses fasilitas kampus penuh",
    ],
  },
  {
    nama: "Uang Pangkal",
    uktMin: "5.000.000",
    uktMax: "25.000.000",
    ukt: "Rp 5 jt – 25 jt",
    uktp: "Uang pangkal (sekali bayar)",
    spp: "Rp 3.500.000",
    highlight: true,
    badge: "Paling Populer",
    fitur: [
      "Uang pangkal lebih ringan",
      "SPP tetap per semester",
      "Cicilan uang pangkal tersedia",
      "Gratis almamater & kit",
      "Akses fasilitas kampus penuh",
    ],
  },
  {
    nama: "Beasiswa",
    uktMin: "0",
    uktMax: "0",
    ukt: "Gratis / Potongan",
    uktp: "Tergantung jenis beasiswa",
    spp: "Rp 0 – 3.500.000",
    highlight: false,
    badge: "Terbatas",
    fitur: [
      "Beasiswa penuh (full scholarship)",
      "Beasiswa parsial 30–70%",
      "Beasiswa KIP-Kuliah",
      "Beasiswa prestasi akademik",
      "Beasiswa atlet & seni",
    ],
  },
]

export function BiayaKuliah() {
  return (
    <section id="biaya" className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="section-badge mb-4 inline-flex">Investasi Pendidikan</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-foreground text-balance mt-4">
            Biaya Kuliah yang{" "}
            <span
              style={{
                background: "linear-gradient(135deg, var(--primary), oklch(0.55 0.20 275))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Terjangkau
            </span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-[0.9375rem] leading-relaxed">
            Kami berkomitmen memberikan pendidikan berkualitas dengan biaya yang dapat dijangkau semua kalangan. Tersedia berbagai jalur pembiayaan dan beasiswa.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {PAKET_BIAYA.map((paket) => (
            <div
              key={paket.nama}
              className={`relative rounded-2xl border p-6 flex flex-col card-hover ${
                paket.highlight
                  ? "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/25 scale-[1.02]"
                  : "bg-card text-foreground border-border hover:border-primary/25"
              }`}
            >
              {paket.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge
                    className={paket.highlight
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-secondary-foreground border border-border"
                    }
                  >
                    {paket.badge}
                  </Badge>
                </div>
              )}

              <div className="mb-5">
                <p className={`text-xs font-bold uppercase tracking-widest mb-1.5 ${paket.highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  Jalur {paket.nama}
                </p>
                <p className={`font-serif text-3xl font-bold ${paket.highlight ? "text-primary-foreground" : "text-foreground"}`}>
                  {paket.ukt}
                </p>
                <p className={`text-xs mt-1 ${paket.highlight ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                  {paket.uktp}
                </p>
              </div>

              <div className="flex-1 mb-6">
                {paket.fitur.map((f) => (
                  <div key={f} className="flex items-start gap-2.5 mb-2">
                    <CheckCircle className={`h-4 w-4 mt-0.5 shrink-0 ${paket.highlight ? "text-accent" : "text-primary"}`} />
                    <span className={`text-sm ${paket.highlight ? "text-primary-foreground/85" : "text-muted-foreground"}`}>
                      {f}
                    </span>
                  </div>
                ))}
              </div>

              <a
                href={`https://wa.me/6281234567890?text=Halo%2C%20saya%20ingin%20konsultasi%20biaya%20jalur%20${encodeURIComponent(paket.nama)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  className={`w-full ${
                    paket.highlight
                      ? "bg-accent text-accent-foreground hover:bg-accent/90"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  Konsultasi Gratis
                </Button>
              </a>
            </div>
          ))}
        </div>

        {/* Download Brosur */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-6 rounded-2xl bg-secondary border border-border">
          <div>
            <p className="font-semibold text-foreground text-center sm:text-left">
              Unduh brosur lengkap biaya kuliah & informasi beasiswa
            </p>
            <p className="text-muted-foreground text-sm text-center sm:text-left">
              File PDF berisi rincian biaya per fakultas, syarat beasiswa, dan prosedur cicilan.
            </p>
          </div>
          <a
            href="/brosur-pmb-2025.pdf"
            download
            className="shrink-0"
          >
            <Button variant="outline" className="gap-2 whitespace-nowrap">
              <Download className="h-4 w-4" />
              Download Brosur PDF
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
