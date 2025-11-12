import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  
  // Sign out
  await supabase.auth.signOut()
  
  // Redirect to login
  return NextResponse.redirect(new URL('/auth/login', request.url))
}

