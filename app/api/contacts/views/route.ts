import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { contactViewSchema } from '@/lib/validations/contacts'

// GET /api/contacts/views - Get user's contact views
export async function GET(request: Request) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from('contact_views')
      .select('*')
      .order('name')

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching contact views:', error)
    return NextResponse.json(
      { error: 'Error al obtener vistas' },
      { status: 500 }
    )
  }
}

// POST /api/contacts/views - Create new contact view
export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const body = await request.json()

    // Validate request body
    const validatedData = contactViewSchema.parse(body)

    // Create view
    const { data, error } = await supabase
      .from('contact_views')
      .insert({
        ...validatedData,
        created_by: 'temp-user-id', // TODO: Get from auth context
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating contact view:', error)
    return NextResponse.json(
      { error: 'Error al crear vista' },
      { status: 500 }
    )
  }
}




