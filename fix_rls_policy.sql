-- =============================================================================
-- FIX: Infinite Recursion pada RLS Policy tabel "profiles"
-- 
-- CARA PAKAI:
-- 1. Buka https://supabase.com → pilih proyek Anda
-- 2. Klik "SQL Editor" di sidebar kiri → klik "New query"
-- 3. Paste seluruh script ini → klik "Run"
-- =============================================================================

-- Step 1: Hapus semua policy lama yang bermasalah pada tabel profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow all authenticated users to view profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;

-- Hapus semua policy yang ada (jika namanya berbeda)
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN 
    SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', pol.policyname);
    RAISE NOTICE 'Dropped policy: %', pol.policyname;
  END LOOP;
END $$;

-- Step 2: Nonaktifkan RLS sementara (opsional, untuk testing)
-- ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Step 3: Aktifkan RLS dengan policy yang BENAR (tidak ada rekursi)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: User bisa lihat profil sendiri (menggunakan auth.uid() langsung, TANPA subquery ke profiles)
CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: User bisa update profil sendiri
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: User bisa insert profil sendiri (saat registrasi)
CREATE POLICY "profiles_insert_own"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy: Service role (admin) bisa akses semua tanpa batasan
-- (Sudah otomatis untuk service_role, tidak perlu policy tambahan)

-- Step 4: Verifikasi policy sudah benar
SELECT 
  policyname, 
  cmd, 
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'profiles' AND schemaname = 'public'
ORDER BY policyname;

-- =============================================================================
-- JIKA MASIH ADA MASALAH: Coba nonaktifkan RLS sepenuhnya (untuk development)
-- Uncomment baris di bawah:
-- ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.registrations DISABLE ROW LEVEL SECURITY;
-- =============================================================================
