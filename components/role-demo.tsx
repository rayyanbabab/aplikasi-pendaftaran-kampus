"use client";

import { useState } from "react";
import type { RoleType, Permission } from "@/types/roles";
import { ROLES, getAllRoles, hasPermission } from "@/lib/roles";
import { RoleSelector } from "@/components/role-selector";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Shield,
  UserCog,
  CheckCircle,
  Wallet,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Users,
  FileCheck,
  CreditCard,
  FileText,
  Settings,
} from "lucide-react";

const iconMap = {
  Shield,
  UserCog,
  CheckCircle,
  Wallet,
  ClipboardList,
  GraduationCap,
};

// Grupkan permissions untuk tampilan yang lebih rapi
const permissionGroups = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    permissions: ["dashboard.view", "dashboard.analytics", "dashboard.executive"] as Permission[],
  },
  {
    name: "Manajemen User",
    icon: Users,
    permissions: ["users.view", "users.create", "users.edit", "users.delete", "roles.manage"] as Permission[],
  },
  {
    name: "Verifikasi Berkas",
    icon: FileCheck,
    permissions: ["verifikasi.berkas.view", "verifikasi.berkas.approve", "verifikasi.berkas.reject"] as Permission[],
  },
  {
    name: "Keuangan",
    icon: CreditCard,
    permissions: [
      "keuangan.pembayaran.view",
      "keuangan.pembayaran.verify",
      "keuangan.laporan.view",
      "keuangan.laporan.export",
    ] as Permission[],
  },
  {
    name: "Ujian",
    icon: FileText,
    permissions: [
      "ujian.soal.manage",
      "ujian.jadwal.manage",
      "ujian.ruang.manage",
      "ujian.pengawas.manage",
      "ujian.nilai.view",
      "ujian.nilai.input",
      "ujian.wawancara.manage",
    ] as Permission[],
  },
  {
    name: "Sistem",
    icon: Settings,
    permissions: ["sistem.settings", "sistem.backup", "sistem.audit_log"] as Permission[],
  },
];

export function RoleDemo() {
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);

  const selectedRoleData = selectedRole ? ROLES[selectedRole] : null;
  const IconComponent = selectedRoleData
    ? iconMap[selectedRoleData.icon as keyof typeof iconMap]
    : null;

  return (
    <div className="space-y-8">
      {/* Role Selector */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Pilih Role untuk Melihat Akses</h2>
        <RoleSelector selectedRole={selectedRole} onRoleSelect={setSelectedRole} />
      </div>

      {/* Selected Role Details */}
      {selectedRoleData && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className={cn("rounded-lg p-3 text-white", selectedRoleData.color)}>
                {IconComponent && <IconComponent className="h-6 w-6" />}
              </div>
              <div>
                <CardTitle className="text-2xl">{selectedRoleData.name}</CardTitle>
                <CardDescription className="text-base">
                  {selectedRoleData.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Separator className="mb-6" />
            <h3 className="mb-4 text-lg font-semibold">Hak Akses (Permissions)</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {permissionGroups.map((group) => {
                const GroupIcon = group.icon;
                const hasAnyPermission = group.permissions.some((p) =>
                  hasPermission(selectedRole!, p)
                );

                if (!hasAnyPermission) return null;

                return (
                  <Card key={group.name} className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <GroupIcon className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-sm font-medium">{group.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {group.permissions.map((permission) => {
                          const hasAccess = hasPermission(selectedRole!, permission);
                          if (!hasAccess) return null;

                          const permissionLabel = permission.split(".").pop()?.replace(/_/g, " ");

                          return (
                            <Badge
                              key={permission}
                              variant="secondary"
                              className="text-xs capitalize"
                            >
                              {permissionLabel}
                            </Badge>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Portal Calon Mahasiswa - Special Section */}
            {selectedRole === "calon_mahasiswa" && (
              <div className="mt-6">
                <h4 className="mb-3 text-base font-medium">Fitur Portal Calon Mahasiswa</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Kelola Biodata", permission: "portal.biodata.manage" },
                    { label: "Upload Berkas", permission: "portal.berkas.upload" },
                    { label: "Upload Pembayaran", permission: "portal.pembayaran.upload" },
                    { label: "Lihat Status", permission: "portal.status.view" },
                    { label: "Ikut Ujian", permission: "portal.ujian.ikut" },
                    { label: "Cetak Dokumen", permission: "portal.dokumen.cetak" },
                  ].map((item) => (
                    <Badge key={item.permission} className="text-sm">
                      {item.label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
