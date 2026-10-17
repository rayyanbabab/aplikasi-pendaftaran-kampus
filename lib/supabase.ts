import { createClient } from "@supabase/supabase-js"

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ligzdfptbjmdtwveazhq.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_JMewQ3fExjOJSrAPQHPC6A_C9MysLn1"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)


