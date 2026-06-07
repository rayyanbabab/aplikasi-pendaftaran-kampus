'use client';

import { useCampus } from '@/contexts/campus-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { MapPin, Building2, Settings } from 'lucide-react';
import Link from 'next/link';

export function CampusSwitcher() {
  const { campuses, selectedCampus, setSelectedCampus } = useCampus();
  const activeCampuses = campuses.filter((c) => c.isActive);

  if (!selectedCampus) {
    return (
      <Button variant="outline" disabled>
        No Campus Selected
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 w-full justify-start">
          <Building2 className="w-4 h-4" />
          <span className="truncate flex-1">{selectedCampus.name}</span>
          <MapPin className="w-4 h-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Pilih Kampus</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {activeCampuses.map((campus) => (
          <DropdownMenuCheckboxItem
            key={campus.id}
            checked={selectedCampus.id === campus.id}
            onCheckedChange={() => setSelectedCampus(campus)}
            className="cursor-pointer"
          >
            <div className="flex flex-col gap-1 flex-1">
              <span className="font-medium">{campus.name}</span>
              <span className="text-xs text-gray-500">{campus.city}</span>
            </div>
          </DropdownMenuCheckboxItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/admin/settings/campuses" className="cursor-pointer gap-2">
            <Settings className="w-4 h-4" />
            Kelola Kampus
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
