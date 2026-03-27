import { createClient, type SupabaseClient } from "@supabase/supabase-js"

import { getSupabaseAnonKey, getSupabaseUrl } from "@/utils/supabase/env"

let singleton: SupabaseClient | null = null

/** Route handlers / simple server reads — anon key (RLS). No cookie session. */
export function getSupabase(): SupabaseClient {
  if (!singleton) {
    singleton = createClient(getSupabaseUrl(), getSupabaseAnonKey())
  }
  return singleton
}
