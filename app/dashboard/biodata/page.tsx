"use client"

import { useState } from "react"
import { User, Users, School, BookOpen, Trophy } from "lucide-react"
import { FormDataPribadi } from "@/components/biodata/form-data-pribadi"
import { FormOrangTua } from "@/components/biodata/form-orang-tua"
import { FormSekolah } from "@/components/biodata/form-sekolah"
import { NilaiRaporList } from "@/components/biodata/nilai-rapor-list"
import { PrestasiList } from "@/components/biodata/prestasi-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "pribadi", label: "Data Pribadi", icon: User },
  { id: "orangtua", label: "Orang Tua", icon: Users },
  { id: "sekolah", label: "Sekolah", icon: School },
  { id: "nilai", label: "Nilai Rapor", icon: BookOpen },
  { id: "prestasi", label: "Prestasi", icon: Trophy },
]

export default function BiodataPage() {
  const [activeTab, setActiveTab] = useState("pribadi")

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Biodata</h1>
        <p className="text-muted-foreground">Lengkapi semua data biodata Anda untuk melanjutkan pendaftaran</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={cn(
                "flex items-center gap-2 rounded-lg border bg-card px-4 py-2.5 text-sm font-medium transition-colors data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              )}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="pribadi" className="mt-6">
          <FormDataPribadi />
        </TabsContent>

        <TabsContent value="orangtua" className="mt-6">
          <FormOrangTua />
        </TabsContent>

        <TabsContent value="sekolah" className="mt-6">
          <FormSekolah />
        </TabsContent>

        <TabsContent value="nilai" className="mt-6">
          <NilaiRaporList />
        </TabsContent>

        <TabsContent value="prestasi" className="mt-6">
          <PrestasiList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
