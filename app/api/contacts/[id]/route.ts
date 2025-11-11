import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { contactFormSchema } from '@/lib/validations/contacts'
import { z } from 'zod'

// GET /api/contacts/[id] - Get single contact
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from('contacts')
      .select(`
        *,
        company:companies(*),
        deals(
          id,
          name,
          amount,
          currency,
          stage,
          status,
          closed_at
        )
      `)
      .eq('id', params.id)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Contacto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching contact:', error)
    return NextResponse.json(
      { error: 'Error al obtener contacto' },
      { status: 500 }
    )
  }
}

// PATCH /api/contacts/[id] - Update contact
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient()
    const body = await request.json()

    // Validate request body (partial schema)
    const partialSchema = contactFormSchema.partial()
    const validatedData = partialSchema.parse(body)

    // Check if email is being changed and if it already exists
    if (validatedData.email) {
      const { data: existingContact } = await supabase
        .from('contacts')
        .select('id')
        .eq('email', validatedData.email)
        .neq('id', params.id)
        .single()

      if (existingContact) {
        return NextResponse.json(
          { error: 'Ya existe otro contacto con este email' },
          { status: 409 }
        )
      }
    }

    // Update contact
    const { data, error } = await supabase
      .from('contacts')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
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

    if (!data) {
      return NextResponse.json(
        { error: 'Contacto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating contact:', error)
    return NextResponse.json(
      { error: 'Error al actualizar contacto' },
      { status: 500 }
    )
  }
}

// DELETE /api/contacts/[id] - Delete contact
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient()

    // Check if contact has associated deals
    const { data: deals } = await supabase
      .from('deals')
      .select('id')
      .eq('primary_contact_id', params.id)
      .limit(1)

    if (deals && deals.length > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar un contacto con tratos asociados' },
        { status: 400 }
      )
    }

    // Delete contact
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', params.id)

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Contacto no encontrado' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Contacto eliminado correctamente' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json(
      { error: 'Error al eliminar contacto' },
      { status: 500 }
    )
  }
}
