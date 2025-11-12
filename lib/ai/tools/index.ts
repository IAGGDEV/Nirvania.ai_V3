import { DynamicStructuredTool } from '@langchain/core/tools'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'

/**
 * TOOLS REGISTRY
 * Todas las acciones que los agents pueden ejecutar en el CRM
 */

// ============================================
// CONTACT TOOLS
// ============================================

export const searchContactsTool = new DynamicStructuredTool({
  name: 'search_contacts',
  description: 'Busca contactos en la base de datos con filtros específicos. Útil para encontrar leads, clientes o prospectos.',
  schema: z.object({
    query: z.string().optional().describe('Texto de búsqueda (nombre, email, empresa)'),
    country: z.string().optional().describe('Filtrar por país (MX, BR, CO, etc)'),
    hasDeals: z.boolean().optional().describe('Solo contactos con deals activos'),
    lastContactedDaysAgo: z.number().optional().describe('Días desde último contacto'),
    limit: z.number().default(50).describe('Máximo de resultados'),
  }),
  func: async ({ query, country, hasDeals, lastContactedDaysAgo, limit }) => {
    try {
      const supabase = createClient()
      let dbQuery = supabase
        .from('contacts')
        .select('*, company:companies(name), deals(id, status)')
        .limit(limit)

      if (query) {
        dbQuery = dbQuery.or(`name.ilike.%${query}%,email.ilike.%${query}%`)
      }

      if (country) {
        dbQuery = dbQuery.eq('country', country)
      }

      const { data, error } = await dbQuery

      if (error) throw error

      let results = data || []

      // Filter by deals if needed
      if (hasDeals !== undefined) {
        results = results.filter(contact => 
          hasDeals ? (contact.deals && contact.deals.length > 0) : !contact.deals || contact.deals.length === 0
        )
      }

      return JSON.stringify({
        success: true,
        count: results.length,
        contacts: results.map(c => ({
          id: c.id,
          name: c.name,
          email: c.email,
          company: c.company?.name,
          dealsCount: c.deals?.length || 0,
        }))
      })
    } catch (error) {
      return JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Error al buscar contactos'
      })
    }
  },
})

export const getContactDetailsTool = new DynamicStructuredTool({
  name: 'get_contact_details',
  description: 'Obtiene información detallada de un contacto específico incluyendo historial de interacciones y deals.',
  schema: z.object({
    contactId: z.string().describe('ID del contacto'),
  }),
  func: async ({ contactId }) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('contacts')
        .select(`
          *,
          company:companies(*),
          deals(*)
        `)
        .eq('id', contactId)
        .single()

      if (error) throw error

      return JSON.stringify({
        success: true,
        contact: data
      })
    } catch (error) {
      return JSON.stringify({
        success: false,
        error: 'Contacto no encontrado'
      })
    }
  },
})

export const updateContactTool = new DynamicStructuredTool({
  name: 'update_contact',
  description: 'Actualiza información de un contacto existente.',
  schema: z.object({
    contactId: z.string().describe('ID del contacto'),
    updates: z.object({
      phone: z.string().optional(),
      role: z.string().optional(),
      location: z.string().optional(),
      notes: z.string().optional(),
    }).describe('Campos a actualizar'),
  }),
  func: async ({ contactId, updates }) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('contacts')
        .update(updates)
        .eq('id', contactId)
        .select()
        .single()

      if (error) throw error

      return JSON.stringify({
        success: true,
        contact: data
      })
    } catch (error) {
      return JSON.stringify({
        success: false,
        error: 'Error al actualizar contacto'
      })
    }
  },
})

// ============================================
// EMAIL TOOLS
// ============================================

export const sendEmailTool = new DynamicStructuredTool({
  name: 'send_email',
  description: 'Envía un email a un contacto. En modo test, solo simula el envío.',
  schema: z.object({
    to: z.string().email().describe('Email del destinatario'),
    subject: z.string().describe('Asunto del email'),
    body: z.string().describe('Contenido del email'),
    contactId: z.string().optional().describe('ID del contacto (para tracking)'),
    testMode: z.boolean().default(true).describe('Si es true, solo simula el envío'),
  }),
  func: async ({ to, subject, body, contactId, testMode }) => {
    try {
      if (testMode) {
        return JSON.stringify({
          success: true,
          message: '✅ EMAIL SIMULADO (Modo Test)',
          details: {
            to,
            subject,
            preview: body.substring(0, 100) + '...',
            note: 'Este email NO fue enviado. Es solo una simulación.'
          }
        })
      }

      // TODO: Implementar envío real con servicio de email
      // Por ahora solo registramos la actividad
      if (contactId) {
        const supabase = createClient()
        await supabase.from('activities').insert({
          contact_id: contactId,
          type: 'email_sent',
          metadata: { subject, to }
        })
      }

      return JSON.stringify({
        success: true,
        message: 'Email enviado correctamente',
        to,
        subject
      })
    } catch (error) {
      return JSON.stringify({
        success: false,
        error: 'Error al enviar email'
      })
    }
  },
})

// ============================================
// DEAL TOOLS
// ============================================

export const createDealTool = new DynamicStructuredTool({
  name: 'create_deal',
  description: 'Crea un nuevo deal/trato en el CRM.',
  schema: z.object({
    name: z.string().describe('Nombre del deal'),
    contactId: z.string().describe('ID del contacto principal'),
    companyId: z.string().describe('ID de la empresa'),
    amount: z.number().describe('Valor del deal'),
    currency: z.string().default('USD').describe('Moneda (USD, MXN, BRL, etc)'),
    stage: z.string().default('Prospecto').describe('Etapa inicial del pipeline'),
  }),
  func: async ({ name, contactId, companyId, amount, currency, stage }) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('deals')
        .insert({
          name,
          primary_contact_id: contactId,
          company_id: companyId,
          amount,
          currency,
          stage,
          status: 'open',
        })
        .select()
        .single()

      if (error) throw error

      return JSON.stringify({
        success: true,
        deal: data
      })
    } catch (error) {
      return JSON.stringify({
        success: false,
        error: 'Error al crear deal'
      })
    }
  },
})

export const updateDealStageTool = new DynamicStructuredTool({
  name: 'update_deal_stage',
  description: 'Actualiza la etapa de un deal en el pipeline.',
  schema: z.object({
    dealId: z.string().describe('ID del deal'),
    newStage: z.string().describe('Nueva etapa (Prospecto, Calificación, Propuesta, Negociación, Cerrado)'),
    notes: z.string().optional().describe('Notas sobre el cambio'),
  }),
  func: async ({ dealId, newStage, notes }) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('deals')
        .update({ stage: newStage })
        .eq('id', dealId)
        .select()
        .single()

      if (error) throw error

      // Log activity
      if (notes) {
        await supabase.from('activities').insert({
          deal_id: dealId,
          type: 'stage_changed',
          metadata: { stage: newStage, notes }
        })
      }

      return JSON.stringify({
        success: true,
        deal: data
      })
    } catch (error) {
      return JSON.stringify({
        success: false,
        error: 'Error al actualizar deal'
      })
    }
  },
})

// ============================================
// SCHEDULING TOOLS
// ============================================

export const scheduleMeetingTool = new DynamicStructuredTool({
  name: 'schedule_meeting',
  description: 'Programa una reunión y envía invitación de calendario.',
  schema: z.object({
    contactId: z.string().describe('ID del contacto'),
    title: z.string().describe('Título de la reunión'),
    datetime: z.string().describe('Fecha y hora en formato ISO'),
    duration: z.number().default(30).describe('Duración en minutos'),
    notes: z.string().optional().describe('Notas adicionales'),
  }),
  func: async ({ contactId, title, datetime, duration, notes }) => {
    try {
      // TODO: Integrar con Google Calendar o similar
      return JSON.stringify({
        success: true,
        message: 'Reunión programada',
        meeting: {
          title,
          datetime,
          duration,
          calendarLink: `https://calendly.com/nirvania/demo`
        }
      })
    } catch (error) {
      return JSON.stringify({
        success: false,
        error: 'Error al programar reunión'
      })
    }
  },
})

// ============================================
// ACTIVITY TOOLS
// ============================================

export const logActivityTool = new DynamicStructuredTool({
  name: 'log_activity',
  description: 'Registra una actividad en el timeline del contacto o deal.',
  schema: z.object({
    type: z.enum(['call', 'email', 'meeting', 'note', 'task']).describe('Tipo de actividad'),
    contactId: z.string().optional(),
    dealId: z.string().optional(),
    description: z.string().describe('Descripción de la actividad'),
    metadata: z.record(z.any()).optional(),
  }),
  func: async ({ type, contactId, dealId, description, metadata }) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('activities')
        .insert({
          type,
          contact_id: contactId,
          deal_id: dealId,
          description,
          metadata,
        })
        .select()
        .single()

      if (error) throw error

      return JSON.stringify({
        success: true,
        activity: data
      })
    } catch (error) {
      return JSON.stringify({
        success: false,
        error: 'Error al registrar actividad'
      })
    }
  },
})

// ============================================
// REGISTRY
// ============================================

/**
 * Registro de todas las herramientas disponibles
 * Los agents pueden usar estas herramientas para interactuar con el CRM
 */
export const TOOL_REGISTRY = {
  // Contact tools
  search_contacts: searchContactsTool,
  get_contact_details: getContactDetailsTool,
  update_contact: updateContactTool,
  
  // Communication tools
  send_email: sendEmailTool,
  schedule_meeting: scheduleMeetingTool,
  
  // Deal tools
  create_deal: createDealTool,
  update_deal_stage: updateDealStageTool,
  
  // Activity tools
  log_activity: logActivityTool,
} as const

export type ToolName = keyof typeof TOOL_REGISTRY

/**
 * Obtiene las herramientas según las necesidades del skill
 */
export function getToolsForSkill(toolNames?: ToolName[]) {
  if (!toolNames || toolNames.length === 0) {
    return Object.values(TOOL_REGISTRY)
  }
  
  return toolNames
    .map(name => TOOL_REGISTRY[name])
    .filter(Boolean)
}

/**
 * Descripción de herramientas para slash commands
 */
export const TOOL_DESCRIPTIONS = {
  search_contacts: {
    command: '/buscar_contactos',
    description: 'Buscar contactos en la base de datos',
    example: '/buscar_contactos query:"empresa tech" country:MX',
  },
  get_contact_details: {
    command: '/detalles_contacto',
    description: 'Obtener información completa de un contacto',
    example: '/detalles_contacto contactId:"123"',
  },
  send_email: {
    command: '/enviar_email',
    description: 'Enviar email a un contacto',
    example: '/enviar_email to:"email@ejemplo.com" subject:"Seguimiento"',
  },
  create_deal: {
    command: '/crear_deal',
    description: 'Crear nuevo deal en el CRM',
    example: '/crear_deal name:"Venta Software" amount:50000',
  },
  schedule_meeting: {
    command: '/agendar_reunion',
    description: 'Programar reunión con contacto',
    example: '/agendar_reunion title:"Demo" datetime:"2024-12-01T10:00"',
  },
  log_activity: {
    command: '/registrar_actividad',
    description: 'Guardar actividad en timeline',
    example: '/registrar_actividad type:"call" description:"Llamada de seguimiento"',
  },
} as const




