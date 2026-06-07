"use client";

import { Shield, UserCog, CheckCircle, Wallet, ClipboardList, GraduationCap } from "lucide-react";
import type { Role } from "@/types/roles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const iconMap = {
  Shield,
  UserCog,
  CheckCircle,
  Wallet,
  ClipboardList,
  GraduationCap,
};

interface RoleCardProps {
  role: Role;
  isActive?: boolean;
  onClick?: () => void;
}

export function RoleCard({ role, isActive = false, onClick }: RoleCardProps) {
  const IconComponent = iconMap[role.icon as keyof typeof iconMap];

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        isActive && "ring-2 ring-primary"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className={cn("rounded-lg p-2 text-white", role.color)}>
            {IconComponent && <IconComponent className="h-5 w-5" />}
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{role.name}</CardTitle>
          </div>
          {isActive && (
            <Badge variant="default" className="text-xs">
              Aktif
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm">{role.description}</CardDescription>
        <div className="mt-3">
          <p className="text-xs text-muted-foreground">
            {role.permissions.length} permission tersedia
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
