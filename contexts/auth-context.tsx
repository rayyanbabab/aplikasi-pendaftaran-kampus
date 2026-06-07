"use client"

import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from "react"
import type { User } from "@/types/registration"
import { getStorageItem, setStorageItem, removeStorageItem, STORAGE_KEYS } from "@/lib/storage"
import { supabase } from "@/lib/supabase"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  pendingOtp: { email: string; otp: string; type: "register" | "forgot" } | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>
  register: (email: string, password: string, phone: string, name: string) => Promise<{ success: boolean; error?: string; otp?: string }>
  verifyOtp: (otp: string) => Promise<{ success: boolean; error?: string }>
  resendOtp: () => Promise<{ success: boolean; otp?: string }>
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string; otp?: string }>
  resetPassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function translateAuthError(message: string): string {
  if (message.includes("Invalid login credentials")) return "Email atau password salah"
  if (message.includes("Email not confirmed")) return "Email belum dikonfirmasi. Silakan cek inbox atau hubungi admin."
  if (message.includes("User already registered")) return "Email sudah terdaftar, silakan login"
  if (message.includes("Password should be at least")) return "Password minimal 6 karakter"
  if (message.includes("Unable to validate email address")) return "Format email tidak valid"
  if (message.includes("Email rate limit exceeded")) return "Terlalu banyak percobaan, coba lagi nanti"
  if (message.includes("signup is disabled")) return "Pendaftaran akun baru sedang dinonaktifkan"
  if (message.includes("network") || message.includes("fetch")) return "Tidak dapat terhubung ke server"
  return message
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pendingOtp, setPendingOtp] = useState<{
    email: string
    otp: string
    type: "register" | "forgot"
    userData?: { email: string; password: string; phone: string; name: string }
  } | null>(null)

  const supabaseVerified = useRef(false)

  // Mapping email → role untuk akun staff (fallback jika profiles belum ada)
  const getRoleForEmail = useCallback((email: string | undefined): string => {
    if (!email) return "calon_mahasiswa"
    const roleMap: Record<string, string> = {
      "superadmin@universitasnusantara.ac.id": "super_admin",
      "adminpmb@universitasnusantara.ac.id": "admin_pmb",
      "verifikator@universitasnusantara.ac.id": "verifikator",
      "keuangan@universitasnusantara.ac.id": "keuangan",
      "penguji@universitasnusantara.ac.id": "penguji",
    }
    return roleMap[email.toLowerCase().trim()] || "calon_mahasiswa"
  }, [])

  const withTimeout = useCallback(<T,>(promise: PromiseLike<T>, ms: number): Promise<T | null> => {
    return Promise.race([
      Promise.resolve(promise),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
    ])
  }, [])

  const buildUserFromAuth = useCallback((authUser: any): User => {
    return {
      id: authUser.id,
      name: authUser.user_metadata?.name || authUser.email?.split("@")[0] || "User",
      email: authUser.email || "",
      phone: authUser.user_metadata?.phone || "",
      role: getRoleForEmail(authUser.email) as any,
      isVerified: true,
      createdAt: new Date().toISOString(),
    }
  }, [getRoleForEmail])

  const fetchProfile = useCallback(async (userId: string): Promise<User | null> => {
    const TIMEOUT_MS = 5000

    try {
      const dbResult = await withTimeout(
        supabase
          .from("profiles")
          .select("id, name, email, phone, role, is_verified, created_at")
          .eq("id", userId)
          .single(),
        TIMEOUT_MS
      )

      if (dbResult && dbResult.data && !dbResult.error) {
        const data = dbResult.data
        return {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone || "",
          role: data.role,
          isVerified: data.is_verified,
          createdAt: data.created_at,
        }
      }

      // Fallback: bangun dari data Auth API
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) return null

      const fallbackUser = buildUserFromAuth(authUser)

      // Buat/update profile di background
      withTimeout(
        supabase.from("profiles").upsert(
          {
            id: authUser.id,
            name: authUser.user_metadata?.name || authUser.email?.split("@")[0] || "User",
            email: authUser.email || "",
            phone: authUser.user_metadata?.phone || "",
            role: getRoleForEmail(authUser.email),
            is_verified: true,
          },
          { onConflict: "id" }
        ),
        TIMEOUT_MS
      )

      return fallbackUser
    } catch {
      return null
    }
  }, [getRoleForEmail, buildUserFromAuth, withTimeout])

  // ============================================================
  // EFEK UTAMA: Restore sesi dari Supabase saat mount
  // ============================================================
  useEffect(() => {
    let cancelled = false

    // Coba restore dari localStorage dulu agar UI cepat muncul
    const storedUser = getStorageItem<User>(STORAGE_KEYS.USER)
    const storedSession = getStorageItem<string>(STORAGE_KEYS.SESSION)

    if (storedUser && storedSession) {
      setUser(storedUser)
      setIsLoading(false)
    }

    const verifyWithSupabase = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (cancelled) return

        if (session) {
          const profile = await fetchProfile(session.user.id)
          if (cancelled) return

          if (profile) {
            setUser(profile)
            setStorageItem(STORAGE_KEYS.USER, profile)
            setStorageItem(STORAGE_KEYS.SESSION, session.access_token)
          } else {
            const fallback = buildUserFromAuth(session.user)
            setUser(fallback)
            setStorageItem(STORAGE_KEYS.USER, fallback)
            setStorageItem(STORAGE_KEYS.SESSION, session.access_token)
          }
        } else {
          // Tidak ada session Supabase yang valid — clear semua
          setUser(null)
          removeStorageItem(STORAGE_KEYS.USER)
          removeStorageItem(STORAGE_KEYS.SESSION)
        }
      } catch (err) {
        console.error("[Auth] Gagal verifikasi sesi Supabase:", err)
        // Jika gagal cek Supabase, biarkan localStorage tetap (offline tolerance)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    verifyWithSupabase()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(null)
        removeStorageItem(STORAGE_KEYS.USER)
        removeStorageItem(STORAGE_KEYS.SESSION)
        return
      }

      if (session && !supabaseVerified.current) {
        supabaseVerified.current = true
        const profile = await fetchProfile(session.user.id)
        const resolvedUser = profile || buildUserFromAuth(session.user)
        setUser(resolvedUser)
        setStorageItem(STORAGE_KEYS.USER, resolvedUser)
        setStorageItem(STORAGE_KEYS.SESSION, session.access_token)
      }
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [fetchProfile, buildUserFromAuth])

  // ============================================================
  // LOGIN — hanya via Supabase Auth
  // ============================================================
  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        return { success: false, error: translateAuthError(error.message) }
      }

      if (!data?.user) {
        return { success: false, error: "Gagal mengambil data pengguna dari server" }
      }

      const profile = await fetchProfile(data.user.id)
      const resolvedUser = profile || buildUserFromAuth(data.user)

      setUser(resolvedUser)
      setStorageItem(STORAGE_KEYS.USER, resolvedUser)
      setStorageItem(STORAGE_KEYS.SESSION, data.session?.access_token || `session_${Date.now()}`)

      return { success: true, user: resolvedUser }
    } catch (err: any) {
      return { success: false, error: translateAuthError(err.message || "Terjadi kesalahan sistem") }
    }
  }, [fetchProfile, buildUserFromAuth])

  // ============================================================
  // REGISTER
  // ============================================================
  const register = useCallback(async (
    email: string,
    password: string,
    phone: string,
    name: string
  ): Promise<{ success: boolean; error?: string; otp?: string }> => {
    try {
      // Cek duplikat email
      try {
        const { data } = await supabase
          .from("profiles")
          .select("email")
          .eq("email", email.toLowerCase().trim())
          .maybeSingle()
        if (data) return { success: false, error: "Email sudah terdaftar, silakan login" }
      } catch {
        console.warn("[Register] Tidak bisa cek duplikat email, melanjutkan...")
      }

      const otp = generateOtp()
      setPendingOtp({ email, otp, type: "register", userData: { email, password, phone, name } })
      return { success: true, otp }
    } catch (err: any) {
      return { success: false, error: translateAuthError(err.message || "Gagal memulai pendaftaran") }
    }
  }, [])

  // ============================================================
  // VERIFY OTP
  // ============================================================
  const verifyOtp = useCallback(async (inputOtp: string): Promise<{ success: boolean; error?: string }> => {
    if (!pendingOtp) return { success: false, error: "Tidak ada verifikasi OTP yang pending" }
    if (inputOtp !== pendingOtp.otp) return { success: false, error: "Kode OTP salah" }

    if (pendingOtp.type === "register" && pendingOtp.userData) {
      try {
        const { email, password, name, phone } = pendingOtp.userData
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name, phone } },
        })

        if (error) {
          if (error.message.includes("User already registered")) {
            const loginResult = await supabase.auth.signInWithPassword({ email, password })
            if (!loginResult.error && loginResult.data?.user) {
              const profile = await fetchProfile(loginResult.data.user.id)
              const resolvedUser = profile || buildUserFromAuth(loginResult.data.user)
              setUser(resolvedUser)
              setStorageItem(STORAGE_KEYS.USER, resolvedUser)
              setStorageItem(STORAGE_KEYS.SESSION, loginResult.data.session?.access_token || `session_${Date.now()}`)
              setPendingOtp(null)
              return { success: true }
            }
          }
          return { success: false, error: translateAuthError(error.message) }
        }

        if (data?.user) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          if (data.session) {
            const profile = await fetchProfile(data.user.id)
            const resolvedUser = profile || buildUserFromAuth(data.user)
            setUser(resolvedUser)
            setStorageItem(STORAGE_KEYS.USER, resolvedUser)
            setStorageItem(STORAGE_KEYS.SESSION, data.session.access_token)
          } else {
            setPendingOtp(null)
            return {
              success: false,
              error: "Akun berhasil dibuat! Cek email kamu untuk konfirmasi, lalu login.",
            }
          }
        }
      } catch (err: any) {
        return { success: false, error: translateAuthError(err.message || "Gagal membuat akun") }
      }
    }

    setPendingOtp(null)
    return { success: true }
  }, [pendingOtp, fetchProfile, buildUserFromAuth])

  const resendOtp = useCallback(async (): Promise<{ success: boolean; otp?: string }> => {
    if (!pendingOtp) return { success: false }
    const newOtp = generateOtp()
    setPendingOtp({ ...pendingOtp, otp: newOtp })
    return { success: true, otp: newOtp }
  }, [pendingOtp])

  const forgotPassword = useCallback(async (email: string): Promise<{ success: boolean; error?: string; otp?: string }> => {
    try {
      let emailExists = false
      try {
        const { data } = await supabase
          .from("profiles")
          .select("email")
          .eq("email", email.toLowerCase().trim())
          .maybeSingle()
        emailExists = !!data
      } catch {
        emailExists = true
      }
      if (!emailExists) return { success: false, error: "Email tidak terdaftar" }
      const otp = generateOtp()
      setPendingOtp({ email, otp, type: "forgot" })
      return { success: true, otp }
    } catch (err: any) {
      return { success: false, error: translateAuthError(err.message || "Terjadi kesalahan") }
    }
  }, [])

  const resetPassword = useCallback(async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!pendingOtp || pendingOtp.type !== "forgot") {
      return { success: false, error: "Tidak ada reset password yang pending" }
    }
    setPendingOtp(null)
    return { success: true }
  }, [pendingOtp])

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error("[Auth] Error saat sign out:", err)
    } finally {
      setUser(null)
      removeStorageItem(STORAGE_KEYS.USER)
      removeStorageItem(STORAGE_KEYS.SESSION)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        pendingOtp: pendingOtp ? { email: pendingOtp.email, otp: pendingOtp.otp, type: pendingOtp.type } : null,
        login,
        register,
        verifyOtp,
        resendOtp,
        forgotPassword,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
