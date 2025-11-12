import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import type { ContactFormData } from '@/lib/types/contacts'

// GET /api/contacts - List contacts with pagination, search, and filters
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const search = searchParams.get('search') || ''
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    
    // Build query
    let query = supabase
      .from('contacts')
      .select(`
        *,
        company:companies(id, name, website, industry, logo_url),
        owner:users!owner_id(id, name, email, avatar_url)
      `, { count: 'exact' })
    
    // Apply search
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`)
    }
    
    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })
    
    // Apply pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)
    
    const { data, error, count } = await query
    
    if (error) {
      console.error('Error fetching contacts:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({
      contacts: data,
      total: count,
      page,
      pageSize,
      totalPages: count ? Math.ceil(count / pageSize) : 0,
    })
  } catch (error: any) {
    console.error('Error in GET /api/contacts:', error)
    return NextResponse.json(
      { error: error.message || 'Error al obtener contactos' },
      { status: 500 }
    )
  }
}

// POST /api/contacts - Create new contact
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user's organization
    const { data: userData } = await supabase
      .from('users')
      .select('organization_id')
      .eq('id', user.id)
      .single()
    
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Parse request body
    const body: ContactFormData = await request.json()
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    
    // Prepare contact data
    const contactData = {
      ...body,
      organization_id: userData.organization_id,
      owner_id: user.id,
      lifecycle_stage: body.lifecycle_stage || 'lead',
      lead_status: body.lead_status || 'new',
      country: body.country || 'MX',
      lead_score: 0,
      email_opt_in: body.email_opt_in !== false,
      whatsapp_opt_in: body.whatsapp_opt_in !== false,
      source: body.source || 'manual',
    }
    
    // Insert contact
    const { data, error } = await supabase
      .from('contacts')
      .insert(contactData)
      .select(`
        *,
        company:companies(id, name, website, industry, logo_url),
        owner:users!owner_id(id, name, email, avatar_url)
      `)
      .single()
    
    if (error) {
      console.error('Error creating contact:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error('Error in POST /api/contacts:', error)
    return NextResponse.json(
      { error: error.message || 'Error al crear contacto' },
      { status: 500 }
    )
  }
}

// DELETE /api/contacts - Delete multiple contacts
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get IDs from query or body
    const searchParams = request.nextUrl.searchParams
    const idsParam = searchParams.get('ids')
    
    let ids: string[] = []
    
    if (idsParam) {
      ids = idsParam.split(',')
    } else {
      const body = await request.json()
      ids = body.ids || []
    }
    
    if (ids.length === 0) {
      return NextResponse.json({ error: 'No IDs provided' }, { status: 400 })
    }
    
    // Delete contacts
    const { error } = await supabase
      .from('contacts')
      .delete()
      .in('id', ids)
    
    if (error) {
      console.error('Error deleting contacts:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, deleted: ids.length })
  } catch (error: any) {
    console.error('Error in DELETE /api/contacts:', error)
    return NextResponse.json(
      { error: error.message || 'Error al eliminar contactos' },
      { status: 500 }
    )
  }
}
