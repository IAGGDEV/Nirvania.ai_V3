import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { contactViewSchema } from '@/lib/validations/contacts'

// PATCH /api/contacts/views/[id] - Update contact view
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient()
    const body = await request.json()

    // Validate request body (partial schema)
    const partialSchema = contactViewSchema.partial()
    const validatedData = partialSchema.parse(body)

    // Update view
    const { data, error } = await supabase
      .from('contact_views')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Vista no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating contact view:', error)
    return NextResponse.json(
      { error: 'Error al actualizar vista' },
      { status: 500 }
    )
  }
}

// DELETE /api/contacts/views/[id] - Delete contact view
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient()

    // Don't allow deletion of default views
    const { data: view } = await supabase
      .from('contact_views')
      .select('is_default')
      .eq('id', params.id)
      .single()

    if (view?.is_default) {
      return NextResponse.json(
        { error: 'No se puede eliminar la vista por defecto' },
        { status: 400 }
      )
    }

    // Delete view
    const { error } = await supabase
      .from('contact_views')
      .delete()
      .eq('id', params.id)

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Vista no encontrada' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Vista eliminada correctamente' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting contact view:', error)
    return NextResponse.json(
      { error: 'Error al eliminar vista' },
      { status: 500 }
    )
  }
}




