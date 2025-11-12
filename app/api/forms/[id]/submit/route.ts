import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { sendWhatsAppConfirmation } from '@/lib/integrations/whatsapp'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient()
    const formId = params.id

    // Get form
    const { data: form, error: formError } = await supabase
      .from('forms')
      .select('*')
      .eq('id', formId)
      .eq('status', 'published')
      .single()

    if (formError || !form) {
      return NextResponse.json(
        { error: 'Formulario no encontrado o no publicado' },
        { status: 404 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { responses, metadata } = body

    // Get client IP
    const headersList = headers()
    const ip = headersList.get('x-forwarded-for') || 
               headersList.get('x-real-ip') || 
               'unknown'

    // Validate required fields
    const missingFields: string[] = []
    form.fields.forEach((field: any) => {
      if (field.required && !responses[field.id]) {
        missingFields.push(field.label)
      }
    })

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Campos requeridos faltantes: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Create submission
    const { data: submission, error: submissionError } = await supabase
      .from('form_submissions')
      .insert({
        form_id: formId,
        responses,
        ip_address: ip,
        user_agent: metadata?.userAgent,
        referer: metadata?.referer,
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (submissionError) {
      console.error('[Submission Error]', submissionError)
      throw submissionError
    }

    // Update form submission count
    await supabase
      .from('forms')
      .update({ 
        submission_count: (form.submission_count || 0) + 1,
        last_submission_at: new Date().toISOString(),
      })
      .eq('id', formId)

    // Auto-create or update contact
    let contactId: string | null = null
    if (form.auto_create_contact) {
      contactId = await createOrUpdateContact(supabase, form, responses)
      
      if (contactId) {
        await supabase
          .from('form_submissions')
          .update({ 
            contact_id: contactId,
            contact_created: true 
          })
          .eq('id', submission.id)
      }
    }

    // Send WhatsApp confirmation for LATAM
    const phoneField = form.fields.find((f: any) => f.type === 'phone')
    if (phoneField && responses[phoneField.id]) {
      await sendWhatsAppConfirmation(
        responses[phoneField.id],
        form.title,
        submission.id
      )
    }

    // Send notification email (if configured)
    if (form.send_notification_email && form.notification_email) {
      await sendNotificationEmail(form, responses, form.notification_email)
    }

    // Trigger webhooks (if configured)
    if (form.webhook_url) {
      await triggerWebhook(form.webhook_url, {
        formId: form.id,
        formTitle: form.title,
        submissionId: submission.id,
        responses,
        contactId,
        timestamp: new Date().toISOString(),
      })
    }

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      contactId,
      message: 'Formulario enviado exitosamente',
    })
  } catch (error) {
    console.error('[Form Submission Error]', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

async function createOrUpdateContact(
  supabase: any,
  form: any,
  responses: Record<string, any>
): Promise<string | null> {
  try {
    // Extract contact data from responses based on field mappings
    const contactData: any = {
      organization_id: form.organization_id,
    }

    form.fields.forEach((field: any) => {
      if (field.mappedTo && responses[field.id]) {
        const mappedField = field.mappedTo.replace('contact.', '')
        contactData[mappedField] = responses[field.id]
      }
    })

    // Ensure we have at least a name or email
    if (!contactData.name && !contactData.email) {
      console.warn('[Contact Creation] No name or email provided')
      return null
    }

    // Check if contact with email exists
    if (contactData.email) {
      const { data: existingContact } = await supabase
        .from('contacts')
        .select('id')
        .eq('email', contactData.email)
        .eq('organization_id', form.organization_id)
        .single()

      if (existingContact) {
        // Update existing contact
        await supabase
          .from('contacts')
          .update({
            ...contactData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingContact.id)
        
        return existingContact.id
      }
    }

    // Create new contact
    const { data: newContact, error } = await supabase
      .from('contacts')
      .insert({
        ...contactData,
        source: 'form',
        form_id: form.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('[Create Contact Error]', error)
      return null
    }

    return newContact.id
  } catch (error) {
    console.error('[Contact Creation Error]', error)
    return null
  }
}

async function sendNotificationEmail(
  form: any,
  responses: Record<string, any>,
  email: string
) {
  try {
    // TODO: Integrate with email provider (SendGrid, AWS SES, Resend, etc.)
    console.log('[Email Notification]', {
      to: email,
      subject: `Nuevo envío de formulario: ${form.title}`,
      body: JSON.stringify(responses, null, 2),
    })

    // Example with Resend (recommended for Next.js):
    // import { Resend } from 'resend'
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'Nirvania <noreply@nirvania.ai>',
    //   to: email,
    //   subject: `Nuevo envío de formulario: ${form.title}`,
    //   html: generateEmailHTML(form, responses),
    // })
  } catch (error) {
    console.error('[Email Send Error]', error)
  }
}

async function triggerWebhook(url: string, data: any) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Nirvania-Forms/1.0',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.statusText}`)
    }

    console.log('[Webhook] Successfully triggered:', url)
  } catch (error) {
    console.error('[Webhook Error]', error)
    // Don't throw - webhook errors shouldn't block form submission
  }
}




