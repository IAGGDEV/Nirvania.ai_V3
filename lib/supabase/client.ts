import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { config } from '@/lib/config'

export function createClient() {
  return createSupabaseClient(
    config.supabase.url,
    config.supabase.anonKey
  )
}

