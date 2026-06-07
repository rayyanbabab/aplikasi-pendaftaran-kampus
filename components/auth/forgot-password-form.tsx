"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { GraduationCap, Loader2, ArrowLeft, Eye, EyeOff, ArrowRight, KeyRound, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Step = "email" | "otp" | "reset" | "done"

const STEP_META: Record<Exclude<Step, "done">, { title: string; subtitle: string }> = {
  email: { title: "Lupa Password?", subtitle: "Masukkan email Anda untuk menerima kode verifikasi" },
  otp: { title: "Cek Email Anda", subtitle: "Masukkan kode OTP 6 digit yang dikirim ke email" },
  reset: { title: "Buat Password Baru", subtitle: "Password minimal 6 karakter, disarankan kombinasi huruf & angka" },
}

export function ForgotPasswordForm() {
  const router = useRouter()
  const { forgotPassword, verifyOtp, resetPassword } = useAuth()
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      const result = await forgotPassword(email)
      if (result.success) {
        setStep("otp")
      } else {
        setError(result.error || "Gagal mengirim OTP")
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      const result = await verifyOtp(otp)
      if (result.success) {
        setStep("reset")
      } else {
        setError(result.error || "Kode OTP salah")
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (newPassword !== confirmPassword) { setError("Password tidak cocok"); return }
    if (newPassword.length < 6) { setError("Password minimal 6 karakter"); return }
    setIsLoading(true)
    try {
      const result = await resetPassword(newPassword)
      if (result.success) {
        setStep("done")
      } else {
        setError(result.error || "Gagal mereset password")
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  const passwordStrength = (() => {
    const p = newPassword
    if (!p) return null
    if (p.length < 6) return { label: "Terlalu pendek", color: "bg-red-500", width: "25%" }
    if (p.length < 8) return { label: "Lemah", color: "bg-orange-400", width: "50%" }
    if (!/[A-Z]/.test(p) || !/[0-9]/.test(p)) return { label: "Sedang", color: "bg-yellow-400", width: "75%" }
    return { label: "Kuat", color: "bg-emerald-500", width: "100%" }
  })()

  // Progress indicator
  const stepIndex = { email: 1, otp: 2, reset: 3, done: 3 }[step]

  return (
    <div className="flex min-h-screen">
      {/* ── LEFT PANEL ── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, oklch(0.18 0.10 255) 0%, oklch(0.25 0.14 265) 50%, oklch(0.20 0.12 248) 100%)",
        }}
      >
        <div className="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, oklch(0.68 0.18 255), transparent)" }} />
        <div className="absolute bottom-[-60px] left-[-60px] w-72 h-72 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, oklch(0.76 0.155 70), transparent)" }} />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">Universitas Nusantara</p>
            <p className="text-white/60 text-xs tracking-widest uppercase">Portal PMB</p>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 border border-white/15">
            <KeyRound className="h-10 w-10 text-white/80" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>
              Pemulihan<br />
              <span style={{
                background: "linear-gradient(135deg, oklch(0.76 0.155 70), oklch(0.82 0.14 60))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>Akses Akun</span>
            </h1>
            <p className="text-white/65 text-sm leading-relaxed max-w-xs">
              Ikuti 3 langkah mudah untuk mendapatkan kembali akses ke akun Anda dengan aman.
            </p>
          </div>

          {/* Step indicators */}
          <div className="space-y-3">
            {[
              { n: 1, label: "Masukkan email terdaftar" },
              { n: 2, label: "Verifikasi kode OTP" },
              { n: 3, label: "Buat password baru" },
            ].map(({ n, label }) => (
              <div key={n} className="flex items-center gap-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-all
                  ${n < stepIndex ? "bg-emerald-500/80 border-emerald-400/60 text-white" :
                    n === stepIndex ? "bg-white/20 border-white/40 text-white" :
                    "bg-white/5 border-white/15 text-white/40"}`}>
                  {n < stepIndex ? <CheckCircle2 className="h-4 w-4" /> : n}
                </div>
                <span className={`text-sm ${n === stepIndex ? "text-white font-semibold" : n < stepIndex ? "text-white/70 line-through" : "text-white/40"}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/40 text-xs">© 2026 Universitas Nusantara.</p>
        </div>
      </div>

      {/* ── RIGHT PANEL — Form ── */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center px-6 py-12 bg-background">
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">Universitas Nusantara</p>
            <p className="text-muted-foreground text-xs">Portal PMB</p>
          </div>
        </div>

        <div className="w-full max-w-[400px] animate-fade-in-up">

          {/* ── DONE state ── */}
          {step === "done" && (
            <div className="space-y-6 text-center">
              <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-emerald-500/10 border-2 border-emerald-500/30">
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold" style={{ fontFamily: "var(--font-serif)" }}>Password Berhasil Direset!</h2>
                <p className="text-muted-foreground text-sm">Silakan masuk kembali menggunakan password baru Anda.</p>
              </div>
              <Button className="w-full h-11 font-semibold gap-2 group" asChild>
                <Link href="/auth/login">
                  Masuk Sekarang <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
            </div>
          )}

          {step !== "done" && (
            <div className="space-y-7">
              {/* Back + Heading */}
              <div className="space-y-4">
                <Link
                  href={step === "email" ? "/auth/login" : "#"}
                  onClick={step !== "email" ? (e) => { e.preventDefault(); setStep(step === "otp" ? "email" : "otp") } : undefined}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {step === "email" ? "Kembali ke login" : "Langkah sebelumnya"}
                </Link>
                <div>
                  <h2 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--font-serif)" }}>
                    {STEP_META[step].title}
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">{STEP_META[step].subtitle}</p>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* ── Email step ── */}
              {step === "email" && (
                <form onSubmit={handleEmailSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm font-medium">Email Terdaftar</Label>
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
                  <Button type="submit" className="w-full h-11 font-semibold gap-2 group" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Mengirim kode...</> :
                      <>Kirim Kode OTP <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" /></>}
                  </Button>
                </form>
              )}

              {/* ── OTP step ── */}
              {step === "otp" && (
                <form onSubmit={handleOtpSubmit} className="space-y-5">
                  <div className="rounded-xl bg-secondary/50 border border-border/60 p-4 text-sm">
                    <p className="text-muted-foreground text-xs uppercase font-semibold tracking-wider mb-1">Dikirim ke</p>
                    <p className="font-semibold text-foreground">{email}</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="otp" className="text-sm font-medium">Kode OTP</Label>
                    <Input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      placeholder="Masukkan 6 digit kode"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      className="h-14 text-center text-2xl font-bold font-mono tracking-[0.5em] bg-secondary/50 border-border/60 focus:bg-background transition-colors"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button type="submit" className="w-full h-11 font-semibold gap-2 group" disabled={isLoading || otp.length !== 6}>
                    {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Memverifikasi...</> :
                      <>Verifikasi Kode <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" /></>}
                  </Button>
                </form>
              )}

              {/* ── Reset Password step ── */}
              {step === "reset" && (
                <form onSubmit={handleResetSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="newPassword" className="text-sm font-medium">Password Baru</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimal 6 karakter"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="h-11 pr-11 bg-secondary/50 border-border/60 focus:bg-background transition-colors"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {passwordStrength && (
                      <div className="space-y-1">
                        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`} style={{ width: passwordStrength.width }} />
                        </div>
                        <p className="text-xs text-muted-foreground">Kekuatan: <span className="font-medium text-foreground">{passwordStrength.label}</span></p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Konfirmasi Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Ulangi password baru"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="h-11 pr-11 bg-secondary/50 border-border/60 focus:bg-background transition-colors"
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1}>
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {confirmPassword && (
                      <p className={`text-xs flex items-center gap-1 ${newPassword === confirmPassword ? "text-emerald-600" : "text-red-500"}`}>
                        {newPassword === confirmPassword ? <><CheckCircle2 className="h-3 w-3" /> Password cocok</> : "Password tidak cocok"}
                      </p>
                    )}
                  </div>
                  <Button type="submit" className="w-full h-11 font-semibold gap-2 group mt-2" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</> :
                      <>Simpan Password Baru <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" /></>}
                  </Button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
