'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Users, Award, DollarSign, ArrowUp, ArrowDown, Download } from 'lucide-react';

const yearlyData = [
  { year: '2021', registered: 420, accepted: 390, revenue: 1200 },
  { year: '2022', registered: 550, accepted: 510, revenue: 1800 },
  { year: '2023', registered: 720, accepted: 680, revenue: 2400 },
  { year: '2024', registered: 850, accepted: 790, revenue: 3200 },
];

const programPerformance = [
  { name: 'Teknik Informatika', value: 180, accepted: 165 },
  { name: 'Manajemen Bisnis', value: 150, accepted: 135 },
  { name: 'Kedokteran', value: 120, accepted: 110 },
  { name: 'Hukum', value: 140, accepted: 130 },
  { name: 'Pendidikan', value: 110, accepted: 100 },
  { name: 'Lainnya', value: 150, accepted: 150 },
];

const acceptanceRate = [
  { program: 'Teknik Informatika', rate: 92 },
  { program: 'Manajemen Bisnis', rate: 90 },
  { program: 'Kedokteran', rate: 92 },
  { program: 'Hukum', rate: 93 },
  { program: 'Pendidikan', rate: 91 },
];

const COLORS = ['#8b5cf6', '#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444'];

export default function ExecutiveDashboard() {
  const totalRegistered = 850;
  const totalAccepted = 790;
  const overallAcceptanceRate = ((totalAccepted / totalRegistered) * 100).toFixed(1);
  const yoyGrowth = 18.1; // Year-over-year growth

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard Eksekutif</h1>
            <p className="text-gray-600">Ringkasan strategis PMB Tahun Akademik 2024/2025</p>
          </div>
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
            <Download className="w-4 h-4" />
            Unduh Laporan
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Pendaftar */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-600 text-sm font-medium mb-1">Total Pendaftar</p>
                <h2 className="text-3xl font-bold text-blue-900 mb-2">{totalRegistered}</h2>
                <p className="text-blue-700 text-sm flex items-center gap-1">
                  <ArrowUp className="w-4 h-4" />
                  {yoyGrowth}% dari tahun lalu
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          {/* Total Diterima */}
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-600 text-sm font-medium mb-1">Total Diterima</p>
                <h2 className="text-3xl font-bold text-green-900 mb-2">{totalAccepted}</h2>
                <p className="text-green-700 text-sm flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {overallAcceptanceRate}% tingkat penerimaan
                </p>
              </div>
              <Award className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          {/* Proyeksi Revenue */}
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-purple-600 text-sm font-medium mb-1">Proyeksi Revenue</p>
                <h2 className="text-3xl font-bold text-purple-900 mb-2">Rp 3.2M</h2>
                <p className="text-purple-700 text-sm flex items-center gap-1">
                  <ArrowUp className="w-4 h-4" />
                  33% vs tahun lalu
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </Card>

          {/* Rata-rata Skor */}
          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-orange-600 text-sm font-medium mb-1">Rata-rata Skor Peserta</p>
                <h2 className="text-3xl font-bold text-orange-900 mb-2">7.85</h2>
                <p className="text-orange-700 text-sm flex items-center gap-1">
                  <ArrowUp className="w-4 h-4" />
                  Meningkat dari 7.62
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Trend Pendaftaran YoY */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tren Pendaftaran (Year-over-Year)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="registered"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Terdaftar"
                />
                <Line
                  type="monotone"
                  dataKey="accepted"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Diterima"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Revenue Trend */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Proyeksi Revenue (Jutaan Rupiah)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#8b5cf6" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distribusi per Program */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribusi Pendaftar per Program</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={programPerformance}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {programPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Top Programs Performance */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tingkat Penerimaan per Program</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={acceptanceRate}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 200 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="program" type="category" width={200} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="rate" fill="#10b981" name="Tingkat Penerimaan (%)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Insights Section */}
        <Card className="p-6 mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Insight Strategis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-white rounded-lg border border-indigo-200">
              <p className="font-medium text-gray-900 mb-2">Peningkatan Kualitas Pendaftar</p>
              <p className="text-gray-600">
                Rata-rata skor meningkat 3% YoY, menunjukkan peningkatan kualitas calon mahasiswa.
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-indigo-200">
              <p className="font-medium text-gray-900 mb-2">Pertumbuhan Revenue</p>
              <p className="text-gray-600">
                Revenue meningkat 33%, didorong oleh pertumbuhan pendaftar 18% dan acceptance rate 93%.
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-indigo-200">
              <p className="font-medium text-gray-900 mb-2">Demand Program</p>
              <p className="text-gray-600">
                Teknik Informatika dan Hukum merupakan program dengan permintaan tertinggi.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
