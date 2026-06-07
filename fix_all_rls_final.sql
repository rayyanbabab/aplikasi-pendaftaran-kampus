-- =============================================================================
-- FIX LENGKAP: Semua Data Admin Tidak Muncul
-- =============================================================================
-- JALANKAN FILE INI DI: Supabase Dashboard → SQL Editor → New Query → Run
--
-- File ini AMAN dijalankan berulang kali (fully idempotent).
-- =============================================================================


-- ============================================================
-- BAGIAN 1: Hapus SEMUA policy lama (agar bisa dibuat ulang)
-- ============================================================
DO $$
DECLARE
  pol RECORD;
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'profiles', 'registrations', 'announcements', 'broadcast_logs',
    'exam_questions', 'exam_schedules', 'exam_rooms', 'exam_proctors',
    'exam_checkins', 'pmb_settings'
  ]) LOOP
    FOR pol IN
      SELECT policyname FROM pg_policies
      WHERE tablename = tbl AND schemaname = 'public'
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, tbl);
      RAISE NOTICE 'Dropped policy % on %', pol.policyname, tbl;
    END LOOP;
  END LOOP;
END $$;


-- ============================================================
-- BAGIAN 2: Fungsi helper (tanpa subquery ke tabel → no recursion)
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
-- BAGIAN 3: Aktifkan RLS pada semua tabel
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadcast_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_proctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pmb_settings ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- BAGIAN 4: Policy PROFILES
-- ============================================================
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_select_admin"
  ON public.profiles FOR SELECT
  USING (public.is_staff());

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_admin"
  ON public.profiles FOR UPDATE
  USING (public.is_staff());

CREATE POLICY "profiles_delete_admin"
  ON public.profiles FOR DELETE
  USING (public.get_my_role() = 'super_admin');


-- ============================================================
-- BAGIAN 5: Policy REGISTRATIONS
-- ============================================================
CREATE POLICY "registrations_select_own"
  ON public.registrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "registrations_select_admin"
  ON public.registrations FOR SELECT
  USING (public.is_staff());

CREATE POLICY "registrations_insert_own"
  ON public.registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "registrations_update_own"
  ON public.registrations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "registrations_update_admin"
  ON public.registrations FOR UPDATE
  USING (public.is_staff());

CREATE POLICY "registrations_delete_admin"
  ON public.registrations FOR DELETE
  USING (public.get_my_role() IN ('super_admin', 'admin_pmb'));


-- ============================================================
-- BAGIAN 6: Policy ANNOUNCEMENTS
-- ============================================================
CREATE POLICY "announcements_select_staff"
  ON public.announcements FOR SELECT
  USING (public.is_staff());

CREATE POLICY "announcements_all_admin"
  ON public.announcements FOR ALL
  USING (public.get_my_role() IN ('super_admin', 'admin_pmb'))
  WITH CHECK (public.get_my_role() IN ('super_admin', 'admin_pmb'));


-- ============================================================
-- BAGIAN 7: Policy BROADCAST_LOGS
-- ============================================================
CREATE POLICY "broadcast_logs_select_staff"
  ON public.broadcast_logs FOR SELECT
  USING (public.is_staff());

CREATE POLICY "broadcast_logs_insert_admin"
  ON public.broadcast_logs FOR INSERT
  WITH CHECK (public.get_my_role() IN ('super_admin', 'admin_pmb'));


-- ============================================================
-- BAGIAN 8: Policy EXAM_QUESTIONS
-- ============================================================
CREATE POLICY "exam_questions_select_staff"
  ON public.exam_questions FOR SELECT
  USING (public.is_staff());

CREATE POLICY "exam_questions_all_penguji"
  ON public.exam_questions FOR ALL
  USING (public.get_my_role() IN ('super_admin', 'admin_pmb', 'penguji'))
  WITH CHECK (public.get_my_role() IN ('super_admin', 'admin_pmb', 'penguji'));


-- ============================================================
-- BAGIAN 9: Policy EXAM_SCHEDULES
-- ============================================================
CREATE POLICY "exam_schedules_select_staff"
  ON public.exam_schedules FOR SELECT
  USING (public.is_staff());

CREATE POLICY "exam_schedules_all_admin"
  ON public.exam_schedules FOR ALL
  USING (public.get_my_role() IN ('super_admin', 'admin_pmb'))
  WITH CHECK (public.get_my_role() IN ('super_admin', 'admin_pmb'));


-- ============================================================
-- BAGIAN 10: Policy EXAM_ROOMS
-- ============================================================
CREATE POLICY "exam_rooms_select_staff"
  ON public.exam_rooms FOR SELECT
  USING (public.is_staff());

CREATE POLICY "exam_rooms_all_admin"
  ON public.exam_rooms FOR ALL
  USING (public.get_my_role() IN ('super_admin', 'admin_pmb'))
  WITH CHECK (public.get_my_role() IN ('super_admin', 'admin_pmb'));


-- ============================================================
-- BAGIAN 11: Policy EXAM_PROCTORS
-- ============================================================
CREATE POLICY "exam_proctors_select_staff"
  ON public.exam_proctors FOR SELECT
  USING (public.is_staff());

CREATE POLICY "exam_proctors_all_admin"
  ON public.exam_proctors FOR ALL
  USING (public.get_my_role() IN ('super_admin', 'admin_pmb'))
  WITH CHECK (public.get_my_role() IN ('super_admin', 'admin_pmb'));


-- ============================================================
-- BAGIAN 12: Policy EXAM_CHECKINS
-- ============================================================
CREATE POLICY "exam_checkins_select_staff"
  ON public.exam_checkins FOR SELECT
  USING (public.is_staff());

CREATE POLICY "exam_checkins_all_staff"
  ON public.exam_checkins FOR ALL
  USING (public.is_staff())
  WITH CHECK (public.is_staff());


-- ============================================================
-- BAGIAN 13: Policy PMB_SETTINGS
-- ============================================================
CREATE POLICY "pmb_settings_select_staff"
  ON public.pmb_settings FOR SELECT
  USING (public.is_staff());

CREATE POLICY "pmb_settings_all_admin"
  ON public.pmb_settings FOR ALL
  USING (public.get_my_role() IN ('super_admin', 'admin_pmb'))
  WITH CHECK (public.get_my_role() IN ('super_admin', 'admin_pmb'));


-- ============================================================
-- BAGIAN 14: Sync app_metadata → tambahkan 'role' ke JWT semua user
-- (Ini yang paling penting! Tanpa ini, is_staff() selalu return false)
-- ============================================================
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data ||
    jsonb_build_object('role', p.role::text)
FROM public.profiles p
WHERE auth.users.id = p.id
  AND p.role IS NOT NULL;

-- Verifikasi: tampilkan semua users dan role mereka
SELECT
  u.email,
  p.role AS profile_role,
  u.raw_app_meta_data ->> 'role' AS jwt_role,
  CASE
    WHEN u.raw_app_meta_data ->> 'role' = p.role::text THEN '✅ SYNC'
    ELSE '❌ MISMATCH'
  END AS status
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
ORDER BY p.role;


-- ============================================================
-- BAGIAN 15: Enable Realtime (safe — skip if already added)
-- ============================================================
DO $$
DECLARE
  tables text[] := ARRAY[
    'registrations', 'profiles',
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
-- BAGIAN 16: Verifikasi akhir — cek semua policy terpasang
-- ============================================================
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
