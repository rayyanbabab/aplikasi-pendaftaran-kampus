"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, GraduationCap, ArrowRight, CheckCircle2, UserPlus } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

const STEPS = [
  { step: 1, label: "Isi data diri lengkap" },
  { step: 2, label: "Verifikasi email via OTP" },
  { step: 3, label: "Mulai isi formulir PMB" },
]

export function RegisterForm() {
  const router = useRouter()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (formData.password !== formData.confirmPassword) {
      setError("Password tidak cocok")
      return
    }
    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter")
      return
    }
    setIsLoading(true)
    try {
      const result = await register(formData.email, formData.password, formData.phone, formData.name)
      if (result.success) {
        router.push(`/auth/verify-otp`)
      } else {
        setError(result.error || "Registrasi gagal")
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  const passwordStrength = (() => {
    const p = formData.password
    if (!p) return null
    if (p.length < 6) return { label: "Terlalu pendek", color: "bg-red-500", width: "25%" }
    if (p.length < 8) return { label: "Lemah", color: "bg-orange-400", width: "50%" }
    if (!/[A-Z]/.test(p) || !/[0-9]/.test(p)) return { label: "Sedang", color: "bg-yellow-400", width: "75%" }
    return { label: "Kuat", color: "bg-emerald-500", width: "100%" }
  })()

  return (
    <div className="flex min-h-screen">
      {/* ── LEFT PANEL — Steps & Brand ── */}
      <div
        className="hidden lg:flex lg:w-[42%] flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, oklch(0.18 0.10 255) 0%, oklch(0.25 0.14 265) 50%, oklch(0.20 0.12 248) 100%)",
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, oklch(0.68 0.18 255), transparent)" }} />
        <div className="absolute bottom-[-60px] left-[-60px] w-72 h-72 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, oklch(0.76 0.155 70), transparent)" }} />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 w-fit">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">Universitas Nusantara</p>
              <p className="text-white/60 text-xs tracking-widest uppercase">Portal PMB</p>
            </div>
          </Link>
        </div>

        {/* Steps */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-white/10 text-white/80 border border-white/15">
              <UserPlus className="h-3 w-3" /> Pendaftaran Baru
            </div>
            <h1 className="text-3xl font-bold text-white leading-snug" style={{ fontFamily: "var(--font-serif)" }}>
              3 Langkah Mudah<br />
              <span style={{
                background: "linear-gradient(135deg, oklch(0.76 0.155 70), oklch(0.82 0.14 60))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>Untuk Bergabung</span>
            </h1>
            <p className="text-white/60 text-sm leading-relaxed">
              Daftarkan diri Anda sekarang dan mulai perjalanan akademik bersama Universitas Nusantara.
            </p>
          </div>

          {/* Step list */}
          <div className="space-y-4">
            {STEPS.map(({ step, label }) => (
              <div key={step} className="flex items-center gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 border border-white/20 text-white font-bold text-sm">
                  {step}
                </div>
                <div>
                  <p className="text-white/85 text-sm font-medium">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Checklist */}
          <div className="rounded-xl bg-white/8 border border-white/12 p-5 space-y-3 backdrop-blur-sm">
            <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">Yang perlu disiapkan:</p>
            {[
              "KTP / Kartu Pelajar",
              "Ijazah / SKL terakhir",
              "Nilai rapor semester 1–5",
              "Pas foto terbaru (3×4)",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span className="text-white/70 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <p className="text-white/40 text-xs">
            © 2026 Universitas Nusantara. Hak cipta dilindungi.
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL — Register Form ── */}
      <div className="flex w-full lg:w-[58%] flex-col items-center justify-center px-6 py-10 bg-background overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">Universitas Nusantara</p>
            <p className="text-muted-foreground text-xs">Portal PMB</p>
          </div>
        </div>

        <div className="w-full max-w-[420px] space-y-7 animate-fade-in-up">
          {/* Heading */}
          <div className="space-y-1.5">
            <h2 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--font-serif)" }}>
              Buat Akun Baru
            </h2>
            <p className="text-muted-foreground text-sm">
              Sudah punya akun?{" "}
              <Link href="/auth/login" className="text-primary font-semibold hover:underline">
                Masuk di sini
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="animate-fade-in-up">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-medium">Nama Lengkap</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Sesuai KTP / ijazah"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="h-11 bg-secondary/50 border-border/60 focus:bg-background transition-colors"
              />
            </div>

            {/* Email + Phone side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">Email Aktif</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="h-11 bg-secondary/50 border-border/60 focus:bg-background transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-medium">No. WhatsApp</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="h-11 bg-secondary/50 border-border/60 focus:bg-background transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 6 karakter"
                  value={formData.password}
                  onChange={handleChange}
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
              {/* Password strength bar */}
              {passwordStrength && (
                <div className="space-y-1">
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: passwordStrength.width }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Kekuatan password: <span className="font-medium text-foreground">{passwordStrength.label}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Konfirmasi Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Ulangi password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="h-11 pr-11 bg-secondary/50 border-border/60 focus:bg-background transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Match indicator */}
              {formData.confirmPassword && (
                <p className={`text-xs flex items-center gap-1 ${formData.password === formData.confirmPassword ? "text-emerald-600" : "text-red-500"}`}>
                  {formData.password === formData.confirmPassword ? (
                    <><CheckCircle2 className="h-3 w-3" /> Password cocok</>
                  ) : (
                    "Password tidak cocok"
                  )}
                </p>
              )}
            </div>

            {/* Terms */}
            <p className="text-xs text-muted-foreground leading-relaxed">
              Dengan mendaftar, Anda menyetujui{" "}
              <span className="text-primary font-medium cursor-pointer hover:underline">Syarat & Ketentuan</span>{" "}
              dan{" "}
              <span className="text-primary font-medium cursor-pointer hover:underline">Kebijakan Privasi</span>{" "}
              Universitas Nusantara.
            </p>

            <Button
              type="submit"
              className="w-full h-11 font-semibold text-sm gap-2 group"
              disabled={isLoading}
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Membuat akun...</>
              ) : (
                <>Daftar Sekarang <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" /></>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
