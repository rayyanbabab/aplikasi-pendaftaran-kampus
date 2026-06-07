-- =============================================================================
-- SEED SCRIPT: Buat Akun Demo untuk Semua Role
-- 
-- CARA PENGGUNAAN:
-- 1. Buka https://supabase.com → pilih proyek Anda
-- 2. Buka menu "SQL Editor" di sidebar kiri
-- 3. Klik "New query"
-- 4. Paste seluruh script ini → klik "Run"
--
-- ⚠ PENTING: Script ini menggunakan ekstensi pgcrypto untuk hash password.
--   Pastikan ekstensi sudah aktif (biasanya sudah aktif by default di Supabase).
-- =============================================================================

-- Aktifkan pgcrypto jika belum aktif
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =============================================================================
-- FUNGSI HELPER: Buat user Supabase Auth + profile sekaligus
-- =============================================================================
CREATE OR REPLACE FUNCTION create_demo_user(
  p_email TEXT,
  p_password TEXT,
  p_name TEXT,
  p_phone TEXT,
  p_role TEXT
) RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
  v_encrypted_pw TEXT;
BEGIN
  -- Periksa apakah email sudah ada di database auth.users
  SELECT id INTO v_user_id FROM auth.users WHERE email = p_email;
  
  -- Hash password menggunakan bcrypt (kompatibel dengan Supabase Auth)
  v_encrypted_pw := crypt(p_password, gen_salt('bf'));

  IF v_user_id IS NULL THEN
    -- Generate UUID baru
    v_user_id := gen_random_uuid();

    -- Insert ke auth.users (tabel internal Supabase)
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      role,
      aud,
      confirmation_token,
      recovery_token,
      email_change_token_new,
      email_change
    ) VALUES (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      p_email,
      v_encrypted_pw,
      NOW(),   -- langsung confirmed, tidak perlu verifikasi email
      '{"provider":"email","providers":["email"]}'::jsonb,
      json_build_object('name', p_name, 'phone', p_phone)::jsonb,
      NOW(),
      NOW(),
      'authenticated',
      'authenticated',
      '',
      '',
      '',
      ''
    );
  ELSE
    -- Jika email sudah ada, update password & metadata terbarunya
    UPDATE auth.users 
    SET encrypted_password = v_encrypted_pw,
        raw_user_meta_data = json_build_object('name', p_name, 'phone', p_phone)::jsonb,
        updated_at = NOW()
    WHERE id = v_user_id;
  END IF;

  -- Upsert ke public.profiles dengan role yang diinginkan
  INSERT INTO public.profiles (id, name, email, phone, role, is_verified)
  VALUES (v_user_id, p_name, p_email, p_phone, p_role::user_role, TRUE)
  ON CONFLICT (id) DO UPDATE
    SET name = EXCLUDED.name,
        role = EXCLUDED.role,
        phone = EXCLUDED.phone,
        is_verified = TRUE;

  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =============================================================================
-- BUAT AKUN DEMO UNTUK SEMUA 6 ROLE
-- Password semua akun: Demo@12345
-- =============================================================================

DO $$
DECLARE
  uid UUID;
BEGIN

  -- 1. Super Admin
  uid := create_demo_user(
    'superadmin@universitasnusantara.ac.id',
    'Demo@12345',
    'Dr. Hendra Wijaya, M.Kom',
    '081100000001',
    'super_admin'
  );
  RAISE NOTICE 'Created super_admin: % (ID: %)', 'superadmin@universitasnusantara.ac.id', uid;

  -- 2. Admin PMB
  uid := create_demo_user(
    'adminpmb@universitasnusantara.ac.id',
    'Demo@12345',
    'Siti Rahayu, S.Pd',
    '081100000002',
    'admin_pmb'
  );
  RAISE NOTICE 'Created admin_pmb: % (ID: %)', 'adminpmb@universitasnusantara.ac.id', uid;

  -- 3. Verifikator
  uid := create_demo_user(
    'verifikator@universitasnusantara.ac.id',
    'Demo@12345',
    'Budi Santoso, S.T',
    '081100000003',
    'verifikator'
  );
  RAISE NOTICE 'Created verifikator: % (ID: %)', 'verifikator@universitasnusantara.ac.id', uid;

  -- 4. Keuangan
  uid := create_demo_user(
    'keuangan@universitasnusantara.ac.id',
    'Demo@12345',
    'Dewi Kusumawati, S.E',
    '081100000004',
    'keuangan'
  );
  RAISE NOTICE 'Created keuangan: % (ID: %)', 'keuangan@universitasnusantara.ac.id', uid;

  -- 5. Penguji
  uid := create_demo_user(
    'penguji@universitasnusantara.ac.id',
    'Demo@12345',
    'Prof. Ahmad Fauzi, Ph.D',
    '081100000005',
    'penguji'
  );
  RAISE NOTICE 'Created penguji: % (ID: %)', 'penguji@universitasnusantara.ac.id', uid;

  -- 6. Calon Mahasiswa
  uid := create_demo_user(
    'mahasiswa@gmail.com',
    'Demo@12345',
    'Rizky Amalia Putri',
    '081100000006',
    'calon_mahasiswa'
  );
  RAISE NOTICE 'Created calon_mahasiswa: % (ID: %)', 'mahasiswa@gmail.com', uid;

END $$;


-- =============================================================================
-- VERIFIKASI: Cek hasil pembuatan akun
-- =============================================================================
SELECT 
  p.name,
  p.email,
  p.role,
  p.is_verified,
  p.phone,
  p.created_at
FROM public.profiles p
WHERE p.email IN (
  'superadmin@universitasnusantara.ac.id',
  'adminpmb@universitasnusantara.ac.id',
  'verifikator@universitasnusantara.ac.id',
  'keuangan@universitasnusantara.ac.id',
  'penguji@universitasnusantara.ac.id',
  'mahasiswa@gmail.com'
)
ORDER BY p.created_at;


-- =============================================================================
-- CLEANUP: Hapus fungsi helper setelah selesai (opsional, untuk keamanan)
-- =============================================================================
-- Uncomment baris di bawah jika ingin menghapus fungsi setelah dijalankan:
-- DROP FUNCTION IF EXISTS create_demo_user(TEXT, TEXT, TEXT, TEXT, TEXT);
