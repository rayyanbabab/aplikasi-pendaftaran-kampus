"use client";

import { useState } from "react";
import type { RoleType } from "@/types/roles";
import { getAllRoles } from "@/lib/roles";
import { RoleCard } from "@/components/role-card";

interface RoleSelectorProps {
  selectedRole: RoleType | null;
  onRoleSelect: (role: RoleType) => void;
}

export function RoleSelector({ selectedRole, onRoleSelect }: RoleSelectorProps) {
  const roles = getAllRoles();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {roles.map((role) => (
        <RoleCard
          key={role.id}
          role={role}
          isActive={selectedRole === role.id}
          onClick={() => onRoleSelect(role.id)}
        />
      ))}
    </div>
  );
}
