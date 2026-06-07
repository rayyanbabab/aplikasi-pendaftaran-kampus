import Link from "next/link"
import { MessageCircle, Phone, Mail, MapPin, Clock, Download, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const KONTAK = [
  {
    icon: Phone,
    label: "Telepon",
    value: "(021) 555-1234",
    sub: "Senin – Jumat, 08.00 – 16.00",
  },
  {
    icon: Mail,
    label: "Email",
    value: "pmb@universitasnusantara.ac.id",
    sub: "Respon dalam 1 × 24 jam",
  },
  {
    icon: MapPin,
    label: "Alamat",
    value: "Jl. Nusantara Raya No. 1, Jakarta",
    sub: "Gedung Rektorat Lt. 1",
  },
  {
    icon: Clock,
    label: "Jam Layanan",
    value: "Senin – Jumat",
    sub: "08.00 – 16.00 WIB",
  },
]

export function CTAContact() {
  return (
    <>
      {/* CTA Banner */}
      <section className="relative bg-accent py-20 overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-black/10 blur-3xl pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-accent-foreground text-balance">
                Siap Bergabung? Daftarkan Dirimu Sekarang
              </h2>
              <p className="text-accent-foreground/75 mt-1.5 text-sm font-medium">
                Jangan lewatkan kesempatan emas ini. Kuota terbatas!
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <a
                href="/brosur-pmb-2025.pdf"
                download
              >
                <Button variant="outline" className="gap-2 border-accent-foreground/30 text-accent-foreground hover:bg-accent-foreground/10 rounded-xl font-semibold">
                  <Download className="h-4 w-4" />
                  Download Brosur
                </Button>
              </a>
              <Link href="/auth/register">
                <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-200">
                  Daftar Sekarang <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="kontak" className="bg-background py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: Info */}
            <div>
              <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Hubungi Kami</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground text-balance mb-4">
                Ada Pertanyaan? Kami Siap Membantu
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Tim panitia PMB kami siap menjawab setiap pertanyaan dan membantu proses pendaftaran kamu. Jangan ragu untuk menghubungi kami melalui saluran komunikasi di bawah ini.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {KONTAK.map((item) => (
                  <div key={item.label} className="flex gap-3 p-4 rounded-xl border border-border bg-card">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="h-4.5 w-4.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                      <p className="font-semibold text-foreground text-sm">{item.value}</p>
                      <p className="text-xs text-muted-foreground">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: WhatsApp CTA */}
            <div className="flex flex-col justify-center">
              <div className="bg-[#075E54] rounded-2xl p-8 text-white text-center shadow-xl">
                <div className="h-16 w-16 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-9 w-9 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">Chat via WhatsApp</h3>
                <p className="text-white/75 text-sm leading-relaxed mb-6">
                  Konsultasi gratis dengan panitia PMB kami. Pertanyaan seputar pendaftaran, program studi, biaya, beasiswa, dan informasi kampus lainnya siap kami jawab.
                </p>

                <div className="flex flex-col gap-3 mb-6">
                  {[
                    { label: "Informasi Pendaftaran", msg: "Halo%2C%20saya%20ingin%20info%20pendaftaran%20PMB%202025" },
                    { label: "Konsultasi Program Studi", msg: "Halo%2C%20saya%20ingin%20konsultasi%20program%20studi" },
                    { label: "Info Beasiswa", msg: "Halo%2C%20saya%20ingin%20tahu%20informasi%20beasiswa" },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={`https://wa.me/6281234567890?text=${item.msg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
                    >
                      {item.label}
                      <ArrowRight className="h-4 w-4 text-white/70" />
                    </a>
                  ))}
                </div>

                <a
                  href="https://wa.me/6281234567890?text=Halo%2C%20saya%20ingin%20info%20PMB%202025"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Mulai Chat WhatsApp
                  </Button>
                </a>

                <p className="text-white/50 text-xs mt-3">
                  Aktif Senin–Sabtu, 08.00–20.00 WIB
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
