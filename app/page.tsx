import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { ProfilKampus } from "@/components/landing/profil-kampus"
import { FakultasProdi } from "@/components/landing/fakultas-prodi"
import { BiayaKuliah } from "@/components/landing/biaya-kuliah"
import { JalurPendaftaran } from "@/components/landing/jalur-pendaftaran"
import { JadwalPMB } from "@/components/landing/jadwal-pmb"
import { UnduhanDokumen } from "@/components/landing/unduhan-dokumen"
import { Berita } from "@/components/landing/berita"
import { FAQ } from "@/components/landing/faq"
import { CTAContact } from "@/components/landing/cta-contact"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <ProfilKampus />
      <FakultasProdi />
      <BiayaKuliah />
      <JalurPendaftaran />
      <JadwalPMB />
      <UnduhanDokumen />
      <Berita />
      <FAQ />
      <CTAContact />
      <Footer />
    </div>
  )
}
