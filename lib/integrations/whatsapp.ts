/**
 * WhatsApp Integration for Nirvania.ai
 * Integración con WhatsApp Business API para notificaciones LATAM
 */

import { formatPhoneForWhatsApp } from '@/lib/utils/form-validation'

interface WhatsAppMessage {
  to: string
  body: string
  mediaUrl?: string
}

/**
 * Send WhatsApp confirmation after form submission
 */
export async function sendWhatsAppConfirmation(
  phoneNumber: string,
  formTitle: string,
  submissionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const formattedPhone = formatPhoneForWhatsApp(phoneNumber)
    
    const message = `✅ *${formTitle}*\n\n¡Gracias por completar el formulario!\n\nHemos recibido tu información y nos pondremos en contacto contigo pronto.\n\n📋 ID de envío: ${submissionId.slice(0, 8)}\n\n_Nirvania - CRM para LATAM_`

    // Log for now (until WhatsApp API is configured)
    console.log('[WhatsApp Confirmation]', {
      to: formattedPhone,
      message,
      submissionId,
    })

    // TODO: Integrate with WhatsApp Business API
    // Option 1: Twilio WhatsApp API
    await sendViaTwilio(formattedPhone, message)

    // Option 2: WhatsApp Business Cloud API
    // await sendViaWhatsAppCloudAPI(formattedPhone, message)

    // Option 3: Third-party service like Wassenger, Wati.io
    // await sendViaThirdParty(formattedPhone, message)

    return { success: true }
  } catch (error) {
    console.error('[WhatsApp Error]', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

/**
 * Send WhatsApp message via Twilio
 */
async function sendViaTwilio(to: string, body: string): Promise<void> {
  // Requires: npm install twilio
  // Environment variables: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER

  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.warn('[Twilio] WhatsApp not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN')
    return
  }

  try {
    // Uncomment when Twilio is set up:
    // const twilio = require('twilio')
    // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    // 
    // await client.messages.create({
    //   from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
    //   to: `whatsapp:${to}`,
    //   body,
    // })

    console.log('[Twilio WhatsApp] Message would be sent to:', to)
  } catch (error) {
    console.error('[Twilio WhatsApp Error]', error)
    throw error
  }
}

/**
 * Send WhatsApp message via WhatsApp Cloud API (Meta)
 */
async function sendViaWhatsAppCloudAPI(to: string, body: string): Promise<void> {
  // Requires WhatsApp Business Account
  // Environment variables: WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_ACCESS_TOKEN

  if (!process.env.WHATSAPP_PHONE_NUMBER_ID || !process.env.WHATSAPP_ACCESS_TOKEN) {
    console.warn('[WhatsApp Cloud API] Not configured')
    return
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to.replace('+', ''),
          type: 'text',
          text: { body },
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('[WhatsApp Cloud API] Message sent:', data)
  } catch (error) {
    console.error('[WhatsApp Cloud API Error]', error)
    throw error
  }
}

/**
 * Send notification to form owner
 */
export async function notifyFormOwner(
  ownerPhone: string,
  formTitle: string,
  submissionData: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  try {
    const formattedPhone = formatPhoneForWhatsApp(ownerPhone)
    
    // Format submission data for WhatsApp
    const dataLines = Object.entries(submissionData)
      .slice(0, 5) // Show first 5 fields
      .map(([key, value]) => `• *${key}*: ${value}`)
      .join('\n')

    const message = `📋 *Nuevo envío de formulario*\n\n*Formulario:* ${formTitle}\n\n${dataLines}\n\n_Ver más detalles en el CRM_`

    console.log('[WhatsApp Owner Notification]', {
      to: formattedPhone,
      message,
    })

    await sendViaTwilio(formattedPhone, message)

    return { success: true }
  } catch (error) {
    console.error('[WhatsApp Owner Notification Error]', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

/**
 * Send template message (for approved WhatsApp templates)
 */
export async function sendTemplateMessage(
  to: string,
  templateName: string,
  templateParams: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.WHATSAPP_PHONE_NUMBER_ID || !process.env.WHATSAPP_ACCESS_TOKEN) {
      return { success: false, error: 'WhatsApp not configured' }
    }

    const formattedPhone = formatPhoneForWhatsApp(to)

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: formattedPhone.replace('+', ''),
          type: 'template',
          template: {
            name: templateName,
            language: { code: 'es_MX' },
            components: [
              {
                type: 'body',
                parameters: templateParams.map(param => ({
                  type: 'text',
                  text: param,
                })),
              },
            ],
          },
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Template send failed: ${response.statusText}`)
    }

    return { success: true }
  } catch (error) {
    console.error('[WhatsApp Template Error]', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

/**
 * Validate WhatsApp number is registered
 */
export async function validateWhatsAppNumber(phoneNumber: string): Promise<boolean> {
  try {
    const formattedPhone = formatPhoneForWhatsApp(phoneNumber)
    
    // For now, just validate format
    // In production, you could ping WhatsApp API to check if number exists
    return /^\+[1-9]\d{1,14}$/.test(formattedPhone)
  } catch (error) {
    console.error('[WhatsApp Validation Error]', error)
    return false
  }
}

/**
 * Generate WhatsApp link for manual contact
 */
export function generateWhatsAppLink(
  phoneNumber: string,
  message?: string
): string {
  const formattedPhone = formatPhoneForWhatsApp(phoneNumber).replace('+', '')
  const encodedMessage = message ? encodeURIComponent(message) : ''
  
  return `https://wa.me/${formattedPhone}${encodedMessage ? `?text=${encodedMessage}` : ''}`
}




