'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { generateProgramRecommendation } from '@/lib/ai-service';
import {
  ArrowRight,
  Loader2,
  Compass,
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  RotateCcw,
  BookOpen,
  Award,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

const AVAILABLE_PROGRAMS = [
  'Teknik Informatika',
  'Teknik Mesin',
  'Teknik Sipil',
  'Manajemen Bisnis',
  'Akuntansi',
  'Pendidikan Dokter',
  'Farmasi Klinis',
  'Ilmu Hukum',
  'Ilmu Komunikasi',
  'Pendidikan Matematika',
  'Sistem Informasi',
  'Bisnis Digital',
];

export default function RekomendasiPage() {
  const [step, setStep] = useState<'quiz' | 'results'>('quiz');
  const [scores, setScores] = useState<Scores>({
    matematika: 85,
    bahasaIndonesia: 80,
    bahasaInggris: 82,
    ipa: 84,
  });
  const [preferences, setPreferences] = useState<string[]>(['Teknik Informatika']);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Live Calculations for Real-time Feedback
  const averageScore = Math.round(
    (scores.matematika + scores.bahasaIndonesia + scores.bahasaInggris + scores.ipa) / 4
  );

  const togglePreference = (program: string) => {
    setPreferences((prev) =>
      prev.includes(program) ? prev.filter((p) => p !== program) : [...prev, program]
    );
  };

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    try {
      const result = await generateProgramRecommendation(scores, preferences);
      setRecommendations(result);
      setStep('results');
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setScores({
      matematika: 80,
      bahasaIndonesia: 80,
      bahasaInggris: 80,
      ipa: 80,
    });
    setPreferences([]);
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div>
          <div className="flex items-center justify-between gap-4 mb-6">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="gap-2 text-xs">
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Portal
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-foreground">
                Halaman Utama
              </Link>
              <span>•</span>
              <span className="font-semibold text-foreground">
                Konsultasi Penjurusan
              </span>
            </div>
          </div>

          <div className="flex items-start gap-4 pb-6 border-b border-border">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-[10px] uppercase font-mono py-0">
                  Panduan Akademik
                </Badge>
                <span className="text-xs text-muted-foreground">Evaluasi Nilai Rapor</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                Analisis Rekomendasi Program Studi
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
                Identifikasi kesesuaian nilai rapor semester 1 s.d. 5 dan minat bidang keilmuan Anda bersama kurikulum resmi Universitas Nusantara.
              </p>
            </div>
          </div>
        </div>

        {step === 'quiz' ? (
          <div className="space-y-8">
            {/* Live Profile Overview Card */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Profil Rata-rata Nilai Rapor
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-bold font-mono text-primary">
                    {averageScore}
                  </span>
                  <span className="text-xs text-muted-foreground">/ 100 Skala Rapor</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset Nilai
                </Button>
              </div>
            </div>

            {/* Step 1: Input Nilai Slider Cards */}
            <Card className="border border-border shadow-xs">
              <CardHeader className="pb-4 border-b border-border">
                <CardTitle className="text-base font-serif">
                  1. Masukkan Estimasi Nilai Rata-rata Rapor (Skala 0 s.d. 100)
                </CardTitle>
                <CardDescription className="text-xs">
                  Gunakan estimasi nilai semester 1 sampai 5 untuk memperoleh rekomendasi paling akurat.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid sm:grid-cols-2 gap-5">
                  {/* Matematika */}
                  <div className="p-4 rounded-xl bg-secondary/30 border border-border">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                        Matematika & Logika
                      </span>
                      <span className="text-base font-bold font-mono text-primary">
                        {scores.matematika}
                      </span>
                    </div>
                    <Slider
                      value={[scores.matematika]}
                      onValueChange={(val) => setScores({ ...scores, matematika: val[0] })}
                      min={40}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Bahasa Indonesia */}
                  <div className="p-4 rounded-xl bg-secondary/30 border border-border">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                        Bahasa Indonesia
                      </span>
                      <span className="text-base font-bold font-mono text-primary">
                        {scores.bahasaIndonesia}
                      </span>
                    </div>
                    <Slider
                      value={[scores.bahasaIndonesia]}
                      onValueChange={(val) => setScores({ ...scores, bahasaIndonesia: val[0] })}
                      min={40}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Bahasa Inggris */}
                  <div className="p-4 rounded-xl bg-secondary/30 border border-border">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                        Bahasa Inggris
                      </span>
                      <span className="text-base font-bold font-mono text-primary">
                        {scores.bahasaInggris}
                      </span>
                    </div>
                    <Slider
                      value={[scores.bahasaInggris]}
                      onValueChange={(val) => setScores({ ...scores, bahasaInggris: val[0] })}
                      min={40}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Sains / IPA */}
                  <div className="p-4 rounded-xl bg-secondary/30 border border-border">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                        IPA / Rumpun Saintek
                      </span>
                      <span className="text-base font-bold font-mono text-primary">
                        {scores.ipa}
                      </span>
                    </div>
                    <Slider
                      value={[scores.ipa]}
                      onValueChange={(val) => setScores({ ...scores, ipa: val[0] })}
                      min={40}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Minat Bidang */}
            <Card className="border border-border shadow-xs">
              <CardHeader className="pb-4 border-b border-border">
                <CardTitle className="text-base font-serif">
                  2. Bidang Keilmuan yang Paling Anda Minati (Opsional)
                </CardTitle>
                <CardDescription className="text-xs">
                  Pilih prodi yang ingin diprioritaskan dalam pencocokan algoritma.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {AVAILABLE_PROGRAMS.map((program) => {
                    const isChecked = preferences.includes(program);
                    return (
                      <div
                        key={program}
                        onClick={() => togglePreference(program)}
                        className={cn(
                          "flex items-center space-x-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-colors",
                          isChecked
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border bg-card text-foreground hover:bg-secondary/40"
                        )}
                      >
                        <Checkbox
                          id={program}
                          checked={isChecked}
                          onCheckedChange={() => togglePreference(program)}
                        />
                        <label htmlFor={program} className="cursor-pointer truncate">
                          {program}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Action Button */}
            <div className="pt-2">
              <Button
                onClick={handleGetRecommendations}
                disabled={isLoading}
                className="w-full sm:w-auto px-8 h-11 gap-2 font-semibold text-xs sm:text-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menganalisis Kesesuaian Program...
                  </>
                ) : (
                  <>
                    Tampilkan Rekomendasi Program Studi
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* Results View */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep('quiz')}
                className="gap-2 text-xs"
              >
                <ArrowLeft className="h-4 w-4" />
                Ubah Data Nilai & Minat
              </Button>
              <span className="text-xs text-muted-foreground">
                Menampilkan {recommendations.length} rekomendasi dengan kecocokan tertinggi
              </span>
            </div>

            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <Card
                  key={rec.program}
                  className="border border-border bg-card hover:border-primary/40 transition-all shadow-xs"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <span className="h-6 w-6 rounded-md bg-primary text-primary-foreground font-mono font-bold text-xs flex items-center justify-center">
                            #{index + 1}
                          </span>
                          <h3 className="text-lg font-bold font-serif text-foreground">
                            {rec.program}
                          </h3>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Universitas Nusantara • Fakultas Terkait
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <Badge
                          variant="outline"
                          className="text-xs font-semibold py-1 px-2.5 border-primary/30 text-primary font-mono"
                        >
                          Kecocokan {rec.score}%
                        </Badge>
                      </div>
                    </div>

                    <p className="text-foreground/80 text-xs sm:text-sm leading-relaxed mb-5">
                      {rec.reason}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span>Memenuhi syarat nilai rapor seleksi</span>
                      </div>

                      <Link href="/dashboard/kuliah">
                        <Button size="sm" className="text-xs font-semibold gap-1.5">
                          <GraduationCap className="h-4 w-4" />
                          Pilih Program Ini di Formulir
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Advice Note */}
            <div className="rounded-xl border border-border bg-secondary/30 p-6 text-xs text-muted-foreground space-y-2">
              <h4 className="font-semibold text-sm text-foreground mb-1">
                Panduan Pendaftaran Selanjutnya
              </h4>
              <p>
                Rekomendasi di atas dihitung berdasarkan simulasi kurikulum akademik. Anda dapat mendaftarkan hingga 3 pilihan program studi di formulir pendaftaran akun portal Anda.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
