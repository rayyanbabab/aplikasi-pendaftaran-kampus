import { Award, BookOpen, Users, Globe, CheckCircle2 } from "lucide-react"

const KEUNGGULAN = [
  {
    icon: Award,
    title: "Terakreditasi A",
    desc: "Seluruh program studi telah terakreditasi BAN-PT dengan nilai unggul dan terpercaya.",
  },
  {
    icon: BookOpen,
    title: "Kurikulum Modern",
    desc: "Kurikulum berbasis OBE (Outcome-Based Education) disesuaikan dengan kebutuhan industri.",
  },
  {
    icon: Users,
    title: "Dosen Berpengalaman",
    desc: "Lebih dari 400 dosen aktif, 70% bergelar Doktor dari universitas dalam dan luar negeri.",
  },
  {
    icon: Globe,
    title: "Kemitraan Internasional",
    desc: "Kerja sama dengan 80+ universitas dan perusahaan global untuk pertukaran mahasiswa dan riset.",
  },
]

export function ProfilKampus() {
  return (
    <section id="profil" className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image with overlays */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
              <img
                src="/images/campus-profile.png"
                alt="Pimpinan dan civitas akademika Universitas Nusantara"
                className="w-full h-full object-cover"
              />
              {/* Bottom gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>

            {/* Floating stat badge */}
            <div className="absolute -bottom-5 -right-4 bg-primary text-primary-foreground rounded-2xl px-5 py-3.5 shadow-xl shadow-primary/30 hidden sm:block">
              <p className="font-serif text-3xl font-bold leading-none">35+</p>
              <p className="text-xs text-primary-foreground/75 font-medium mt-1">Tahun Berdiri</p>
            </div>

            {/* Second decorative badge */}
            <div className="absolute -top-4 -left-4 bg-accent text-accent-foreground rounded-2xl px-4 py-3 shadow-xl shadow-amber-400/30 hidden sm:block animate-float">
              <p className="font-serif text-2xl font-bold leading-none">A</p>
              <p className="text-[10px] text-accent-foreground/75 font-bold uppercase tracking-widest mt-1">BAN-PT</p>
            </div>
          </div>

          {/* Right: Content */}
          <div className="order-1 lg:order-2">
            <span className="section-badge mb-4 inline-flex">
              Tentang Kami
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-foreground leading-[1.15] text-balance mb-5">
              Membentuk Generasi{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, var(--primary), oklch(0.55 0.20 275))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Unggul
              </span>{" "}
              untuk Indonesia
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4 text-[0.9375rem]">
              Universitas Nusantara berdiri sejak 1990 dengan komitmen penuh menghasilkan lulusan berkompeten, berintegritas, dan berdaya saing global. Berlokasi strategis di jantung kota, kampus kami dilengkapi fasilitas bertaraf internasional.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8 text-[0.9375rem]">
              Kami percaya bahwa setiap mahasiswa memiliki potensi luar biasa. Dengan pendekatan pembelajaran inovatif dan lingkungan akademik yang kondusif, kami membantu setiap mahasiswa meraih pencapaian tertinggi.
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              {KEUNGGULAN.map((item) => (
                <div
                  key={item.title}
                  className="flex gap-3 p-4 rounded-xl bg-secondary border border-border hover:border-primary/25 hover:bg-primary/5 transition-all duration-200 group card-hover"
                >
                  <div className="shrink-0 h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                    <item.icon className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{item.title}</p>
                    <p className="text-muted-foreground text-xs leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
