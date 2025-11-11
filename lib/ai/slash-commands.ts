import { TOOL_DESCRIPTIONS } from './tools/index'

/**
 * SLASH COMMANDS SYSTEM
 * Permite a los usuarios insertar acciones en las instrucciones usando /
 */

export interface SlashCommand {
  command: string
  label: string
  description: string
  example: string
  category: 'contacts' | 'communication' | 'deals' | 'tasks' | 'data'
  parameters?: Array<{
    name: string
    type: string
    required: boolean
    description: string
  }>
}

export const SLASH_COMMANDS: SlashCommand[] = [
  // CONTACTS
  {
    command: '/buscar_contactos',
    label: 'Buscar Contactos',
    description: 'Busca contactos en la base de datos con filtros',
    example: '/buscar_contactos query:"tech startups" country:MX limit:10',
    category: 'contacts',
    parameters: [
      { name: 'query', type: 'string', required: false, description: 'Texto de búsqueda' },
      { name: 'country', type: 'string', required: false, description: 'País (MX, BR, CO)' },
      { name: 'limit', type: 'number', required: false, description: 'Máximo de resultados' },
    ],
  },
  {
    command: '/detalles_contacto',
    label: 'Detalles de Contacto',
    description: 'Obtiene información completa de un contacto',
    example: '/detalles_contacto contactId:"abc123"',
    category: 'contacts',
    parameters: [
      { name: 'contactId', type: 'string', required: true, description: 'ID del contacto' },
    ],
  },
  {
    command: '/actualizar_contacto',
    label: 'Actualizar Contacto',
    description: 'Modifica información de un contacto',
    example: '/actualizar_contacto contactId:"abc123" role:"Director"',
    category: 'contacts',
    parameters: [
      { name: 'contactId', type: 'string', required: true, description: 'ID del contacto' },
      { name: 'updates', type: 'object', required: true, description: 'Campos a actualizar' },
    ],
  },

  // COMMUNICATION
  {
    command: '/enviar_email',
    label: 'Enviar Email',
    description: 'Envía un email a un contacto',
    example: '/enviar_email to:"email@ejemplo.com" subject:"Seguimiento" body:"Hola..."',
    category: 'communication',
    parameters: [
      { name: 'to', type: 'string', required: true, description: 'Email del destinatario' },
      { name: 'subject', type: 'string', required: true, description: 'Asunto del email' },
      { name: 'body', type: 'string', required: true, description: 'Contenido del email' },
      { name: 'contactId', type: 'string', required: false, description: 'ID del contacto' },
    ],
  },
  {
    command: '/agendar_reunion',
    label: 'Agendar Reunión',
    description: 'Programa una reunión con un contacto',
    example: '/agendar_reunion contactId:"abc" title:"Demo" datetime:"2024-12-01T10:00"',
    category: 'communication',
    parameters: [
      { name: 'contactId', type: 'string', required: true, description: 'ID del contacto' },
      { name: 'title', type: 'string', required: true, description: 'Título de la reunión' },
      { name: 'datetime', type: 'string', required: true, description: 'Fecha/hora ISO' },
      { name: 'duration', type: 'number', required: false, description: 'Duración en minutos' },
    ],
  },

  // DEALS
  {
    command: '/crear_deal',
    label: 'Crear Deal',
    description: 'Crea un nuevo trato en el CRM',
    example: '/crear_deal name:"Venta CRM" contactId:"abc" amount:50000',
    category: 'deals',
    parameters: [
      { name: 'name', type: 'string', required: true, description: 'Nombre del deal' },
      { name: 'contactId', type: 'string', required: true, description: 'ID del contacto' },
      { name: 'companyId', type: 'string', required: true, description: 'ID de la empresa' },
      { name: 'amount', type: 'number', required: true, description: 'Valor del deal' },
      { name: 'currency', type: 'string', required: false, description: 'Moneda (USD, MXN)' },
    ],
  },
  {
    command: '/actualizar_etapa_deal',
    label: 'Actualizar Etapa de Deal',
    description: 'Mueve un deal a otra etapa del pipeline',
    example: '/actualizar_etapa_deal dealId:"xyz" newStage:"Propuesta"',
    category: 'deals',
    parameters: [
      { name: 'dealId', type: 'string', required: true, description: 'ID del deal' },
      { name: 'newStage', type: 'string', required: true, description: 'Nueva etapa' },
      { name: 'notes', type: 'string', required: false, description: 'Notas' },
    ],
  },

  // TASKS
  {
    command: '/registrar_actividad',
    label: 'Registrar Actividad',
    description: 'Guarda una actividad en el timeline',
    example: '/registrar_actividad type:"call" description:"Llamada de seguimiento"',
    category: 'tasks',
    parameters: [
      { name: 'type', type: 'string', required: true, description: 'Tipo: call, email, meeting, note' },
      { name: 'description', type: 'string', required: true, description: 'Descripción' },
      { name: 'contactId', type: 'string', required: false, description: 'ID del contacto' },
    ],
  },
]

/**
 * Obtiene comandos por categoría
 */
export function getCommandsByCategory(category: string) {
  return SLASH_COMMANDS.filter(cmd => cmd.category === category)
}

/**
 * Busca comandos por texto
 */
export function searchCommands(query: string) {
  const lowerQuery = query.toLowerCase()
  return SLASH_COMMANDS.filter(cmd =>
    cmd.command.toLowerCase().includes(lowerQuery) ||
    cmd.label.toLowerCase().includes(lowerQuery) ||
    cmd.description.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Obtiene sugerencias al escribir /
 */
export function getCommandSuggestions(text: string) {
  // Si el texto termina con / o /algo
  const lastSlashIndex = text.lastIndexOf('/')
  if (lastSlashIndex === -1) return []

  const searchText = text.substring(lastSlashIndex + 1)
  if (searchText.includes(' ')) return [] // Ya completó el comando

  return searchCommands(searchText)
}

/**
 * Formatea un comando con sus parámetros
 */
export function formatCommand(command: SlashCommand, params: Record<string, any> = {}) {
  let formatted = command.command

  if (command.parameters && command.parameters.length > 0) {
    const paramStrings = command.parameters
      .filter(p => params[p.name] !== undefined)
      .map(p => `${p.name}:"${params[p.name]}"`)
    
    if (paramStrings.length > 0) {
      formatted += ' ' + paramStrings.join(' ')
    }
  }

  return formatted
}
