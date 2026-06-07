-- ============================================================
-- REALTIME DATABASE MIGRATION
-- Student Portal App - PMB Universitas Nusantara
-- Jalankan file ini di Supabase SQL Editor
-- ============================================================

-- 1. Tabel Pengumuman
CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  judul text NOT NULL,
  konten text NOT NULL,
  kategori text DEFAULT 'umum',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  jadwal_publikasi timestamptz,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Tabel Broadcast Log (email & WA)
CREATE TABLE IF NOT EXISTS public.broadcast_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  jenis text NOT NULL CHECK (jenis IN ('email', 'whatsapp')),
  penerima text NOT NULL,
  subjek text,
  pesan text NOT NULL,
  status text DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'failed')),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- 3. Tabel Soal Ujian CBT
CREATE TABLE IF NOT EXISTS public.exam_questions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nomor integer,
  pertanyaan text NOT NULL,
  opsi_a text,
  opsi_b text,
  opsi_c text,
  opsi_d text,
  jawaban text NOT NULL,
  kategori text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 4. Tabel Jadwal Ujian
CREATE TABLE IF NOT EXISTS public.exam_schedules (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  gelombang text NOT NULL,
  tanggal date NOT NULL,
  jam_mulai time NOT NULL,
  jam_selesai time NOT NULL,
  lokasi text NOT NULL,
  kapasitas_peserta integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 5. Tabel Ruang Ujian
CREATE TABLE IF NOT EXISTS public.exam_rooms (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nama text NOT NULL UNIQUE,
  kapasitas integer NOT NULL,
  status text DEFAULT 'Tersedia' CHECK (status IN ('Tersedia', 'Pemeliharaan')),
  created_at timestamptz DEFAULT now()
);

-- 6. Tabel Pengawas Ujian
CREATE TABLE IF NOT EXISTS public.exam_proctors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nama text NOT NULL,
  nip text NOT NULL,
  ruang text,
  status text DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Cuti')),
  created_at timestamptz DEFAULT now()
);

-- 7. Tabel Check-in Ujian
CREATE TABLE IF NOT EXISTS public.exam_checkins (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  no_peserta text NOT NULL,
  nama text NOT NULL,
  program text,
  ruangan text,
  status text NOT NULL CHECK (status IN ('checked-in', 'already-checked', 'not-found')),
  checked_in_at timestamptz DEFAULT now()
);

-- 8. PMB Settings
CREATE TABLE IF NOT EXISTS public.pmb_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- ENABLE REALTIME (safe — skip if already added)
-- ============================================================
DO $$
DECLARE
  tables text[] := ARRAY[
    'announcements','broadcast_logs','exam_questions',
    'exam_schedules','exam_rooms','exam_proctors',
    'exam_checkins','pmb_settings'
  ];
  t text;
BEGIN
  FOREACH t IN ARRAY tables LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = t
    ) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', t);
      RAISE NOTICE 'Added % to supabase_realtime', t;
    ELSE
      RAISE NOTICE '% already in supabase_realtime, skipping', t;
    END IF;
  END LOOP;
END $$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadcast_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_proctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pmb_settings ENABLE ROW LEVEL SECURITY;

-- Announcements
DROP POLICY IF EXISTS "Staff read announcements" ON public.announcements;
CREATE POLICY "Staff read announcements" ON public.announcements
  FOR SELECT USING (auth.jwt() -> 'app_metadata' ->> 'role' IN ('super_admin','admin_pmb','verifikator','keuangan','penguji'));

DROP POLICY IF EXISTS "Admin write announcements" ON public.announcements;
CREATE POLICY "Admin write announcements" ON public.announcements
  FOR ALL USING (auth.jwt() -> 'app_metadata' ->> 'role' IN ('super_admin','admin_pmb'));

-- Broadcast logs
DROP POLICY IF EXISTS "Staff read broadcast_logs" ON public.broadcast_logs;
CREATE POLICY "Staff read broadcast_logs" ON public.broadcast_logs
  FOR SELECT USING (auth.jwt() -> 'app_metadata' ->> 'role' IN ('super_admin','admin_pmb','verifikator','keuangan','penguji'));

DROP POLICY IF EXISTS "Admin write broadcast_logs" ON public.broadcast_logs;
CREATE POLICY "Admin write broadcast_logs" ON public.broadcast_logs
  FOR INSERT WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' IN ('super_admin','admin_pmb'));

-- Exam questions
DROP POLICY IF EXISTS "Staff read exam_questions" ON public.exam_questions;
CREATE POLICY "Staff read exam_questions" ON public.exam_questions
  FOR SELECT USING (auth.jwt() -> 'app_metadata' ->> 'role' IN ('super_admin','admin_pmb','penguji'));

DROP POLICY IF EXISTS "Staff write exam_questions" ON public.exam_questions;
CREATE POLICY "Staff write exam_questions" ON public.exam_questions
  FOR ALL USING (auth.jwt() -> 'app_metadata' ->> 'role' IN ('super_admin','admin_pmb','penguji'));

-- Exam schedules
DROP POLICY IF EXISTS "Staff read exam_schedules" ON public.exam_schedules;
CREATE POLICY "Staff read exam_schedules" ON public.exam_schedules
  FOR SELECT USING (auth.jwt() -> 'app_metadata' ->> 'role' IS NOT NULL);

DROP POLICY IF EXISTS "Admin write exam_schedules" ON public.exam_schedules;
CREATE POLICY "Admin write exam_schedules" ON public.exam_schedules
  FOR ALL USING (auth.jwt() -> 'app_metadata' ->> 'role' IN ('super_admin','admin_pmb'));

-- Exam rooms
DROP POLICY IF EXISTS "Staff read exam_rooms" ON public.exam_rooms;
CREATE POLICY "Staff read exam_rooms" ON public.exam_rooms
  FOR SELECT USING (auth.jwt() -> 'app_metadata' ->> 'role' IS NOT NULL);

DROP POLICY IF EXISTS "Admin write exam_rooms" ON public.exam_rooms;
CREATE POLICY "Admin write exam_rooms" ON public.exam_rooms
  FOR ALL USING (auth.jwt() -> 'app_metadata' ->> 'role' IN ('super_admin','admin_pmb'));

-- Exam proctors
DROP POLICY IF EXISTS "Staff read exam_proctors" ON public.exam_proctors;
CREATE POLICY "Staff read exam_proctors" ON public.exam_proctors
  FOR SELECT USING (auth.jwt() -> 'app_metadata' ->> 'role' IS NOT NULL);

DROP POLICY IF EXISTS "Admin write exam_proctors" ON public.exam_proctors;
CREATE POLICY "Admin write exam_proctors" ON public.exam_proctors
  FOR ALL USING (auth.jwt() -> 'app_metadata' ->> 'role' IN ('super_admin','admin_pmb'));

-- Exam checkins
DROP POLICY IF EXISTS "Staff read exam_checkins" ON public.exam_checkins;
CREATE POLICY "Staff read exam_checkins" ON public.exam_checkins
  FOR SELECT USING (auth.jwt() -> 'app_metadata' ->> 'role' IS NOT NULL);

DROP POLICY IF EXISTS "Staff write exam_checkins" ON public.exam_checkins;
CREATE POLICY "Staff write exam_checkins" ON public.exam_checkins
  FOR ALL USING (auth.jwt() -> 'app_metadata' ->> 'role' IS NOT NULL);

-- PMB settings
DROP POLICY IF EXISTS "Staff read pmb_settings" ON public.pmb_settings;
CREATE POLICY "Staff read pmb_settings" ON public.pmb_settings
  FOR SELECT USING (auth.jwt() -> 'app_metadata' ->> 'role' IS NOT NULL);

DROP POLICY IF EXISTS "Admin write pmb_settings" ON public.pmb_settings;
CREATE POLICY "Admin write pmb_settings" ON public.pmb_settings
  FOR ALL USING (auth.jwt() -> 'app_metadata' ->> 'role' IN ('super_admin','admin_pmb'));
