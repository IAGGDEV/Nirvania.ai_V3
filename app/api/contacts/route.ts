import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { contactFormSchema, contactSearchSchema } from '@/lib/validations/contacts'

// GET /api/contacts - List contacts with filters and pagination
export async function GET(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(request.url)

    // Parse and validate search params
    const params = contactSearchSchema.parse({
      query: searchParams.get('query') || undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      pageSize: searchParams.get('pageSize') ? parseInt(searchParams.get('pageSize')!) : 25,
    })

    // Build query
    let query = supabase
      .from('contacts')
      .select(`
        *,
        company:companies(id, name, website, industry),
        deals(id, name, amount, currency, stage, status)
      `, { count: 'exact' })

    // Apply search query
    if (params.query) {
      query = query.or(`
        name.ilike.%${params.query}%,
        email.ilike.%${params.query}%,
        role.ilike.%${params.query}%,
        location.ilike.%${params.query}%
      `)
    }

    // Apply pagination
    const from = (params.page - 1) * params.pageSize
    const to = from + params.pageSize - 1
    query = query.range(from, to)

    // Default sorting by created_at desc
    query = query.order('created_at', { ascending: false })

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      data: data || [],
      pagination: {
        page: params.page,
        pageSize: params.pageSize,
        total: count || 0,
        pages: Math.ceil((count || 0) / params.pageSize)
      }
    })
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { error: 'Error al obtener contactos' },
      { status: 500 }
    )
  }
}

// POST /api/contacts - Create new contact
export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const body = await request.json()

    // Validate request body
    const validatedData = contactFormSchema.parse(body)

    // Check if email already exists
    const { data: existingContact } = await supabase
      .from('contacts')
      .select('id')
      .eq('email', validatedData.email)
      .single()

    if (existingContact) {
      return NextResponse.json(
        { error: 'Ya existe un contacto con este email' },
        { status: 409 }
      )
    }

    // Create contact
    const { data, error } = await supabase
      .from('contacts')
      .insert({
        ...validatedData,
        organization_id: 'temp-org-id', // TODO: Get from auth context
        enriched: false,
        source: 'manual'
      })
      .select(`
        *,
        company:companies(id, name, website, industry)
      `)
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating contact:', error)
    return NextResponse.json(
      { error: 'Error al crear contacto' },
      { status: 500 }
    )
  }
}
