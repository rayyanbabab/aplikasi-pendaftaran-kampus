import Link from "next/link"
import { Phone, Mail, MapPin, Clock, MessageSquare, ArrowRight, Download, Building, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

const KONTAK = [
  {
    icon: Phone,
    label: "Layanan Telepon Kantor",
    value: "(021) 555-1234",
    sub: "Senin s.d. Jumat, 08.00 s.d. 16.00 WIB",
  },
  {
    icon: Mail,
    label: "Pos-el Resmi Admisi",
    value: "pmb@universitasnusantara.ac.id",
    sub: "Jawaban resmi maksimal 1x24 jam kerja",
  },
  {
    icon: MapPin,
    label: "Loket Pelayanan Fisik",
    value: "Gedung Rektorat Lantai 1",
    sub: "Jl. Nusantara Raya No. 1, Jakarta Pusat 10110",
  },
  {
    icon: Clock,
    label: "Jam Operasional Admisi",
    value: "08.00 s.d. 16.00 WIB",
    sub: "Hari kerja reguler (Senin s.d. Jumat)",
  },
]

export function CTAContact() {
  return (
    <section id="kontak" className="bg-background py-16 sm:py-24 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left: Contact Info */}
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
              Sekretariat & Pusat Bantuan
            </p>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-foreground leading-snug mb-4">
              Loket Pelayanan & Sekretariat Panitia PMB
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-8">
              Sekretariat PMB Universitas Nusantara siap melayani calon mahasiswa dan orang tua/wali dalam proses validasi berkas fisik, konsultasi penjurusan, pengajuan skema beasiswa, maupun kendala teknis portal online.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {KONTAK.map((item) => (
                <div key={item.label} className="p-4 rounded-xl border border-border bg-card">
                  <div className="h-8 w-8 rounded-lg border border-border bg-secondary text-foreground/80 flex items-center justify-center mb-3">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                  <p className="font-semibold text-sm text-foreground">{item.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-border">
              <Link href="/auth/register">
                <Button className="bg-primary text-primary-foreground font-semibold text-xs h-9 px-4 rounded-lg shadow-xs">
                  Daftar PMB Online 2025/2026
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Button>
              </Link>
              <a href="#unduhan">
                <Button variant="outline" className="text-xs font-semibold h-9 px-4 rounded-lg border-border">
                  <Download className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  Unduh Panduan Pendaftaran
                </Button>
              </a>
            </div>
          </div>

          {/* Right: WhatsApp Helpdesk & Verification Counter */}
          <div className="lg:col-span-5">
            <div className="bg-card rounded-2xl border border-border p-6 sm:p-7 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl border border-border bg-secondary text-foreground flex items-center justify-center shrink-0">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-foreground">
                    Layanan Konsultasi Daring
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    WhatsApp resmi panitia penerimaan mahasiswa baru
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mb-5">
                Pilih topik pertanyaan di bawah ini untuk terhubung langsung dengan petugas admisi kami:
              </p>

              <div className="space-y-2.5 mb-6">
                {[
                  {
                    label: "Persyaratan Berkas & Ijazah",
                    msg: "Halo%20admisi%2C%20saya%20ingin%20bertanya%20persyaratan%20berkas%20PMB",
                  },
                  {
                    label: "Konsultasi Pemilihan Program Studi",
                    msg: "Halo%20admisi%2C%20saya%20ingin%20konsultasi%20pemilihan%20program%20studi",
                  },
                  {
                    label: "Bantuan Teknis Pembayaran & CBT",
                    msg: "Halo%20admisi%2C%20saya%20memerlukan%20bantuan%20pembayaran%20dan%20jadwal%20CBT",
                  },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={`https://wa.me/6281234567890?text=${item.msg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl border border-border bg-secondary/40 hover:bg-secondary text-xs font-medium text-foreground transition-colors"
                  >
                    <span>{item.label}</span>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  </a>
                ))}
              </div>

              <a
                href="https://wa.me/6281234567890?text=Halo%20panitia%20PMB%20Universitas%20Nusantara"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-10 rounded-xl shadow-xs">
                  Mulai Konsultasi WhatsApp Resmi
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
