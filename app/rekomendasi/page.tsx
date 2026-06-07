'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { generateProgramRecommendation } from '@/lib/ai-service';
import { ArrowRight, Loader2, BarChart3, Home, LayoutDashboard, Shield } from 'lucide-react';

interface Scores {
  [key: string]: number;
  matematika: number;
  bahasaIndonesia: number;
  bahasaInggris: number;
  ipa: number;
}

interface Recommendation {
  program: string;
  reason: string;
  score: number;
}

const PROGRAMS = [
  'Teknik Informatika',
  'Teknik Mesin',
  'Manajemen Bisnis',
  'Akuntansi',
  'Kedokteran',
  'Kedokteran Gigi',
  'Farmasi',
  'Hukum',
  'Psikologi',
  'Pendidikan Matematika',
  'Pendidikan Bahasa Inggris',
  'Sistem Informasi',
];

export default function RekomendasiPage() {
  const [step, setStep] = useState<'quiz' | 'results'>('quiz');
  const [scores, setScores] = useState<Scores>({
    matematika: 75,
    bahasaIndonesia: 75,
    bahasaInggris: 75,
    ipa: 75,
  });
  const [preferences, setPreferences] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const togglePreference = (program: string) => {
    setPreferences((prev) =>
      prev.includes(program) ? prev.filter((p) => p !== program) : [...prev, program],
    );
  };

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    try {
      const result = await generateProgramRecommendation(scores, preferences);
      setRecommendations(result);
      setStep('results');
    } catch (error) {
      console.error('[v0] Error generating recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <Button variant="ghost" size="icon" className="shrink-0">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="shrink-0">
                <LayoutDashboard className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="shrink-0">
                <Shield className="h-5 w-5" />
              </Button>
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Rekomendasi Program Studi</h1>
                <p className="text-sm text-gray-600">
                  Temukan program studi yang sesuai dengan kemampuan dan minat Anda
                </p>
              </div>
            </div>
          </div>
        </div>

        {step === 'quiz' ? (
          <Card className="p-8">
            <div className="space-y-8">
              {/* Scores Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">1. Nilai Akademik Anda</h2>
                <div className="space-y-6">
                  {/* Matematika */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Matematika</label>
                      <span className="text-lg font-semibold text-purple-600">{scores.matematika}</span>
                    </div>
                    <Slider
                      value={[scores.matematika]}
                      onValueChange={(value) =>
                        setScores({ ...scores, matematika: value[0] })
                      }
                      min={0}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Bahasa Indonesia */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Bahasa Indonesia</label>
                      <span className="text-lg font-semibold text-purple-600">{scores.bahasaIndonesia}</span>
                    </div>
                    <Slider
                      value={[scores.bahasaIndonesia]}
                      onValueChange={(value) =>
                        setScores({ ...scores, bahasaIndonesia: value[0] })
                      }
                      min={0}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Bahasa Inggris */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Bahasa Inggris</label>
                      <span className="text-lg font-semibold text-purple-600">{scores.bahasaInggris}</span>
                    </div>
                    <Slider
                      value={[scores.bahasaInggris]}
                      onValueChange={(value) =>
                        setScores({ ...scores, bahasaInggris: value[0] })
                      }
                      min={0}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* IPA */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">IPA (Biologi, Kimia, Fisika)</label>
                      <span className="text-lg font-semibold text-purple-600">{scores.ipa}</span>
                    </div>
                    <Slider
                      value={[scores.ipa]}
                      onValueChange={(value) =>
                        setScores({ ...scores, ipa: value[0] })
                      }
                      min={0}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">2. Program Studi Pilihan</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Pilih program studi yang paling menarik bagi Anda (opsional)
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {PROGRAMS.map((program) => (
                    <div key={program} className="flex items-center space-x-2">
                      <Checkbox
                        id={program}
                        checked={preferences.includes(program)}
                        onCheckedChange={() => togglePreference(program)}
                      />
                      <label htmlFor={program} className="text-sm text-gray-700 cursor-pointer">
                        {program}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleGetRecommendations}
                  disabled={isLoading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Menganalisis...
                    </>
                  ) : (
                    <>
                      Dapatkan Rekomendasi
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            <Button
              variant="outline"
              onClick={() => setStep('quiz')}
              className="mb-4"
            >
              Kembali
            </Button>

            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <Card
                  key={rec.program}
                  className={`p-6 border-l-4 ${
                    index === 0
                      ? 'border-l-yellow-400 bg-yellow-50'
                      : index === 1
                        ? 'border-l-gray-400 bg-gray-50'
                        : 'border-l-orange-400 bg-orange-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-bold text-gray-900">#{index + 1}</span>
                        <h3 className="text-xl font-semibold text-gray-900">{rec.program}</h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-purple-600">{rec.score}%</div>
                      <div className="text-xs text-gray-500">Kesesuaian</div>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        index === 0
                          ? 'bg-yellow-400'
                          : index === 1
                            ? 'bg-gray-400'
                            : 'bg-orange-400'
                      }`}
                      style={{ width: `${rec.score}%` }}
                    />
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed">{rec.reason}</p>

                  <div className="mt-4 flex gap-2">
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      Pelajari Lebih Lanjut
                    </Button>
                    <Button size="sm" variant="outline">
                      Lihat Jalur Masuk
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="bg-blue-50 border-blue-200 p-6">
              <h3 className="font-semibold text-blue-900 mb-2">Tips untuk Aplikasi Anda</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Pilih 3 program studi favorit Anda di aplikasi pendaftaran</li>
                <li>Pastikan nilai dan dokumen sudah lengkap sebelum submit</li>
                <li>Cek persyaratan khusus untuk setiap program yang Anda pilih</li>
                <li>Ikuti jadwal pendaftaran sesuai gelombang pilihan Anda</li>
              </ul>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
