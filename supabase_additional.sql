-- -----------------------------------------------------------------------------
-- SQL TAMBAHAN UNTUK APLIKASI PMB (SUPABASE) - FITUR REAL-TIME & SETTINGS
-- 
-- CARA PENGGUNAAN:
-- 1. Buka dashboard proyek Supabase Anda (https://supabase.com).
-- 2. Pergi ke menu "SQL Editor" dari sidebar kiri.
-- 3. Klik "New query" dan buat query kosong.
-- 4. Tempel (paste) seluruh konten SQL di bawah ini.
-- 5. Klik tombol "Run" di kanan bawah untuk mengeksekusi script.
-- -----------------------------------------------------------------------------

-- =============================================================================
-- 1. PASTIKAN PUBLIKASI REALTIME EXIST
-- =============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END$$;

-- =============================================================================
-- 2. BUAT TABEL ANNOUNCEMENTS (PENGUMUMAN DARI ADMIN KE MAHASISWA)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'info' NOT NULL, -- info, warning, success, danger
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Aktifkan RLS pada tabel announcements
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Drop policy lama jika ada untuk menghindari error duplikasi
DROP POLICY IF EXISTS "Anyone can view active announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admins can manage announcements" ON public.announcements;

-- Kebijakan RLS announcements
CREATE POLICY "Anyone can view active announcements" 
  ON public.announcements FOR SELECT 
  USING (is_active = TRUE);

CREATE POLICY "Admins can manage announcements" 
  ON public.announcements FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('super_admin', 'admin_pmb')
    )
  );

-- =============================================================================
-- 3. BUAT TABEL PMB_SETTINGS (PENGATURAN TAHUN AKADEMIK & GELOMBANG AKTIF)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.pmb_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Aktifkan RLS pada tabel pmb_settings
ALTER TABLE public.pmb_settings ENABLE ROW LEVEL SECURITY;

-- Drop policy lama jika ada
DROP POLICY IF EXISTS "Anyone can view pmb settings" ON public.pmb_settings;
DROP POLICY IF EXISTS "Admins can update pmb settings" ON public.pmb_settings;

-- Kebijakan RLS pmb_settings
CREATE POLICY "Anyone can view pmb settings" 
  ON public.pmb_settings FOR SELECT 
  USING (TRUE);

CREATE POLICY "Admins can update pmb settings" 
  ON public.pmb_settings FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('super_admin', 'admin_pmb')
    )
  );

-- =============================================================================
-- 4. INSERT DATA SETTINGS DEFAULT
-- =============================================================================
INSERT INTO public.pmb_settings (key, value)
VALUES 
  ('tahun_akademik', '{"tahun": "2026/2027", "status": "aktif"}'::jsonb),
  ('gelombang_aktif', '{"id": "gel-2-2026", "nama": "Gelombang 2", "tutup": "2026-06-30"}'::jsonb)
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value;

-- =============================================================================
-- 5. CONTOH INSERT PENGUMUMAN AWAL
-- =============================================================================
INSERT INTO public.announcements (title, content, category, is_active)
VALUES 
  (
    'Pemberitahuan Ujian CBT Gelombang 2', 
    'Bagi calon mahasiswa yang berkas administrasinya telah diverifikasi, harap bersiap mengikuti Ujian CBT online pada tanggal 10 Juli 2026. Kartu ujian dapat diunduh di tab Cetak Dokumen.', 
    'info', 
    TRUE
  ),
  (
    'Bantuan Pembayaran Biaya Pendaftaran', 
    'Apabila Anda mengalami kendala saat melakukan konfirmasi pembayaran, silakan hubungi tim Helpdesk Keuangan PMB via Whatsapp di 081100000004.', 
    'warning', 
    TRUE
  )
ON CONFLICT DO NOTHING;

-- =============================================================================
-- 5.5 KEBIJAKAN KEAMANAN TAMBAHAN (RLS INSERT POLICIES)
-- Mengizinkan pengguna memasukkan data profil & pendaftar mereka sendiri 
-- dari sisi client-side (Next.js) sebagai cadangan.
-- =============================================================================
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own registration" ON public.registrations;
CREATE POLICY "Users can insert their own registration" 
  ON public.registrations FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- 5.8 PERBAIKAN INFINITE RECURSION PADA KEBIJAKAN RLS (SANGAT VITAL)
-- RLS bawaan awal mengalami infinite recursion karena melakukan query SELECT 
-- pada public.profiles di dalam kebijakan public.profiles itu sendiri.
-- Kita memperbaikinya dengan fungsi SECURITY DEFINER yang memotong RLS.
-- =============================================================================

-- Buat helper function Security Definer
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = p_user_id 
    AND role IN ('super_admin', 'admin_pmb', 'verifikator', 'keuangan', 'penguji')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Perbaiki Kebijakan public.profiles
DROP POLICY IF EXISTS "Admins/Staff can view all profiles" ON public.profiles;
CREATE POLICY "Admins/Staff can view all profiles" 
  ON public.profiles FOR ALL 
  USING (public.is_admin(auth.uid()));

-- Perbaiki Kebijakan public.registrations
DROP POLICY IF EXISTS "Admins/Staff can view/edit all registrations" ON public.registrations;
CREATE POLICY "Admins/Staff can view/edit all registrations" 
  ON public.registrations FOR ALL 
  USING (public.is_admin(auth.uid()));

-- =============================================================================
-- 6. FAIL-SAFE REGISTRASI SUPABASE REALTIME REPLICATION (SANGAT VITAL)
-- Dynamic PL/pgSQL block untuk mendaftarkan tabel-tabel ke publikasi realtime 
-- secara aman dan idempotent tanpa memicu error 'already member'.
-- =============================================================================
DO $$
DECLARE
  v_pub_id OID;
  v_exists BOOLEAN;
  v_table RECORD;
  v_tables_to_add TEXT[] := ARRAY['profiles', 'registrations', 'announcements', 'pmb_settings'];
  v_table_name TEXT;
BEGIN
  -- Dapatkan OID dari publikasi 'supabase_realtime'
  SELECT oid INTO v_pub_id FROM pg_publication WHERE pubname = 'supabase_realtime';

  IF v_pub_id IS NOT NULL THEN
    FOREACH v_table_name IN ARRAY v_tables_to_add LOOP
      -- Periksa apakah relasi tabel sudah terdaftar dalam publikasi ini
      SELECT EXISTS (
        SELECT 1 FROM pg_publication_rel 
        WHERE prpubid = v_pub_id 
        AND prrelid = format('public.%I', v_table_name)::regclass
      ) INTO v_exists;

      -- Jika belum terdaftar, lakukan ALTER PUBLICATION secara dinamis
      IF NOT v_exists THEN
        EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', v_table_name);
        RAISE NOTICE 'Berhasil mendaftarkan public.% ke publikasi supabase_realtime.', v_table_name;
      ELSE
        RAISE NOTICE 'Tabel public.% sudah terdaftar sebagai anggota publikasi supabase_realtime.', v_table_name;
      END IF;
    END LOOP;
  ELSE
    RAISE WARNING 'Publikasi supabase_realtime tidak ditemukan. Gagal mendaftarkan tabel.';
  END IF;
END$$;
