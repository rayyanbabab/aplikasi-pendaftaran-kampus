-- =============================================================================
-- SUPABASE FIX COMPLETE — Jalankan ini di Supabase SQL Editor
-- 
-- CARA PAKAI:
-- 1. Buka https://supabase.com → pilih proyek kamu
-- 2. Klik "SQL Editor" di sidebar → klik "New query"
-- 3. Paste SELURUH isi file ini → klik "Run"
-- =============================================================================

-- ============================================================
-- STEP 1: Buat enum user_role jika belum ada
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM (
      'super_admin',
      'admin_pmb',
      'verifikator',
      'keuangan',
      'penguji',
      'calon_mahasiswa'
    );
  END IF;
END$$;

-- ============================================================
-- STEP 2: Buat tabel profiles jika belum ada
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT NOT NULL UNIQUE,
  role user_role DEFAULT 'calon_mahasiswa'::user_role NOT NULL,
  is_verified BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================
-- STEP 3: Buat tabel registrations jika belum ada
-- ============================================================
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  no_pendaftaran TEXT UNIQUE,
  status TEXT DEFAULT 'draft' NOT NULL,
  data_pribadi JSONB DEFAULT '{}'::jsonb NOT NULL,
  data_orang_tua JSONB DEFAULT '{}'::jsonb NOT NULL,
  data_sekolah JSONB DEFAULT '{}'::jsonb NOT NULL,
  nilai_rapor JSONB DEFAULT '[]'::jsonb NOT NULL,
  prestasi JSONB DEFAULT '[]'::jsonb NOT NULL,
  documents JSONB DEFAULT '[]'::jsonb NOT NULL,
  pilihan_prodi JSONB DEFAULT '[]'::jsonb NOT NULL,
  pembayaran JSONB DEFAULT NULL,
  status_history JSONB DEFAULT '[]'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================
-- STEP 4: HAPUS SEMUA POLICY LAMA yang bermasalah
-- (Termasuk policy yang menyebabkan infinite recursion)
-- ============================================================
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN 
    SELECT policyname FROM pg_policies 
    WHERE tablename = 'profiles' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', pol.policyname);
    RAISE NOTICE 'Dropped profiles policy: %', pol.policyname;
  END LOOP;
  
  FOR pol IN 
    SELECT policyname FROM pg_policies 
    WHERE tablename = 'registrations' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.registrations', pol.policyname);
    RAISE NOTICE 'Dropped registrations policy: %', pol.policyname;
  END LOOP;
END $$;

-- ============================================================
-- STEP 5: Aktifkan RLS
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- STEP 6: BUAT POLICY BARU yang BENAR (tanpa infinite recursion)
-- Kunci: Cek role admin menggunakan auth.jwt() bukan subquery ke profiles!
-- ============================================================

-- Helper: Fungsi untuk cek apakah user adalah staff/admin (TANPA subquery ke profiles)
CREATE OR REPLACE FUNCTION public.is_admin_staff()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('super_admin','admin_pmb','verifikator','keuangan','penguji'),
    FALSE
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Profiles: user bisa lihat/edit profil sendiri
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Profiles: admin/staff bisa lihat SEMUA profil (untuk halaman admin)
CREATE POLICY "profiles_select_all_admin"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('super_admin','admin_pmb','verifikator','keuangan','penguji')
    )
  );

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Profiles: super_admin bisa update role siapapun
CREATE POLICY "profiles_update_admin"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role = 'super_admin'
    )
  );

-- Registrations: user bisa lihat/insert/update milik sendiri
CREATE POLICY "registrations_select_own"
  ON public.registrations FOR SELECT
  USING (auth.uid() = user_id);

-- Registrations: admin/staff bisa lihat SEMUA registrasi
CREATE POLICY "registrations_select_all_admin"
  ON public.registrations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('super_admin','admin_pmb','verifikator','keuangan','penguji')
    )
  );

CREATE POLICY "registrations_insert_own"
  ON public.registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "registrations_update_own"
  ON public.registrations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Registrations: admin/staff bisa update semua (untuk approve/reject berkas & pembayaran)
CREATE POLICY "registrations_update_admin"
  ON public.registrations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('super_admin','admin_pmb','verifikator','keuangan','penguji')
    )
  );


-- ============================================================
-- STEP 7: TRIGGER — Buat profile otomatis saat user sign up
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone, role, is_verified)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'phone',
    'calon_mahasiswa'::user_role,
    TRUE
  )
  ON CONFLICT (id) DO UPDATE
  SET
    name = EXCLUDED.name,
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    email = EXCLUDED.email,
    is_verified = TRUE;

  INSERT INTO public.registrations (user_id, status, status_history, data_pribadi)
  VALUES (
    new.id,
    'draft',
    json_build_array(json_build_object(
      'status', 'draft',
      'timestamp', to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
      'note', 'Pendaftaran dimulai'
    )),
    json_build_object(
      'namaLengkap', COALESCE(new.raw_user_meta_data->>'name', ''),
      'email', new.email,
      'noHp', COALESCE(new.raw_user_meta_data->>'phone', '')
    )
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- STEP 8: Verifikasi — lihat policy yang terpasang
-- ============================================================
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'registrations')
ORDER BY tablename, policyname;
