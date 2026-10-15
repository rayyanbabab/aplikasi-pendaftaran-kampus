"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Eye,
  EyeOff,
  Loader2,
  GraduationCap,
  BookOpen,
  Users,
  Award,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  Check,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

const DEMO_ACCOUNTS = [
  {
    role: "Calon Mahasiswa",
    email: "mahasiswa@gmail.com",
    label: "Portal Calon Mahasiswa",
    destination: "Dashboard Siswa",
  },
  {
    role: "Super Admin",
    email: "superadmin@universitasnusantara.ac.id",
    label: "Super Administrator",
    destination: "Admin Panel Utama",
  },
  {
    role: "Verifikator",
    email: "verifikator@universitasnusantara.ac.id",
    label: "Verifikasi Berkas",
    destination: "Antrean Dokumen",
  },
  {
    role: "Keuangan",
    email: "keuangan@universitasnusantara.ac.id",
    label: "Staff Keuangan",
    destination: "Validasi Pembayaran",
  },
]

const DEMO_PASSWORD = "Demo@12345"

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
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const handleSelectDemo = (demoEmail: string, roleName: string) => {
    setEmail(demoEmail)
    setPassword(DEMO_PASSWORD)
    setSelectedRole(roleName)
    setError("")
  }

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
        setError(result.error || "Login gagal. Pastikan email dan password sesuai.")
      }
    } catch {
      setError("Terjadi kesalahan sistem saat menghubungi server.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* LEFT PANEL: Brand and Features */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden bg-slate-900 border-r border-slate-800"
      >
        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 transition-transform group-hover:scale-105">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight font-serif">Universitas Nusantara</p>
              <p className="text-white/60 text-xs tracking-widest uppercase">Portal Admisi PMB</p>
            </div>
          </Link>
        </div>

        {/* Main copy */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold tracking-wider uppercase bg-white/10 text-white/90 border border-white/15">
              Tahun Akademik 2025/2026
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight font-serif">
              Wujudkan Masa Depan Anda Bersama Kami
            </h1>
            <p className="text-white/75 text-base leading-relaxed max-w-sm">
              Platform pendaftaran mahasiswa baru terpadu. Pengisian formulir, upload dokumen resmi, verifikasi pembayaran, dan pemantauan kelulusan.
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
            &copy; {new Date().getFullYear()} Universitas Nusantara. Seluruh hak cipta dilindungi.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL: Login Form */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center px-6 py-12 bg-background">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight font-serif">Universitas Nusantara</p>
            <p className="text-muted-foreground text-xs">Portal PMB</p>
          </div>
        </div>

        <div className="w-full max-w-[420px] space-y-7 animate-fade-in-up">
          {/* Heading */}
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-serif">
              Masuk ke Akun Anda
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Masukkan kredensial akun pendaftaran atau pilih akun demo di bawah
            </p>
          </div>

          {/* Quick Demo Accounts Helper */}
          <div className="rounded-xl border border-border bg-secondary/30 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-primary" />
                Pilihan Akun Demo (1-Klik Isi):
              </span>
              <span className="text-[11px] text-muted-foreground font-mono">Demo@12345</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleSelectDemo(acc.email, acc.role)}
                  className={`p-2 rounded-lg border text-left transition-all text-xs ${
                    selectedRole === acc.role
                      ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary/30"
                      : "border-border bg-card text-foreground hover:bg-secondary/60"
                  }`}
                >
                  <p className="font-semibold truncate">{acc.role}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{acc.email}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold">Email Terdaftar</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-10 text-xs sm:text-sm bg-card border-border"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold">Password</Label>
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
                  placeholder="Masukkan password akun"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-10 pr-10 text-xs sm:text-sm bg-card border-border"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-10 font-semibold text-xs sm:text-sm gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memverifikasi Akun...
                </>
              ) : (
                <>
                  Masuk ke Portal
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground tracking-wider">Belum memiliki akun?</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full h-10 font-semibold text-xs sm:text-sm"
            asChild
          >
            <Link href="/auth/register">
              Registrasi Akun Calon Mahasiswa Baru
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
