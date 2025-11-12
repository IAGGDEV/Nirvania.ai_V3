import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { PublicFormRenderer } from '@/components/features/forms/public-form-renderer'

interface PublicFormPageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PublicFormPageProps) {
  const supabase = createServerSupabaseClient()
  
  const { data: form } = await supabase
    .from('forms')
    .select('title, description')
    .eq('id', params.id)
    .eq('status', 'published')
    .single()

  if (!form) {
    return {
      title: 'Formulario No Encontrado',
    }
  }

  return {
    title: form.title,
    description: form.description || 'Completa este formulario',
    openGraph: {
      title: form.title,
      description: form.description || 'Completa este formulario',
    },
  }
}

export default async function PublicFormPage({ params }: PublicFormPageProps) {
  const supabase = createServerSupabaseClient()
  
  // Fetch form
  const { data: form, error } = await supabase
    .from('forms')
    .select('*')
    .eq('id', params.id)
    .eq('status', 'published')
    .single()

  if (error || !form) {
    notFound()
  }

  // Track view (non-blocking)
  supabase
    .from('forms')
    .update({ view_count: (form.view_count || 0) + 1 })
    .eq('id', form.id)
    .then()

  return <PublicFormRenderer form={form} />
}




