"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, GraduationCap, BookOpen, Users, Award, ArrowRight, ShieldCheck } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

const FEATURES = [
  { icon: BookOpen, text: "Pendaftaran mahasiswa baru online 24/7" },
  { icon: Users, text: "Manajemen berkas & verifikasi real-time" },
  { icon: Award, text: "Informasi prodi & jalur masuk lengkap" },
  { icon: ShieldCheck, text: "Data terenkripsi & aman terjaga" },
]

export function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      const result = await login(email, password)
      if (result.success) {
        const loggedUser = result.user
        if (loggedUser && loggedUser.role && loggedUser.role !== "calon_mahasiswa") {
          router.push("/admin")
        } else {
          router.push("/dashboard")
        }
      } else {
        setError(result.error || "Login gagal")
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* ── LEFT PANEL — Brand & Features ── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, oklch(0.18 0.10 255) 0%, oklch(0.25 0.14 265) 50%, oklch(0.20 0.12 248) 100%)",
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, oklch(0.68 0.18 255), transparent)" }} />
        <div className="absolute bottom-[-60px] left-[-60px] w-72 h-72 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, oklch(0.76 0.155 70), transparent)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, white, transparent)" }} />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">Universitas Nusantara</p>
              <p className="text-white/60 text-xs tracking-widest uppercase">Portal PMB</p>
            </div>
          </div>
        </div>

        {/* Main copy */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-white/10 text-white/80 border border-white/15">
              ✦ Tahun Akademik 2026/2027
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight" style={{ fontFamily: "var(--font-serif)" }}>
              Wujudkan<br />
              <span style={{
                background: "linear-gradient(135deg, oklch(0.76 0.155 70), oklch(0.82 0.14 60))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>Masa Depanmu</span><br />
              Bersama Kami
            </h1>
            <p className="text-white/65 text-base leading-relaxed max-w-sm">
              Platform pendaftaran mahasiswa baru terpadu. Daftar, upload berkas, dan pantau status penerimaan — semuanya dalam satu portal.
            </p>
          </div>

          <div className="space-y-3">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 border border-white/15">
                  <Icon className="h-4 w-4 text-white/80" />
                </div>
                <span className="text-white/75 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="relative z-10">
          <p className="text-white/40 text-xs">
            © 2026 Universitas Nusantara. Hak cipta dilindungi.
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL — Login Form ── */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center px-6 py-12 bg-background">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">Universitas Nusantara</p>
            <p className="text-muted-foreground text-xs">Portal PMB</p>
          </div>
        </div>

        <div className="w-full max-w-[400px] space-y-8 animate-fade-in-up">
          {/* Heading */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--font-serif)" }}>
              Selamat datang
            </h2>
            <p className="text-muted-foreground text-sm">
              Masuk ke akun Anda untuk melanjutkan
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert variant="destructive" className="animate-fade-in-up">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-11 bg-secondary/50 border-border/60 focus:bg-background transition-colors"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Lupa password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-11 pr-11 bg-secondary/50 border-border/60 focus:bg-background transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 font-semibold text-sm gap-2 group"
              disabled={isLoading}
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Memverifikasi...</>
              ) : (
                <>Masuk <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" /></>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground tracking-wider">Belum punya akun?</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full h-11 font-semibold text-sm"
            asChild
          >
            <Link href="/auth/register">
              Daftar Akun Baru
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
