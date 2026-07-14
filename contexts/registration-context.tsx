"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import type {
  RegistrationData,
  DataPribadi,
  DataOrangTua,
  DataSekolah,
  NilaiRapor,
  Prestasi,
  DocumentUpload,
  PilihanProdi,
  Pembayaran,
  ApplicationStatus,
  StatusHistoryItem,
  UploadedFile,
  PaymentMethod,
} from "@/types/registration"
import { getStorageItem, setStorageItem, STORAGE_KEYS } from "@/lib/storage"
import { INITIAL_DOCUMENTS, generateNoPendaftaran, generateVirtualAccount, PRODI_LIST } from "@/lib/mock-data"
import { useAuth } from "./auth-context"
import { supabase } from "@/lib/supabase"

interface RegistrationContextType {
  registration: RegistrationData | null
  isLoading: boolean
  completionPercentage: number
  // Data Pribadi
  updateDataPribadi: (data: Partial<DataPribadi>) => void
  // Data Orang Tua
  updateDataOrangTua: (data: Partial<DataOrangTua>) => void
  // Data Sekolah
  updateDataSekolah: (data: Partial<DataSekolah>) => void
  // Nilai Rapor
  addNilaiRapor: (nilai: Omit<NilaiRapor, "id">) => void
  updateNilaiRapor: (id: string, nilai: Partial<NilaiRapor>) => void
  removeNilaiRapor: (id: string) => void
  // Prestasi
  addPrestasi: (prestasi: Omit<Prestasi, "id">) => void
  updatePrestasi: (id: string, prestasi: Partial<Prestasi>) => void
  removePrestasi: (id: string) => void
  // Documents
  uploadDocument: (type: DocumentUpload["type"], file: UploadedFile) => void
  removeDocument: (type: DocumentUpload["type"]) => void
  // Pilihan Prodi
  setPilihanProdi: (pilihan: PilihanProdi[]) => void
  // Payment
  initPayment: (method: PaymentMethod, bankCode?: string, ewalletProvider?: string) => void
  uploadBuktiTransfer: (file: UploadedFile) => void
  removePaymentProof: () => void
  resetPayment: () => void
  // Status
  submitRegistration: () => void
  // Reset
  resetRegistration: () => void
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined)

const INITIAL_DATA_PRIBADI: DataPribadi = {
  namaLengkap: "",
  nik: "",
  tempatLahir: "",
  tanggalLahir: "",
  jenisKelamin: "",
  agama: "",
  kewarganegaraan: "Indonesia",
  alamat: "",
  rt: "",
  rw: "",
  kelurahan: "",
  kecamatan: "",
  kabupaten: "",
  provinsi: "",
  kodePos: "",
  noHp: "",
  email: "",
}

const INITIAL_DATA_ORANGTUA: DataOrangTua = {
  namaAyah: "",
  nikAyah: "",
  pekerjaanAyah: "",
  pendidikanAyah: "",
  penghasilanAyah: "",
  noHpAyah: "",
  namaIbu: "",
  nikIbu: "",
  pekerjaanIbu: "",
  pendidikanIbu: "",
  penghasilanIbu: "",
  noHpIbu: "",
  alamatOrangTua: "",
}

const INITIAL_DATA_SEKOLAH: DataSekolah = {
  namaSekolah: "",
  npsn: "",
  jenjang: "",
  jurusan: "",
  alamatSekolah: "",
  kabupatenSekolah: "",
  provinsiSekolah: "",
  tahunLulus: "",
  nisn: "",
  noIjazah: "",
}

function createInitialRegistration(userId: string): RegistrationData {
  return {
    userId,
    dataPribadi: INITIAL_DATA_PRIBADI,
    dataOrangTua: INITIAL_DATA_ORANGTUA,
    dataSekolah: INITIAL_DATA_SEKOLAH,
    nilaiRapor: [],
    prestasi: [],
    documents: [...INITIAL_DOCUMENTS],
    pilihanProdi: [],
    status: "draft",
    statusHistory: [{ status: "draft", timestamp: new Date().toISOString(), note: "Pendaftaran dimulai" }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

function calculateCompletion(reg: RegistrationData): number {
  let total = 0
  let filled = 0

  // Data Pribadi (20%)
  const dataPribadi = reg.dataPribadi || {}
  const pribadiValues = Object.values(dataPribadi)
  const pribadiFields = pribadiValues.filter((v) => v !== "" && v != null)
  total += 20
  const pribadiTotal = pribadiValues.length || 1
  filled += (pribadiFields.length / pribadiTotal) * 20

  // Data Orang Tua (15%)
  const dataOrangTua = reg.dataOrangTua || {}
  const ortuFields = Object.values(dataOrangTua).filter((v) => v !== "" && v !== undefined && v !== null)
  const requiredOrtuFields = Object.keys(dataOrangTua).filter((k) => !k.includes("Wali"))
  total += 15
  const ortuTotal = requiredOrtuFields.length || 1
  filled += (ortuFields.length / ortuTotal) * 15

  // Data Sekolah (15%)
  const dataSekolah = reg.dataSekolah || {}
  const sekolahValues = Object.values(dataSekolah)
  const sekolahFields = sekolahValues.filter((v) => v !== "" && v != null)
  total += 15
  const sekolahTotal = sekolahValues.length || 1
  filled += (sekolahFields.length / sekolahTotal) * 15

  // Nilai Rapor (10%)
  const nilaiRapor = reg.nilaiRapor || []
  total += 10
  filled += nilaiRapor.length >= 5 ? 10 : (nilaiRapor.length / 5) * 10

  // Documents (20%)
  const documents = reg.documents || []
  const requiredDocs = documents.filter((d) => d.required)
  const uploadedDocs = requiredDocs.filter((d) => d.file)
  total += 20
  filled += requiredDocs.length > 0 ? (uploadedDocs.length / requiredDocs.length) * 20 : 0

  // Pilihan Prodi (10%)
  const pilihanProdi = reg.pilihanProdi || []
  total += 10
  filled += pilihanProdi.length >= 1 ? 10 : 0

  // Pembayaran (10%)
  total += 10
  filled += reg.pembayaran?.status === "verified" ? 10 : reg.pembayaran?.buktiTransfer ? 5 : 0

  return Math.round((filled / total) * 100)
}

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [registration, setRegistration] = useState<RegistrationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 1. Sinkronisasi Membaca Data dari Supabase Database saat User Terautentikasi
  useEffect(() => {
    const loadRegistrationFromSupabase = async () => {
      if (!user) {
        setRegistration(null)
        setIsLoading(false)
        return
      }

      setIsLoading(true)

      try {
        const { data, error } = await supabase
          .from("registrations")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle()

        if (error) {
          console.error("Gagal membaca registrasi dari Supabase:", error)
        }

        if (data) {
          // Map data dari format DB PostgreSQL ke model data TypeScript RegistrationData
          const storedDocuments: DocumentUpload[] = Array.isArray(data.documents) && data.documents.length > 0
            ? data.documents as DocumentUpload[]
            : []

          // Gabungkan dengan INITIAL_DOCUMENTS agar semua tipe dokumen selalu ada,
          // sambil mempertahankan file yang sudah diupload sebelumnya
          const mergedDocuments: DocumentUpload[] = INITIAL_DOCUMENTS.map((initDoc) => {
            const existing = storedDocuments.find((d) => d.type === initDoc.type)
            return existing ? { ...initDoc, ...existing } : initDoc
          })

          const loadedReg: RegistrationData = {
            userId: data.user_id,
            noPendaftaran: data.no_pendaftaran || undefined,
            status: data.status as any,
            dataPribadi: data.data_pribadi as any,
            dataOrangTua: data.data_orang_tua as any,
            dataSekolah: data.data_sekolah as any,
            nilaiRapor: data.nilai_rapor as any,
            prestasi: data.prestasi as any,
            documents: mergedDocuments,
            pilihanProdi: data.pilihan_prodi as any,
            pembayaran: data.pembayaran as any,
            statusHistory: data.status_history as any,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          }
          setRegistration(loadedReg)
          setStorageItem(`${STORAGE_KEYS.REGISTRATION}_${user.id}`, loadedReg)
        } else {
          // Jika belum ada di Supabase, coba periksa dari cache lokal (localStorage)
          const stored = getStorageItem<RegistrationData>(`${STORAGE_KEYS.REGISTRATION}_${user.id}`)
          if (stored) {
            // Merge dokumen dari cache dengan INITIAL_DOCUMENTS agar tidak kosong
            const cachedDocs = Array.isArray(stored.documents) && stored.documents.length > 0
              ? stored.documents
              : []
            const mergedCachedDocs: DocumentUpload[] = INITIAL_DOCUMENTS.map((initDoc) => {
              const existing = cachedDocs.find((d) => d.type === initDoc.type)
              return existing ? { ...initDoc, ...existing } : initDoc
            })
            const storedWithMergedDocs = { ...stored, documents: mergedCachedDocs }
            setRegistration(storedWithMergedDocs)
            // Sinkronisasi data lokal (sudah ter-merge) ke database online Supabase
            await supabase.from("registrations").upsert({
              user_id: user.id,
              no_pendaftaran: storedWithMergedDocs.noPendaftaran || null,
              status: storedWithMergedDocs.status,
              data_pribadi: storedWithMergedDocs.dataPribadi,
              data_orang_tua: storedWithMergedDocs.dataOrangTua,
              data_sekolah: storedWithMergedDocs.dataSekolah,
              nilai_rapor: storedWithMergedDocs.nilaiRapor,
              prestasi: storedWithMergedDocs.prestasi,
              documents: storedWithMergedDocs.documents,
              pilihan_prodi: storedWithMergedDocs.pilihanProdi,
              pembayaran: storedWithMergedDocs.pembayaran || null,
              status_history: storedWithMergedDocs.statusHistory,
            }, { onConflict: "user_id" })
          } else {
            // Jika data benar-benar baru, buat inisialisasi awal
            const newReg = createInitialRegistration(user.id)
            newReg.dataPribadi.email = user.email
            newReg.dataPribadi.noHp = user.phone
            newReg.dataPribadi.namaLengkap = user.name
            setRegistration(newReg)
            setStorageItem(`${STORAGE_KEYS.REGISTRATION}_${user.id}`, newReg)

            // Buat row data baru di Supabase secara proaktif
            await supabase.from("registrations").upsert({
              user_id: user.id,
              no_pendaftaran: newReg.noPendaftaran || null,
              status: newReg.status,
              data_pribadi: newReg.dataPribadi,
              data_orang_tua: newReg.dataOrangTua,
              data_sekolah: newReg.dataSekolah,
              nilai_rapor: newReg.nilaiRapor,
              prestasi: newReg.prestasi,
              documents: newReg.documents,
              pilihan_prodi: newReg.pilihanProdi,
              pembayaran: newReg.pembayaran || null,
              status_history: newReg.statusHistory,
            }, { onConflict: "user_id" })
          }
        }
      } catch (err) {
        console.error("Exception loading registration from Supabase:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadRegistrationFromSupabase()
  }, [user])

  // Realtime subscription for the student's registration row
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel(`public:registrations:user_id=eq.${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "registrations",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("Realtime registration update received for student:", payload)
          if (payload.new) {
            const data = payload.new as any
            const storedDocs: DocumentUpload[] = Array.isArray(data.documents) && data.documents.length > 0
              ? data.documents as DocumentUpload[]
              : []
            const mergedDocs: DocumentUpload[] = INITIAL_DOCUMENTS.map((initDoc) => {
              const existing = storedDocs.find((d) => d.type === initDoc.type)
              return existing ? { ...initDoc, ...existing } : initDoc
            })
            const loadedReg: RegistrationData = {
              userId: data.user_id,
              noPendaftaran: data.no_pendaftaran || undefined,
              status: data.status as any,
              dataPribadi: data.data_pribadi as any,
              dataOrangTua: data.data_orang_tua as any,
              dataSekolah: data.data_sekolah as any,
              nilaiRapor: data.nilai_rapor as any,
              prestasi: data.prestasi as any,
              documents: mergedDocs,
              pilihanProdi: data.pilihan_prodi as any,
              pembayaran: data.pembayaran as any,
              statusHistory: data.status_history as any,
              createdAt: data.created_at,
              updatedAt: data.updated_at,
            }
            setRegistration(loadedReg)
            setStorageItem(`${STORAGE_KEYS.REGISTRATION}_${user.id}`, loadedReg)
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [user])

  // 2. Fungsi Menyimpan Data ke Supabase Database secara Asinkron (Background Sync)
  const saveRegistration = useCallback(async (reg: RegistrationData) => {
    const updated = { ...reg, updatedAt: new Date().toISOString() }
    setRegistration(updated)

    if (user) {
      // Simpan di cache lokal terlebih dahulu (respons super cepat bagi pengguna)
      setStorageItem(`${STORAGE_KEYS.REGISTRATION}_${user.id}`, updated)

      try {
        // Sinkronisasi data dengan Supabase PostgreSQL di latar belakang
        const { error } = await supabase
          .from("registrations")
          .upsert({
            user_id: user.id,
            no_pendaftaran: reg.noPendaftaran || null,
            status: reg.status,
            data_pribadi: reg.dataPribadi,
            data_orang_tua: reg.dataOrangTua,
            data_sekolah: reg.dataSekolah,
            nilai_rapor: reg.nilaiRapor,
            prestasi: reg.prestasi,
            documents: reg.documents,
            pilihan_prodi: reg.pilihanProdi,
            pembayaran: reg.pembayaran || null,
            status_history: reg.statusHistory,
            updated_at: new Date().toISOString(),
          }, { onConflict: "user_id" })

        if (error) {
          console.error("Gagal sinkronisasi data formulir ke Supabase registrations:", error.message)
        }
      } catch (err) {
        console.error("Terjadi exception saat sinkronisasi ke database online:", err)
      }
    }
  }, [user])

  const updateDataPribadi = useCallback((data: Partial<DataPribadi>) => {
    if (!registration) return
    saveRegistration({
      ...registration,
      dataPribadi: { ...registration.dataPribadi, ...data },
    })
  }, [registration, saveRegistration])

  const updateDataOrangTua = useCallback((data: Partial<DataOrangTua>) => {
    if (!registration) return
    saveRegistration({
      ...registration,
      dataOrangTua: { ...registration.dataOrangTua, ...data },
    })
  }, [registration, saveRegistration])

  const updateDataSekolah = useCallback((data: Partial<DataSekolah>) => {
    if (!registration) return
    saveRegistration({
      ...registration,
      dataSekolah: { ...registration.dataSekolah, ...data },
    })
  }, [registration, saveRegistration])

  const addNilaiRapor = useCallback((nilai: Omit<NilaiRapor, "id">) => {
    if (!registration) return
    const newNilai: NilaiRapor = {
      ...nilai,
      id: `nilai_${Date.now()}`,
    }
    saveRegistration({
      ...registration,
      nilaiRapor: [...registration.nilaiRapor, newNilai],
    })
  }, [registration, saveRegistration])

  const updateNilaiRapor = useCallback((id: string, nilai: Partial<NilaiRapor>) => {
    if (!registration) return
    saveRegistration({
      ...registration,
      nilaiRapor: registration.nilaiRapor.map((n) => (n.id === id ? { ...n, ...nilai } : n)),
    })
  }, [registration, saveRegistration])

  const removeNilaiRapor = useCallback((id: string) => {
    if (!registration) return
    saveRegistration({
      ...registration,
      nilaiRapor: registration.nilaiRapor.filter((n) => n.id !== id),
    })
  }, [registration, saveRegistration])

  const addPrestasi = useCallback((prestasi: Omit<Prestasi, "id">) => {
    if (!registration) return
    const newPrestasi: Prestasi = {
      ...prestasi,
      id: `prestasi_${Date.now()}`,
    }
    saveRegistration({
      ...registration,
      prestasi: [...registration.prestasi, newPrestasi],
    })
  }, [registration, saveRegistration])

  const updatePrestasi = useCallback((id: string, prestasi: Partial<Prestasi>) => {
    if (!registration) return
    saveRegistration({
      ...registration,
      prestasi: registration.prestasi.map((p) => (p.id === id ? { ...p, ...prestasi } : p)),
    })
  }, [registration, saveRegistration])

  const removePrestasi = useCallback((id: string) => {
    if (!registration) return
    saveRegistration({
      ...registration,
      prestasi: registration.prestasi.filter((p) => p.id !== id),
    })
  }, [registration, saveRegistration])

  const uploadDocument = useCallback((type: DocumentUpload["type"], file: UploadedFile) => {
    if (!registration) return
    saveRegistration({
      ...registration,
      documents: registration.documents.map((d) =>
        d.type === type ? { ...d, file } : d
      ),
    })
  }, [registration, saveRegistration])

  const removeDocument = useCallback((type: DocumentUpload["type"]) => {
    if (!registration) return
    saveRegistration({
      ...registration,
      documents: registration.documents.map((d) =>
        d.type === type ? { ...d, file: undefined } : d
      ),
    })
  }, [registration, saveRegistration])

  const setPilihanProdi = useCallback((pilihan: PilihanProdi[]) => {
    if (!registration) return
    saveRegistration({
      ...registration,
      pilihanProdi: pilihan,
    })
  }, [registration, saveRegistration])

  const initPayment = useCallback((method: PaymentMethod, bankCode?: string, ewalletProvider?: string) => {
    if (!registration) return

    const prodi = registration.pilihanProdi[0]
    const prodiData = PRODI_LIST.find((p) => p.id === prodi?.prodiId)
    const amount = prodiData?.biayaRegistrasi || 350000

    const payment: Pembayaran = {
      id: `pay_${Date.now()}`,
      amount,
      method,
      status: "pending",
      expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    }

    if (method === "virtual_account" && bankCode) {
      payment.bankCode = bankCode
      payment.virtualAccountNumber = generateVirtualAccount(bankCode)
    } else if (method === "qris") {
      payment.qrisCode = `QRIS-PMB-${Date.now()}`
    } else if (method === "ewallet" && ewalletProvider) {
      payment.ewalletProvider = ewalletProvider
      payment.ewalletNumber = `${ewalletProvider.toUpperCase()}-${Math.floor(Math.random() * 1000000)}`
    }

    saveRegistration({
      ...registration,
      pembayaran: payment,
    })
  }, [registration, saveRegistration])

  const uploadBuktiTransfer = useCallback((file: UploadedFile) => {
    if (!registration || !registration.pembayaran) return
    saveRegistration({
      ...registration,
      pembayaran: {
        ...registration.pembayaran,
        buktiTransfer: file,
        paidAt: new Date().toISOString(),
      },
    })
  }, [registration, saveRegistration])

  const removePaymentProof = useCallback(() => {
    if (!registration || !registration.pembayaran) return
    const { buktiTransfer, paidAt, ...rest } = registration.pembayaran
    saveRegistration({
      ...registration,
      pembayaran: rest as Pembayaran,
    })
  }, [registration, saveRegistration])

  const resetPayment = useCallback(() => {
    if (!registration) return
    saveRegistration({
      ...registration,
      pembayaran: undefined,
    })
  }, [registration, saveRegistration])

  const submitRegistration = useCallback(() => {
    if (!registration) return

    const noPendaftaran = registration.noPendaftaran || generateNoPendaftaran()
    const newStatus: ApplicationStatus = "menunggu_verifikasi"
    const historyItem: StatusHistoryItem = {
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: "Pendaftaran disubmit, menunggu verifikasi berkas",
    }

    saveRegistration({
      ...registration,
      noPendaftaran,
      status: newStatus,
      statusHistory: [...registration.statusHistory, historyItem],
    })
  }, [registration, saveRegistration])

  const resetRegistration = useCallback(() => {
    if (!user) return
    const newReg = createInitialRegistration(user.id)
    newReg.dataPribadi.email = user.email
    newReg.dataPribadi.noHp = user.phone
    newReg.dataPribadi.namaLengkap = user.name
    saveRegistration(newReg)
  }, [user, saveRegistration])

  const completionPercentage = registration ? calculateCompletion(registration) : 0

  return (
    <RegistrationContext.Provider
      value={{
        registration,
        isLoading,
        completionPercentage,
        updateDataPribadi,
        updateDataOrangTua,
        updateDataSekolah,
        addNilaiRapor,
        updateNilaiRapor,
        removeNilaiRapor,
        addPrestasi,
        updatePrestasi,
        removePrestasi,
        uploadDocument,
        removeDocument,
        setPilihanProdi,
        initPayment,
        uploadBuktiTransfer,
        removePaymentProof,
        resetPayment,
        submitRegistration,
        resetRegistration,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  )
}

export function useRegistration() {
  const context = useContext(RegistrationContext)
  if (context === undefined) {
    throw new Error("useRegistration must be used within a RegistrationProvider")
  }
  return context
}
