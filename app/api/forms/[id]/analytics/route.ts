import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient()
    const formId = params.id

    // Get form with metrics
    const { data: form, error: formError } = await supabase
      .from('forms')
      .select('*')
      .eq('id', formId)
      .single()

    if (formError || !form) {
      return NextResponse.json({ error: 'Formulario no encontrado' }, { status: 404 })
    }

    // Get submissions over time
    const { data: submissions } = await supabase
      .from('form_submissions')
      .select('submitted_at, created_at')
      .eq('form_id', formId)
      .order('submitted_at', { ascending: true })

    // Calculate metrics
    const views = form.view_count || 0
    const submissionCount = form.submission_count || 0
    const completionRate = views > 0 
      ? Math.round((submissionCount / views) * 100)
      : 0

    // Group submissions by day
    const submissionsByDay: Record<string, number> = {}
    submissions?.forEach((sub) => {
      const date = new Date(sub.submitted_at || sub.created_at).toISOString().split('T')[0]
      submissionsByDay[date] = (submissionsByDay[date] || 0) + 1
    })

    // Get field-level analytics
    const { data: allSubmissions } = await supabase
      .from('form_submissions')
      .select('responses')
      .eq('form_id', formId)

    // Calculate field completion rates
    const fieldStats: Record<string, { completed: number; total: number }> = {}
    form.fields.forEach((field: any) => {
      fieldStats[field.id] = { completed: 0, total: 0 }
    })

    allSubmissions?.forEach((submission) => {
      const responses = submission.responses as Record<string, any>
      form.fields.forEach((field: any) => {
        fieldStats[field.id].total++
        if (responses[field.id]) {
          fieldStats[field.id].completed++
        }
      })
    })

    // Calculate average completion rate per field
    const fieldCompletionRates = Object.entries(fieldStats).map(([fieldId, stats]) => {
      const field = form.fields.find((f: any) => f.id === fieldId)
      return {
        fieldId,
        fieldLabel: field?.label || 'Unknown',
        completionRate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
      }
    })

    // Get recent submissions with contact info
    const { data: recentSubmissions } = await supabase
      .from('form_submissions')
      .select(`
        id,
        submitted_at,
        contact_created,
        contact:contacts(id, name, email)
      `)
      .eq('form_id', formId)
      .order('submitted_at', { ascending: false })
      .limit(10)

    return NextResponse.json({
      metrics: {
        views,
        submissions: submissionCount,
        completionRate,
        contactsCreated: allSubmissions?.filter((s: any) => s.contact_created).length || 0,
      },
      submissionsByDay,
      fieldCompletionRates,
      recentSubmissions: recentSubmissions || [],
      formDetails: {
        title: form.title,
        status: form.status,
        createdAt: form.created_at,
        lastSubmissionAt: form.last_submission_at,
      },
    })
  } catch (error) {
    console.error('[Analytics Error]', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}




