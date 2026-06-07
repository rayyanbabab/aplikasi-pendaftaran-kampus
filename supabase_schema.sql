-- -----------------------------------------------------------------------------
-- SQL SCHEMA FOR STUDENT PORTAL APP (SUPABASE) - ROBUST VERSION
-- 
-- Cara Penggunaan:
-- 1. Buka dashboard proyek Supabase Anda (https://supabase.com).
-- 2. Pergi ke menu "SQL Editor" dari sidebar kiri.
-- 3. Klik "New query" dan buat query kosong.
-- 4. Tempel (paste) seluruh konten SQL di bawah ini.
-- 5. Klik tombol "Run" di kanan bawah untuk mengeksekusi script.
-- -----------------------------------------------------------------------------

-- 1. Buat enum untuk User Roles secara aman (Mencegah error 'type already exists')
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

-- 2. Buat tabel Profiles yang terhubung ke auth.users bawaan Supabase
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT NOT NULL UNIQUE,
  role user_role DEFAULT 'calon_mahasiswa'::user_role NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Aktifkan Row Level Security (RLS) pada tabel profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Buat tabel Registrations untuk menyimpan data form PMB
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

-- Aktifkan Row Level Security (RLS) pada tabel registrations
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- 4. KEAMANAN RLS (Row Level Security)

-- Drop policy lama jika sudah ada untuk menghindari error duplikasi
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins/Staff can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own registration" ON public.registrations;
DROP POLICY IF EXISTS "Users can update their own registration" ON public.registrations;
DROP POLICY IF EXISTS "Admins/Staff can view/edit all registrations" ON public.registrations;

-- Kebijakan Tabel Profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Admins/Staff can view all profiles" 
  ON public.profiles FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('super_admin', 'admin_pmb', 'verifikator', 'keuangan', 'penguji')
    )
  );

-- Kebijakan Tabel Registrations
CREATE POLICY "Users can view their own registration" 
  ON public.registrations FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own registration" 
  ON public.registrations FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins/Staff can view/edit all registrations" 
  ON public.registrations FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('super_admin', 'admin_pmb', 'verifikator', 'keuangan', 'penguji')
    )
  );

-- 5. TRIGGER OTOMATISASI PENDAFTARAN DENGAN SUPABASE AUTH (VERSION 2 - IDEMPOTENT)
-- Fungsi untuk membuat baris profile baru & draft pendaftaran sesaat setelah user melakukan signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert ke public.profiles secara aman (idempotent dengan ON CONFLICT)
  INSERT INTO public.profiles (id, name, email, phone, role, is_verified)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'Calon Mahasiswa'),
    new.email,
    new.raw_user_meta_data->>'phone',
    'calon_mahasiswa'::user_role,
    TRUE
  )
  ON CONFLICT (id) DO UPDATE
  SET name = EXCLUDED.name,
      phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
      email = EXCLUDED.email;
  
  -- Insert draft data awal ke public.registrations secara aman (idempotent dengan ON CONFLICT)
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

-- Trigger setelah ada baris baru di auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
