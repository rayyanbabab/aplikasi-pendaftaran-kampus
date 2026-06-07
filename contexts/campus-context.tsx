'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Campus {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  isActive: boolean;
}

export interface CampusContextType {
  campuses: Campus[];
  selectedCampus: Campus | null;
  setSelectedCampus: (campus: Campus | null) => void;
  getAllCampuses: () => Campus[];
  getCampusById: (id: string) => Campus | undefined;
  addCampus: (campus: Campus) => void;
  updateCampus: (id: string, updates: Partial<Campus>) => void;
  deleteCampus: (id: string) => void;
}

const CampusContext = createContext<CampusContextType | undefined>(undefined);

export const defaultCampuses: Campus[] = [
  {
    id: 'campus-01',
    name: 'Kampus Utama',
    city: 'Jakarta',
    address: 'Jl. Merdeka No. 123, Jakarta Pusat 12345',
    phone: '+62-21-1234567',
    email: 'pmb.jakarta@universitas.ac.id',
    isActive: true,
  },
  {
    id: 'campus-02',
    name: 'Kampus Cabang Bandung',
    city: 'Bandung',
    address: 'Jl. Sudirman No. 456, Bandung 40123',
    phone: '+62-22-8765432',
    email: 'pmb.bandung@universitas.ac.id',
    isActive: true,
  },
  {
    id: 'campus-03',
    name: 'Kampus Cabang Surabaya',
    city: 'Surabaya',
    address: 'Jl. Diponegoro No. 789, Surabaya 60123',
    phone: '+62-31-5555666',
    email: 'pmb.surabaya@universitas.ac.id',
    isActive: true,
  },
  {
    id: 'campus-04',
    name: 'Kampus Cabang Medan',
    city: 'Medan',
    address: 'Jl. Ahmad Yani No. 101, Medan 20123',
    phone: '+62-61-4444333',
    email: 'pmb.medan@universitas.ac.id',
    isActive: false,
  },
];

export function CampusProvider({ children }: { children: React.ReactNode }) {
  const [campuses, setCampuses] = useState<Campus[]>(defaultCampuses);
  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(defaultCampuses[0]);

  const getAllCampuses = useCallback(() => campuses, [campuses]);

  const getCampusById = useCallback((id: string) => campuses.find((c) => c.id === id), [campuses]);

  const addCampus = useCallback((campus: Campus) => {
    setCampuses((prev) => [...prev, campus]);
  }, []);

  const updateCampus = useCallback((id: string, updates: Partial<Campus>) => {
    setCampuses((prev) =>
      prev.map((campus) => (campus.id === id ? { ...campus, ...updates } : campus)),
    );

    // Update selected campus if it's the one being updated
    if (selectedCampus?.id === id) {
      setSelectedCampus((prev) => (prev ? { ...prev, ...updates } : null));
    }
  }, [selectedCampus?.id]);

  const deleteCampus = useCallback((id: string) => {
    setCampuses((prev) => prev.filter((campus) => campus.id !== id));

    // Clear selection if deleting selected campus
    if (selectedCampus?.id === id) {
      setSelectedCampus(null);
    }
  }, [selectedCampus?.id]);

  const value: CampusContextType = {
    campuses,
    selectedCampus,
    setSelectedCampus,
    getAllCampuses,
    getCampusById,
    addCampus,
    updateCampus,
    deleteCampus,
  };

  return <CampusContext.Provider value={value}>{children}</CampusContext.Provider>;
}

export function useCampus() {
  const context = useContext(CampusContext);
  if (context === undefined) {
    throw new Error('useCampus must be used within CampusProvider');
  }
  return context;
}
