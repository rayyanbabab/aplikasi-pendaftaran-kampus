import { GraduationCap } from "lucide-react"
import Link from "next/link"

const INFORMASI_KAMPUS = [
  { label: "Profil & Sejarah", href: "#profil" },
  { label: "Fakultas & Program Studi", href: "#fakultas" },
  { label: "Transparansi Biaya Kuliah", href: "#biaya" },
  { label: "Jalur Pendaftaran", href: "#jalur" },
  { label: "Agenda & Jadwal PMB", href: "#jadwal" },
  { label: "Unduhan Berkas Resmi", href: "#unduhan" },
]

const LAYANAN_PENDAFTARAN = [
  { label: "Pendaftaran Akun Baru", href: "/auth/register" },
  { label: "Masuk Portal Mahasiswa", href: "/auth/login" },
  { label: "Pusat Bantuan & FAQ", href: "#faq" },
  { label: "Kontak Panitia PMB", href: "#kontak" },
  { label: "Tes Rekomendasi Jurusan", href: "/rekomendasi" },
]

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-200 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Identity & Mission */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="font-serif font-bold text-base text-white tracking-tight">
                  Universitas Nusantara
                </p>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  Biro Administrasi Akademik & PMB
                </p>
              </div>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
              Menyelenggarakan pendidikan tinggi berstandar unggul untuk menghasilkan lulusan berkarakter, beretika ilmiah, dan berdaya saing global sejak tahun 1990.
            </p>
            <p className="text-xs text-slate-400">
              Gedung Rektorat Lt. 1, Jl. Nusantara Raya No. 1, Jakarta 10110
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h4 className="font-serif font-bold text-sm text-white mb-3">
              Informasi Kampus
            </h4>
            <ul className="space-y-2 text-xs">
              {INFORMASI_KAMPUS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Admission Links */}
          <div className="lg:col-span-3">
            <h4 className="font-serif font-bold text-sm text-white mb-3">
              Layanan Pendaftaran
            </h4>
            <ul className="space-y-2 text-xs">
              {LAYANAN_PENDAFTARAN.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Accreditations */}
          <div className="lg:col-span-2">
            <h4 className="font-serif font-bold text-sm text-white mb-3">
              Legalitas Resmi
            </h4>
            <div className="space-y-2">
              <div className="p-2.5 rounded border border-white/10 bg-white/5">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Akreditasi Institusi</p>
                <p className="text-xs font-bold text-white mt-0.5">Unggul (A) BAN-PT</p>
              </div>
              <div className="p-2.5 rounded border border-white/10 bg-white/5">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Kementerian RI</p>
                <p className="text-xs font-bold text-white mt-0.5">Izin Dikti No. 041/E/O/1990</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} Universitas Nusantara. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-5">
            <a href="#faq" className="hover:text-white transition-colors">
              Pusat Informasi
            </a>
            <a href="#kontak" className="hover:text-white transition-colors">
              Sekretariat PMB
            </a>
            <Link href="/auth/login" className="hover:text-white transition-colors">
              Portal Calon Mahasiswa
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
