import { GraduationCap, Instagram, Facebook, Youtube, Twitter } from "lucide-react"
import Link from "next/link"

const LINKS_CEPAT = [
  { label: "Profil Kampus", href: "#profil" },
  { label: "Fakultas & Prodi", href: "#fakultas" },
  { label: "Biaya Kuliah", href: "#biaya" },
  { label: "Jalur Pendaftaran", href: "#jalur" },
  { label: "Jadwal PMB", href: "#jadwal" },
]

const LINKS_PMB = [
  { label: "Cara Mendaftar", href: "#jalur" },
  { label: "Persyaratan", href: "#jalur" },
  { label: "Beasiswa", href: "#biaya" },
  { label: "FAQ", href: "#faq" },
  { label: "Hubungi Kami", href: "#kontak" },
]

const SOSMED = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
  { icon: Twitter, label: "X (Twitter)", href: "#" },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-serif font-bold text-sm text-primary-foreground tracking-tight">Universitas Nusantara</p>
                <p className="text-[10px] text-primary-foreground/50 font-medium uppercase tracking-widest">PMB 2025/2026</p>
              </div>
            </div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed mb-5">
              Mencetak generasi unggul dan berkarakter sejak 1990. Kampus terdepan dalam inovasi, riset, dan pengabdian masyarakat.
            </p>
            <div className="flex gap-2.5">
              {SOSMED.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-primary hover:scale-105 transition-all duration-200"
                >
                  <s.icon className="h-4 w-4 text-primary-foreground" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Cepat */}
          <div>
            <p className="font-semibold text-sm text-primary-foreground mb-4">Informasi Kampus</p>
            <ul className="flex flex-col gap-2.5">
              {LINKS_CEPAT.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/60 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links PMB */}
          <div>
            <p className="font-semibold text-sm text-primary-foreground mb-4">Panduan PMB</p>
            <ul className="flex flex-col gap-2.5">
              {LINKS_PMB.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/60 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Akreditasi */}
          <div>
            <p className="font-semibold text-sm text-primary-foreground mb-4">Akreditasi & Legalitas</p>
            <div className="flex flex-col gap-3">
              {[
                { label: "BAN-PT", value: "Terakreditasi A", sub: "No. 123/SK/BAN-PT/2023" },
                { label: "Kemendikbud", value: "Terdaftar Resmi", sub: "NIPT: 041001234" },
                { label: "ISO 9001:2015", value: "Tersertifikasi", sub: "Manajemen Mutu" },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-primary-foreground/50 mb-0.5">{item.label}</p>
                  <p className="text-sm font-semibold text-primary-foreground">{item.value}</p>
                  <p className="text-xs text-primary-foreground/40">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-primary-foreground/40">
            &copy; 2025 Universitas Nusantara. Hak Cipta Dilindungi.
          </p>
          <div className="flex gap-4">
            {["Kebijakan Privasi", "Syarat & Ketentuan", "Sitemap"].map((item) => (
              <a key={item} href="#" className="text-xs text-primary-foreground/40 hover:text-accent transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
