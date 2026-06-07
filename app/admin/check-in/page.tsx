'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Camera, Loader2, Check, AlertCircle, X, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkInRecords, setCheckInRecords] = useState<CheckInRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const showToast = (msg: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

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
    } catch (err) {
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

    return () => { channel.unsubscribe(); };
  }, [fetchCheckins]);

  // ─── Camera ───────────────────────────────────────────────
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch {
      showToast('Tidak dapat mengakses kamera. Gunakan mode manual input.', 'error');
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
    if (!noPeserta.trim()) return;
    setIsProcessing(true);

    try {
      // Cek apakah sudah check-in hari ini
      const today = new Date().toISOString().slice(0, 10);
      const { data: existing } = await supabase
        .from('exam_checkins')
        .select('id')
        .eq('no_peserta', noPeserta.toUpperCase())
        .eq('status', 'checked-in')
        .gte('checked_in_at', `${today}T00:00:00`)
        .maybeSingle();

      if (existing) {
        // Sudah check-in — catat sebagai already-checked
        await supabase.from('exam_checkins').insert({
          no_peserta: noPeserta.toUpperCase(),
          nama: 'Sudah Check-in',
          program: '-',
          ruangan: '-',
          status: 'already-checked',
        });
        showToast(`⚠ ${noPeserta} sudah melakukan check-in sebelumnya`, 'warning');
        setManualInput('');
        return;
      }

      // Cari di tabel registrations berdasarkan no_pendaftaran
      const { data: reg } = await supabase
        .from('registrations')
        .select(`
          id,
          no_pendaftaran,
          pilihan_prodi,
          profiles:user_id ( name )
        `)
        .eq('no_pendaftaran', noPeserta.toUpperCase())
        .maybeSingle();

      if (!reg) {
        // Tidak ditemukan
        await supabase.from('exam_checkins').insert({
          no_peserta: noPeserta.toUpperCase(),
          nama: 'Tidak Ditemukan',
          program: '-',
          ruangan: '-',
          status: 'not-found',
        });
        showToast(`✗ Nomor peserta ${noPeserta} tidak ditemukan`, 'error');
        setManualInput('');
        return;
      }

      const profileName = (reg.profiles as any)?.name || 'Peserta';
      const program = reg.pilihan_prodi?.[0]?.prodiId || 'Belum Memilih';

      // Insert check-in berhasil
      await supabase.from('exam_checkins').insert({
        no_peserta: noPeserta.toUpperCase(),
        nama: profileName,
        program,
        ruangan: '-',
        status: 'checked-in',
      });

      showToast(`✓ ${profileName} berhasil check-in`, 'success');
      setManualInput('');
    } catch (err: any) {
      showToast('Error: ' + err.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) processCheckIn(manualInput.trim());
  };

  const checkedInCount = checkInRecords.filter((r) => r.status === 'checked-in').length;
  const notFoundCount = checkInRecords.filter((r) => r.status === 'not-found').length;

  const toastColor =
    toast?.type === 'success' ? 'bg-green-600' :
    toast?.type === 'warning' ? 'bg-amber-600' : 'bg-red-600';

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 rounded-lg px-5 py-3 text-white shadow-lg max-w-sm ${toastColor}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Check-in Ujian</h1>
          <p className="text-sm text-muted-foreground">Scan QR Code atau masukkan nomor pendaftaran secara manual</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchCheckins} className="gap-2">
          <RefreshCw className="h-4 w-4" />Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Check-in Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            {/* Mode Selector */}
            <div className="flex gap-4 mb-6">
              <Button
                variant={mode === 'camera' ? 'default' : 'outline'}
                onClick={() => { setMode('camera'); if (!isCameraActive) startCamera(); }}
                className="flex-1 gap-2"
              >
                <Camera className="w-4 h-4" />Scan QR Code
              </Button>
              <Button
                variant={mode === 'manual' ? 'default' : 'outline'}
                onClick={() => { setMode('manual'); stopCamera(); }}
                className="flex-1"
              >
                Input Manual
              </Button>
            </div>

            {/* Camera Mode */}
            {mode === 'camera' && (
              <div className="space-y-4">
                {!isCameraActive ? (
                  <div className="bg-muted rounded-lg p-8 text-center">
                    <Camera className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">Kamera belum aktif</p>
                    <Button onClick={startCamera}>Nyalakan Kamera</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                      <canvas ref={canvasRef} className="hidden" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-48 h-48 border-2 border-primary rounded-lg" />
                      </div>
                    </div>
                    <Button onClick={stopCamera} variant="destructive" className="w-full">Matikan Kamera</Button>
                    <p className="text-sm text-muted-foreground text-center">Arahkan kamera ke QR Code pada kartu peserta</p>
                  </div>
                )}
              </div>
            )}

            {/* Manual Mode */}
            {mode === 'manual' && (
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nomor Pendaftaran</label>
                  <Input
                    type="text"
                    placeholder="Contoh: PMB-2026-001"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    disabled={isProcessing}
                    className="text-lg"
                    autoFocus
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isProcessing || !manualInput.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Memproses...</>
                  ) : 'Check-in'}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Masukkan nomor pendaftaran dari database registrasi
                </p>
              </form>
            )}
          </Card>
        </div>

        {/* Statistics Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Ringkasan Hari Ini</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 dark:text-green-400">Berhasil Check-in</span>
                </div>
                <span className="text-2xl font-bold text-green-600">{checkedInCount}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-700 dark:text-red-400">Tidak Ditemukan</span>
                </div>
                <span className="text-2xl font-bold text-red-600">{notFoundCount}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/40">
                <span className="text-sm text-muted-foreground">Total Scan</span>
                <span className="text-2xl font-bold">{checkInRecords.length}</span>
              </div>
            </div>
          </Card>

          {/* Recent Check-ins */}
          <Card className="p-6">
            <h3 className="text-sm font-medium mb-4">Check-in Terakhir</h3>
            {isLoading ? (
              <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : checkInRecords.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Belum ada check-in hari ini</p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {checkInRecords.slice(0, 8).map((record) => (
                  <div
                    key={record.id}
                    className={`p-3 rounded-lg border-l-4 text-xs ${
                      record.status === 'checked-in' ? 'bg-green-50 border-l-green-400 dark:bg-green-950/20'
                        : record.status === 'already-checked' ? 'bg-blue-50 border-l-blue-400 dark:bg-blue-950/20'
                        : 'bg-red-50 border-l-red-400 dark:bg-red-950/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground">{record.nama}</p>
                        <p className="text-muted-foreground font-mono">{record.no_peserta}</p>
                      </div>
                      {record.status === 'checked-in' && <Check className="w-4 h-4 text-green-600 flex-shrink-0" />}
                      {record.status === 'already-checked' && <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                      {record.status === 'not-found' && <X className="w-4 h-4 text-red-600 flex-shrink-0" />}
                    </div>
                    <p className="text-muted-foreground mt-1">
                      {new Date(record.checked_in_at).toLocaleTimeString('id-ID')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* All Records Table */}
      {checkInRecords.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Semua Check-in Hari Ini ({checkInRecords.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-muted-foreground font-medium">Nama</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">No. Peserta</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Program</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Waktu</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {checkInRecords.map((record) => (
                  <tr key={record.id} className="border-b hover:bg-muted/30">
                    <td className="p-3 font-medium">{record.nama}</td>
                    <td className="p-3 font-mono text-xs">{record.no_peserta}</td>
                    <td className="p-3">{record.program}</td>
                    <td className="p-3">{new Date(record.checked_in_at).toLocaleTimeString('id-ID')}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === 'checked-in' ? 'bg-green-100 text-green-800'
                          : record.status === 'already-checked' ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {record.status === 'checked-in' ? 'Berhasil'
                          : record.status === 'already-checked' ? 'Sudah Check-in'
                          : 'Tidak Ditemukan'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
