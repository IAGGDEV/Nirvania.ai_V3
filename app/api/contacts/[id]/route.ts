import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import type { ContactFormData } from '@/lib/types/contacts'

// GET /api/contacts/[id] - Get single contact
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Fetch contact with relations
    const { data, error } = await supabase
      .from('contacts')
      .select(`
        *,
        company:companies(id, name, website, industry, logo_url),
        owner:users!owner_id(id, name, email, avatar_url),
        deals(id, name, amount, currency, status)
      `)
      .eq('id', params.id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
      }
      throw error
    }
    
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching contact:', error)
    return NextResponse.json(
      { error: error.message || 'Error al obtener contacto' },
      { status: 500 }
    )
  }
}

// PATCH /api/contacts/[id] - Update contact
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Parse request body
    const body: Partial<ContactFormData> = await request.json()
    
    // Update contact
    const { data, error } = await supabase
      .from('contacts')
      .update(body)
      .eq('id', params.id)
      .select(`
        *,
        company:companies(id, name, website, industry, logo_url),
        owner:users!owner_id(id, name, email, avatar_url)
      `)
      .single()
    
    if (error) {
      console.error('Error updating contact:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error in PATCH /api/contacts/[id]:', error)
    return NextResponse.json(
      { error: error.message || 'Error al actualizar contacto' },
      { status: 500 }
    )
  }
}

// DELETE /api/contacts/[id] - Delete contact
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Delete contact
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', params.id)
    
    if (error) {
      console.error('Error deleting contact:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in DELETE /api/contacts/[id]:', error)
    return NextResponse.json(
      { error: error.message || 'Error al eliminar contacto' },
      { status: 500 }
    )
  }
}
