// Local storage helpers for Portal Calon Mahasiswa

const STORAGE_KEYS = {
  USER: "pmb_user",
  SESSION: "pmb_session",
  REGISTRATION: "pmb_registration",
  OTP: "pmb_otp",
  USERS_DB: "pmb_users_db",
} as const

export function getStorageItem<T>(key: string): T | null {
  if (typeof window === "undefined") return null
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch {
    return null
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error("Failed to save to localStorage:", error)
  }
}

export function removeStorageItem(key: string): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(key)
}

export function clearAllStorage(): void {
  if (typeof window === "undefined") return
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key)
  })
}

export { STORAGE_KEYS }
