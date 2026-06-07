-- =============================================================================
-- FIX: Dashboard Error "Error loading dashboard data: {}"
-- 
-- MASALAH: RLS policy untuk tabel registrations memblokir admin karena:
--   1. Subquery ke profiles menyebabkan infinite recursion
--   2. Akun demo (non-Supabase JWT) tidak punya auth.uid() yang valid
--
-- SOLUSI: 
--   - Hapus policy lama yang pakai subquery
--   - Buat policy baru menggunakan app_metadata/user_metadata dari JWT
--   - Tambahkan kolom role ke app_metadata agar bisa dibaca lewat auth.jwt()
--
-- CARA PAKAI:
--   1. Buka https://supabase.com → pilih proyek Anda
--   2. Klik "SQL Editor" → "New query"
--   3. Paste SELURUH isi script ini → klik "Run"
-- =============================================================================


-- ============================================================
-- STEP 1: Hapus SEMUA policy lama (profiles & registrations)
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
-- STEP 2: Fungsi helper — ambil role dari app_metadata JWT
-- (TIDAK ada subquery ke tabel profiles → tidak ada recursion)
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
  SELECT COALESCE(
    auth.jwt() -> 'app_metadata' ->> 'role',
    auth.jwt() -> 'user_metadata' ->> 'role',
    'calon_mahasiswa'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
  SELECT public.get_my_role() IN (
    'super_admin', 'admin_pmb', 'verifikator', 'keuangan', 'penguji'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- ============================================================
-- STEP 3: Aktifkan RLS
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- STEP 4: Policy PROFILES — tanpa subquery, tanpa recursion
-- ============================================================

-- User bisa lihat profil sendiri
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Admin/staff bisa lihat semua profil (via JWT role, bukan subquery)
CREATE POLICY "profiles_select_admin"
  ON public.profiles FOR SELECT
  USING (public.is_staff());

-- User bisa insert profil sendiri
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- User bisa update profil sendiri
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admin bisa update profil siapapun (via JWT)
CREATE POLICY "profiles_update_admin"
  ON public.profiles FOR UPDATE
  USING (public.is_staff());


-- ============================================================
-- STEP 5: Policy REGISTRATIONS — tanpa subquery, tanpa recursion
-- ============================================================

-- User lihat registrasi milik sendiri
CREATE POLICY "registrations_select_own"
  ON public.registrations FOR SELECT
  USING (auth.uid() = user_id);

-- Admin/staff lihat SEMUA registrasi (via JWT role)
CREATE POLICY "registrations_select_admin"
  ON public.registrations FOR SELECT
  USING (public.is_staff());

-- User bisa insert registrasi sendiri
CREATE POLICY "registrations_insert_own"
  ON public.registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User bisa update registrasi sendiri
CREATE POLICY "registrations_update_own"
  ON public.registrations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admin/staff bisa update registrasi siapapun
CREATE POLICY "registrations_update_admin"
  ON public.registrations FOR UPDATE
  USING (public.is_staff());


-- ============================================================
-- STEP 6: Update app_metadata untuk akun admin yang sudah ada
-- Ini memastikan JWT mereka punya claim 'role' yang benar
-- ============================================================
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || 
    jsonb_build_object('role', p.role::text)
FROM public.profiles p
WHERE auth.users.id = p.id
  AND p.role IN ('super_admin','admin_pmb','verifikator','keuangan','penguji');

-- ============================================================
-- STEP 7: Verifikasi — lihat semua policy yang terpasang
-- ============================================================
SELECT 
  tablename, 
  policyname, 
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'registrations')
ORDER BY tablename, policyname;
