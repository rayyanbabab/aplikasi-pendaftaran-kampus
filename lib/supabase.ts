import { createClient } from "@supabase/supabase-js"

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ligzdfptbjmdtwveazhq.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZ3pkZnB0YmptZHR3dmVhemhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNTQ4MDksImV4cCI6MjA5NTkzMDgwOX0.Jc1eBprYiJFLqTi_ygLvYXy1vJVwuJqmYXzNiFGwvj8"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

