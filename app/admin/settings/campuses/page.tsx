'use client';

import { useState } from 'react';
import { useCampus, type Campus } from '@/contexts/campus-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit2, Trash2, Plus, MapPin, Phone, Mail } from 'lucide-react';

export default function CampusesPage() {
  const { campuses, updateCampus, deleteCampus, addCampus } = useCampus();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Campus>>({
    name: '',
    city: '',
    address: '',
    phone: '',
    email: '',
    isActive: true,
  });

  const handleEdit = (campus: Campus) => {
    setEditingId(campus.id);
    setFormData(campus);
    setShowAddForm(false);
  };

  const handleSave = () => {
    if (editingId) {
      updateCampus(editingId, formData);
      setEditingId(null);
    } else if (formData.name && formData.city) {
      const newCampus: Campus = {
        id: `campus-${Date.now()}`,
        name: formData.name,
        city: formData.city,
        address: formData.address || '',
        phone: formData.phone || '',
        email: formData.email || '',
        isActive: formData.isActive ?? true,
      };
      addCampus(newCampus);
      setShowAddForm(false);
    }

    setFormData({
      name: '',
      city: '',
      address: '',
      phone: '',
      email: '',
      isActive: true,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({
      name: '',
      city: '',
      address: '',
      phone: '',
      email: '',
      isActive: true,
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Kampus</h1>
          <p className="text-gray-600">Kelola daftar kampus dan cabang universitas</p>
        </div>
        {!showAddForm && !editingId && (
          <Button onClick={() => setShowAddForm(true)} className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Tambah Kampus
          </Button>
        )}
      </div>

      {/* Form Add/Edit */}
      {(showAddForm || editingId) && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Kampus' : 'Tambah Kampus Baru'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Kampus *
              </label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Kampus Utama"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kota *
              </label>
              <Input
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Contoh: Jakarta"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alamat
              </label>
              <Input
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Jl. Contoh No. 123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telepon
              </label>
              <Input
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+62-21-123456"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="pmb@universitas.ac.id"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Checkbox
              id="active"
              checked={formData.isActive ?? true}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked === true })}
            />
            <label htmlFor="active" className="text-sm text-gray-700 cursor-pointer">
              Kampus Aktif
            </label>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              {editingId ? 'Simpan Perubahan' : 'Tambah Kampus'}
            </Button>
            <Button onClick={handleCancel} variant="outline">
              Batal
            </Button>
          </div>
        </Card>
      )}

      {/* Campus List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campuses.map((campus) => (
          <Card
            key={campus.id}
            className={`p-6 ${!campus.isActive ? 'opacity-60 bg-gray-50' : ''}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{campus.name}</h3>
                <p className="text-sm text-gray-500">{campus.city}</p>
                {!campus.isActive && (
                  <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded">
                    Tidak Aktif
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(campus)}
                  className="gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteCampus(campus.id)}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                <span>{campus.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 text-gray-400" />
                <span>{campus.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0 text-gray-400" />
                <span>{campus.email}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
