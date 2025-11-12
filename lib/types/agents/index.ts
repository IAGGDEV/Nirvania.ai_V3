// Agent types based on Supabase schema

export interface Agent {
  id: string
  name: string
  description: string
  icon: string
  category: 'account_manager' | 'outbound' | 'inbound' | 'system'
}

export interface Skill {
  id: string
  organization_id: string
  owner_id: string | null
  
  // Basic Info
  name: string
  description: string | null
  
  // Configuration
  goal: string | null
  instructions: string
  restrictions: string | null
  memory: string | null
  
  // Tools/Actions available
  available_tools: string[] | null
  
  // Triggers
  trigger_type: 'manual' | 'schedule' | 'webhook' | 'event' | null
  trigger_config: TriggerConfig | null
  
  // Behavior
  manual_approval: boolean
  
  // Metrics
  total_runs: number
  succeeded: number
  errors: number
  exited: number
  in_progress: number
  
  // Status
  status: 'active' | 'inactive' | 'paused'
  
  // Timestamps
  created_at: string
  updated_at: string
  
  // Relations
  owner?: {
    id: string
    name: string
    email: string
  }
}

export interface SkillRun {
  id: string
  skill_id: string
  
  // Input/Output
  input: string | null
  output: string | null
  
  // Status
  status: 'pending' | 'running' | 'succeeded' | 'failed' | 'exited'
  error: string | null
  
  // Execution Details
  logs: LogEntry[]
  duration_ms: number | null
  
  // Timestamps
  started_at: string | null
  completed_at: string | null
  created_at: string
  
  // Relations
  skill?: Skill
}

export interface TriggerConfig {
  // Schedule trigger
  schedule?: {
    type: 'interval' | 'cron'
    value: string // "every 1 hour" or "0 9 * * *"
  }
  
  // Webhook trigger
  webhook?: {
    url: string
    secret?: string
  }
  
  // Event trigger
  event?: {
    type: 'contact_created' | 'deal_created' | 'form_submitted'
    filters?: Record<string, any>
  }
}

export interface LogEntry {
  timestamp: string
  level: 'info' | 'warning' | 'error' | 'success'
  message: string
  metadata?: Record<string, any>
}

export interface SkillFormData {
  name: string
  description?: string
  goal?: string
  instructions: string
  restrictions?: string
  memory?: string
  available_tools?: string[]
  trigger_type?: Skill['trigger_type']
  trigger_config?: TriggerConfig
  manual_approval?: boolean
  status?: Skill['status']
}

export interface ExecutionResult {
  success: boolean
  output?: string
  error?: string
  logs: LogEntry[]
  duration_ms: number
}

// Available tools for skills
export const AVAILABLE_TOOLS = [
  {
    id: 'search_contacts',
    name: 'Buscar Contactos',
    description: 'Busca contactos en la base de datos',
    category: 'crm',
  },
  {
    id: 'create_contact',
    name: 'Crear Contacto',
    description: 'Crea un nuevo contacto en el CRM',
    category: 'crm',
  },
  {
    id: 'update_contact',
    name: 'Actualizar Contacto',
    description: 'Actualiza información de un contacto',
    category: 'crm',
  },
  {
    id: 'send_email',
    name: 'Enviar Email',
    description: 'Envía un email a un contacto',
    category: 'communication',
  },
  {
    id: 'send_whatsapp',
    name: 'Enviar WhatsApp',
    description: 'Envía un mensaje de WhatsApp',
    category: 'communication',
  },
  {
    id: 'create_deal',
    name: 'Crear Deal',
    description: 'Crea una nueva oportunidad de venta',
    category: 'sales',
  },
  {
    id: 'web_search',
    name: 'Búsqueda Web',
    description: 'Busca información en internet',
    category: 'research',
  },
  {
    id: 'enrich_contact',
    name: 'Enriquecer Contacto',
    description: 'Busca información adicional del contacto',
    category: 'research',
  },
] as const

// Predefined agents
export const PREDEFINED_AGENTS: Agent[] = [
  {
    id: 'account-manager',
    name: 'Account Manager',
    description: 'Drives your pipeline and grows existing accounts',
    icon: '🎯',
    category: 'account_manager',
  },
  {
    id: 'outbound-manager',
    name: 'Outbound Manager',
    description: 'Proactively finds and engages new prospects',
    icon: '📧',
    category: 'outbound',
  },
  {
    id: 'inbound-manager',
    name: 'Inbound Manager',
    description: 'Handles inbound inquiries from potential customers',
    icon: '📥',
    category: 'inbound',
  },
  {
    id: 'system-manager',
    name: 'System Manager',
    description: 'Handles system tasks like imports, data syncing, and more',
    icon: '⚙️',
    category: 'system',
  },
]
