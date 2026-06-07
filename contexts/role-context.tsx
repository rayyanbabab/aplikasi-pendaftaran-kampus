"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { RoleType, Permission, User } from "@/types/roles";
import { ROLES, hasPermission, hasAnyPermission, hasAllPermissions } from "@/lib/roles";

interface RoleContextType {
  currentUser: User | null;
  currentRole: RoleType | null;
  setCurrentUser: (user: User | null) => void;
  setCurrentRole: (role: RoleType | null) => void;
  can: (permission: Permission) => boolean;
  canAny: (permissions: Permission[]) => boolean;
  canAll: (permissions: Permission[]) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

interface RoleProviderProps {
  children: ReactNode;
  initialUser?: User | null;
}

export function RoleProvider({ children, initialUser = null }: RoleProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(initialUser);
  const [currentRole, setCurrentRole] = useState<RoleType | null>(initialUser?.role ?? null);

  const handleSetCurrentUser = useCallback((user: User | null) => {
    setCurrentUser(user);
    setCurrentRole(user?.role ?? null);
  }, []);

  const handleSetCurrentRole = useCallback((role: RoleType | null) => {
    setCurrentRole(role);
    if (currentUser && role) {
      setCurrentUser({ ...currentUser, role });
    }
  }, [currentUser]);

  const can = useCallback(
    (permission: Permission): boolean => {
      if (!currentRole) return false;
      return hasPermission(currentRole, permission);
    },
    [currentRole]
  );

  const canAny = useCallback(
    (permissions: Permission[]): boolean => {
      if (!currentRole) return false;
      return hasAnyPermission(currentRole, permissions);
    },
    [currentRole]
  );

  const canAll = useCallback(
    (permissions: Permission[]): boolean => {
      if (!currentRole) return false;
      return hasAllPermissions(currentRole, permissions);
    },
    [currentRole]
  );

  const isAdmin = useCallback((): boolean => {
    return currentRole !== null && currentRole !== "calon_mahasiswa";
  }, [currentRole]);

  const isSuperAdmin = useCallback((): boolean => {
    return currentRole === "super_admin";
  }, [currentRole]);

  return (
    <RoleContext.Provider
      value={{
        currentUser,
        currentRole,
        setCurrentUser: handleSetCurrentUser,
        setCurrentRole: handleSetCurrentRole,
        can,
        canAny,
        canAll,
        isAdmin,
        isSuperAdmin,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}

// Component untuk conditional rendering berdasarkan permission
interface CanProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

export function Can({ permission, children, fallback = null }: CanProps) {
  const { can } = useRole();
  return can(permission) ? <>{children}</> : <>{fallback}</>;
}

// Component untuk conditional rendering berdasarkan role
interface HasRoleProps {
  roles: RoleType[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function HasRole({ roles, children, fallback = null }: HasRoleProps) {
  const { currentRole } = useRole();
  return currentRole && roles.includes(currentRole) ? <>{children}</> : <>{fallback}</>;
}

// Component untuk admin only content
interface AdminOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AdminOnly({ children, fallback = null }: AdminOnlyProps) {
  const { isAdmin } = useRole();
  return isAdmin() ? <>{children}</> : <>{fallback}</>;
}

// Component untuk super admin only content
interface SuperAdminOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function SuperAdminOnly({ children, fallback = null }: SuperAdminOnlyProps) {
  const { isSuperAdmin } = useRole();
  return isSuperAdmin() ? <>{children}</> : <>{fallback}</>;
}
