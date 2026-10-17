'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RefreshCw,
  QrCode,
  Search,
  Users,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CheckInRecord {
  id: string;
  no_peserta: string;
  nama: string;
  program: string;
  ruangan: string;
  status: 'checked-in' | 'already-checked' | 'not-found';
  checked_in_at: string;
}

export default function CheckInPage() {
  const [mode, setMode] = useState<'camera' | 'manual'>('manual');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [searchTableQuery, setSearchTableQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkInRecords, setCheckInRecords] = useState<CheckInRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // ─── Fetch existing check-in history ──────────────────────
  const fetchCheckins = useCallback(async () => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from('exam_checkins')
        .select('*')
        .gte('checked_in_at', `${today}T00:00:00`)
        .order('checked_in_at', { ascending: false });

      if (error) throw error;
      setCheckInRecords(data || []);
    } catch (err: any) {
      console.error('Error fetching checkins:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCheckins();

    // Realtime subscription
    const channel = supabase
      .channel('realtime-exam-checkins')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'exam_checkins' }, fetchCheckins)
      .subscribe();

    return () => {
      channel.unsubscribe();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [fetchCheckins]);

  // ─── Camera Handler ───────────────────────────────────────
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch {
      toast.error('Kamera tidak dapat diakses. Silakan gunakan mode input manual.');
      setMode('manual');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      setIsCameraActive(false);
    }
  };

  // ─── Process Check-in ─────────────────────────────────────
  const processCheckIn = async (noPeserta: string) => {
    const cleanNo = noPeserta.trim().toUpperCase();
    if (!cleanNo) return;
    setIsProcessing(true);

    try {
      const today = new Date().toISOString().slice(0, 10);
      const { data: existing } = await supabase
        .from('exam_checkins')
        .select('id, nama')
        .eq('no_peserta', cleanNo)
        .eq('status', 'checked-in')
        .gte('checked_in_at', `${today}T00:00:00`)
        .maybeSingle();

      if (existing) {
        await supabase.from('exam_checkins').insert({
          no_peserta: cleanNo,
          nama: existing.nama || 'Sudah Check-in',
          program: '-',
          ruangan: 'Lab CBT 01',
          status: 'already-checked',
        });
        toast.warning(`Nomor ${cleanNo} telah check-in sebelumnya hari ini.`);
        setManualInput('');
        fetchCheckins();
        return;
      }

      // Check registration
      const { data: reg } = await supabase
        .from('registrations')
        .select(`
          id,
          no_pendaftaran,
          pilihan_prodi,
          profiles:user_id ( name )
        `)
        .eq('no_pendaftaran', cleanNo)
        .maybeSingle();

      if (!reg) {
        await supabase.from('exam_checkins').insert({
          no_peserta: cleanNo,
          nama: 'Tidak Ditemukan',
          program: '-',
          ruangan: '-',
          status: 'not-found',
        });
        toast.error(`Nomor peserta ${cleanNo} tidak terdaftar di sistem.`);
        setManualInput('');
        fetchCheckins();
        return;
      }

      const profileName = (reg.profiles as any)?.name || 'Peserta Ujian';
      const program = reg.pilihan_prodi?.[0]?.prodiId || 'Pilihan Utama';

      await supabase.from('exam_checkins').insert({
        no_peserta: cleanNo,
        nama: profileName,
        program,
        ruangan: 'Lab CBT 01',
        status: 'checked-in',
      });

      toast.success(`Check-in berhasil: ${profileName} (${cleanNo})`);
      setManualInput('');
      fetchCheckins();
    } catch (err: any) {
      toast.error('Gagal memproses check-in: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) processCheckIn(manualInput.trim());
  };

  const checkedInCount = checkInRecords.filter((r) => r.status === 'checked-in').length;
  const alreadyCheckedCount = checkInRecords.filter((r) => r.status === 'already-checked').length;
  const notFoundCount = checkInRecords.filter((r) => r.status === 'not-found').length;

  const filteredRecords = useMemo(() => {
    return checkInRecords.filter((r) => {
      const matchSearch =
        r.nama.toLowerCase().includes(searchTableQuery.toLowerCase()) ||
        r.no_peserta.toLowerCase().includes(searchTableQuery.toLowerCase()) ||
        r.program.toLowerCase().includes(searchTableQuery.toLowerCase());
      return matchSearch;
    });
  }, [checkInRecords, searchTableQuery]);

  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            <ShieldCheck className="h-4 w-4" />
            Operasional Panitia Ujian CBT
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            Verifikasi & Presensi Peserta Ujian
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Validasi kartu peserta melalui pemindaian kamera barcode/QR atau verifikasi manual nomor pendaftaran.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={fetchCheckins} className="gap-2 text-xs self-start sm:self-auto">
          <RefreshCw className="h-3.5 w-3.5" />
          Segarkan Data
        </Button>
      </div>

      {/* Summary Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Check-in Valid</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-mono font-bold text-foreground">
            {checkedInCount}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">Peserta hadir di ruang ujian hari ini</p>
        </div>

        <div className="p-5 rounded-xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Scan Ganda / Peringatan</span>
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-mono font-bold text-foreground">
            {alreadyCheckedCount}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">Percobaan presensi berulang</p>
        </div>

        <div className="p-5 rounded-xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Total Transaksi Scan</span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <p className="text-2xl sm:text-3xl font-mono font-bold text-foreground">
            {checkInRecords.length}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">Riwayat aktivitas scanner</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Verification Controls (Left Panel) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border border-border shadow-xs">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-serif">Pemindai Kartu Peserta</CardTitle>
              <CardDescription className="text-xs">
                Pilih metode input kartu peserta ujian
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Tab Selector */}
              <div className="flex gap-2 p-1 bg-secondary rounded-lg mb-6 border border-border" role="tablist">
                <button
                  onClick={() => {
                    setMode('manual');
                    stopCamera();
                  }}
                  className={cn(
                    "flex-1 py-2 text-xs font-semibold rounded-md transition-colors",
                    mode === 'manual'
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Input Nomor Manual
                </button>
                <button
                  onClick={() => {
                    setMode('camera');
                    if (!isCameraActive) startCamera();
                  }}
                  className={cn(
                    "flex-1 py-2 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5",
                    mode === 'camera'
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Camera className="w-3.5 h-3.5" />
                  Kamera Scanner QR
                </button>
              </div>

              {/* Manual Mode */}
              {mode === 'manual' && (
                <form onSubmit={handleManualSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                      Nomor Pendaftaran Peserta
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Contoh: PMB-2025-001"
                        value={manualInput}
                        onChange={(e) => setManualInput(e.target.value)}
                        disabled={isProcessing}
                        className="font-mono text-sm h-11 bg-card"
                        autoFocus
                      />
                      <Button
                        type="submit"
                        disabled={isProcessing || !manualInput.trim()}
                        className="h-11 px-6 font-semibold text-xs shrink-0"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                            Memproses...
                          </>
                        ) : (
                          'Verifikasi'
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Simulator Shortcut Chips */}
                  <div className="pt-2">
                    <p className="text-[11px] text-muted-foreground mb-2">Simulasi Pengujian Cepat:</p>
                    <div className="flex flex-wrap gap-2">
                      {['PMB-2025-001', 'PMB-2025-002', 'PMB-2025-999'].map((sample) => (
                        <button
                          key={sample}
                          type="button"
                          onClick={() => setManualInput(sample)}
                          className="px-2.5 py-1 rounded bg-secondary hover:bg-secondary/80 text-[11px] font-mono text-foreground border border-border"
                        >
                          {sample}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              )}

              {/* Camera Mode */}
              {mode === 'camera' && (
                <div className="space-y-4">
                  {!isCameraActive ? (
                    <div className="bg-secondary/40 rounded-xl p-8 text-center border border-dashed border-border">
                      <QrCode className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-60" />
                      <p className="text-sm font-semibold text-foreground mb-1">Kamera Belum Aktif</p>
                      <p className="text-xs text-muted-foreground mb-4 max-w-sm mx-auto">
                        Izinkan peramban mengakses kamera perangkat untuk membaca kode QR kartu peserta.
                      </p>
                      <Button onClick={startCamera} size="sm" className="font-semibold text-xs">
                        Aktifkan Kamera Sekarang
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative bg-black rounded-xl overflow-hidden aspect-video border border-border">
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-48 h-48 border-2 border-primary/80 rounded-xl" />
                        </div>
                      </div>
                      <Button onClick={stopCamera} variant="outline" size="sm" className="w-full text-xs">
                        Hentikan Kamera
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Live Activity Stream (Right Panel) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border border-border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-serif">Aktivitas Presensi Terkini</CardTitle>
                <span className="text-[11px] text-muted-foreground font-mono">
                  {checkInRecords.length} Catatan
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : checkInRecords.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-xs">
                  Belum ada catatan presensi pada sesi hari ini.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {checkInRecords.slice(0, 10).map((record) => {
                    const isValid = record.status === 'checked-in';
                    const isDuplicate = record.status === 'already-checked';

                    return (
                      <div
                        key={record.id}
                        className="p-3 rounded-lg border border-border bg-card flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate">{record.nama}</p>
                          <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                            {record.no_peserta} • {record.program}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <Badge
                            variant={isValid ? 'default' : isDuplicate ? 'outline' : 'destructive'}
                            className={cn(
                              'text-[10px] font-medium py-0',
                              isValid && 'bg-emerald-600 text-white',
                              isDuplicate && 'border-amber-500 text-amber-700 dark:text-amber-300'
                            )}
                          >
                            {isValid ? 'Hadir' : isDuplicate ? 'Sudah Ada' : 'Gagal'}
                          </Badge>
                          <span className="block text-[10px] text-muted-foreground mt-1 font-mono">
                            {new Date(record.checked_in_at).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Complete Log Table with Live Search Filter */}
      {checkInRecords.length > 0 && (
        <Card className="border border-border shadow-xs">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-serif">Buku Presensi Ujian Terpadu</CardTitle>
                <CardDescription className="text-xs">
                  Seluruh riwayat presensi yang terekam pada sesi hari ini
                </CardDescription>
              </div>

              <div className="w-full sm:w-64">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Cari peserta atau no. pendaftaran..."
                    value={searchTableQuery}
                    onChange={(e) => setSearchTableQuery(e.target.value)}
                    className="pl-8 h-9 text-xs bg-card"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-left">
                    <th className="py-2.5 px-3 font-semibold">Nama Peserta</th>
                    <th className="py-2.5 px-3 font-semibold font-mono">No. Peserta</th>
                    <th className="py-2.5 px-3 font-semibold">Pilihan Program</th>
                    <th className="py-2.5 px-3 font-semibold">Waktu Presensi</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Status Validasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-secondary/40 transition-colors">
                      <td className="py-3 px-3 font-semibold text-foreground">{record.nama}</td>
                      <td className="py-3 px-3 font-mono text-muted-foreground">{record.no_peserta}</td>
                      <td className="py-3 px-3 text-muted-foreground">{record.program}</td>
                      <td className="py-3 px-3 font-mono text-muted-foreground">
                        {new Date(record.checked_in_at).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-[10px] font-medium py-0',
                            record.status === 'checked-in' && 'border-emerald-500/40 text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20',
                            record.status === 'already-checked' && 'border-amber-500/40 text-amber-700 dark:text-amber-300 bg-amber-50/50 dark:bg-amber-950/20',
                            record.status === 'not-found' && 'border-red-500/40 text-red-700 dark:text-red-300 bg-red-50/50 dark:bg-red-950/20'
                          )}
                        >
                          {record.status === 'checked-in' ? 'Berhasil' : record.status === 'already-checked' ? 'Presensi Ulang' : 'Tidak Terdaftar'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
