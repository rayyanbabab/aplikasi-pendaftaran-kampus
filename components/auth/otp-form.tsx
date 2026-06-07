"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { GraduationCap, Loader2, Mail, ArrowRight, RefreshCw } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function OtpForm() {
  const router = useRouter()
  const { pendingOtp, verifyOtp, resendOtp } = useAuth()
  const [digits, setDigits] = useState(["", "", "", "", "", ""])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (!pendingOtp) {
      router.push("/auth/register")
    }
  }, [pendingOtp, router])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  const otp = digits.join("")

  const handleDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1)
    const newDigits = [...digits]
    newDigits[index] = digit
    setDigits(newDigits)
    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    const newDigits = [...digits]
    pasted.split("").forEach((char, i) => { newDigits[i] = char })
    setDigits(newDigits)
    const focusIndex = Math.min(pasted.length, 5)
    inputsRef.current[focusIndex]?.focus()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) return
    setError("")
    setIsLoading(true)
    try {
      const result = await verifyOtp(otp)
      if (result.success) {
        router.push("/dashboard")
      } else {
        setError(result.error || "Verifikasi gagal")
        setDigits(["", "", "", "", "", ""])
        inputsRef.current[0]?.focus()
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    setError("")
    const result = await resendOtp()
    if (result.success) {
      setCountdown(60)
      setCanResend(false)
      setDigits(["", "", "", "", "", ""])
      inputsRef.current[0]?.focus()
    }
    setResending(false)
  }

  if (!pendingOtp) return null

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

        <div className="relative z-10 space-y-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 border border-white/15">
            <Mail className="h-10 w-10 text-white/80" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>
              Cek Kotak<br />
              <span style={{
                background: "linear-gradient(135deg, oklch(0.76 0.155 70), oklch(0.82 0.14 60))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>Masuk Email</span>
            </h1>
            <p className="text-white/65 text-sm leading-relaxed max-w-xs">
              Kami telah mengirimkan kode verifikasi 6 digit ke email Anda. Kode berlaku selama{" "}
              <span className="text-white font-semibold">10 menit</span>.
            </p>
          </div>
          <div className="rounded-xl bg-white/8 border border-white/12 p-4 space-y-2">
            <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">Email tujuan</p>
            <p className="text-white font-semibold text-sm break-all">{pendingOtp.email}</p>
          </div>
          <div className="text-white/50 text-xs space-y-1">
            <p>• Tidak menemukan email? Cek folder <strong className="text-white/70">Spam</strong></p>
            <p>• Pastikan email yang didaftarkan sudah benar</p>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/40 text-xs">© 2026 Universitas Nusantara.</p>
        </div>
      </div>

      {/* ── RIGHT PANEL — OTP Form ── */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center px-6 py-12 bg-background">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">Universitas Nusantara</p>
            <p className="text-muted-foreground text-xs">Portal PMB</p>
          </div>
        </div>

        <div className="w-full max-w-[380px] space-y-8 animate-fade-in-up">
          {/* Heading */}
          <div className="space-y-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mb-4">
              <Mail className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--font-serif)" }}>
              Verifikasi OTP
            </h2>
            <p className="text-muted-foreground text-sm">
              Masukkan kode 6 digit yang dikirim ke{" "}
              <span className="font-semibold text-foreground">{pendingOtp.email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* OTP Digit Inputs */}
            <div className="flex gap-3 justify-center" onPaste={handlePaste}>
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputsRef.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  disabled={isLoading}
                  className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 bg-secondary/50 transition-all outline-none
                    ${digit ? "border-primary bg-primary/5 text-primary" : "border-border/60 text-foreground"}
                    focus:border-primary focus:bg-primary/5 focus:shadow-[0_0_0_3px_oklch(from_var(--primary)_l_c_h_/_0.15)]
                    disabled:opacity-50`}
                />
              ))}
            </div>

            <Button
              type="submit"
              className="w-full h-11 font-semibold text-sm gap-2 group"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Memverifikasi...</>
              ) : (
                <>Verifikasi <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" /></>
              )}
            </Button>
          </form>

          {/* Resend */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Tidak menerima kode?</p>
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={resending}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline disabled:opacity-50"
              >
                {resending ? (
                  <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Mengirim ulang...</>
                ) : (
                  <><RefreshCw className="h-3.5 w-3.5" /> Kirim ulang kode OTP</>
                )}
              </button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Kirim ulang dalam{" "}
                <span className="font-bold text-foreground tabular-nums">
                  {String(Math.floor(countdown / 60)).padStart(2, "0")}:{String(countdown % 60).padStart(2, "0")}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
