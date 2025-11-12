// Agent Worker Types
export type AgentType = 
  | 'account_manager' 
  | 'outbound_manager' 
  | 'inbound_manager' 
  | 'system_manager'

export interface Agent {
  id: string
  organizationId: string
  name: string
  description: string
  icon: string
  type: AgentType
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}

// Skill Types
export type SkillStatus = 'active' | 'inactive' | 'paused'

export interface Trigger {
  type: 'schedule' | 'event' | 'manual' | 'condition'
  config: Record<string, any>
}

export interface Skill {
  id: string
  organizationId: string
  agentId: string
  ownerId: string
  
  name: string
  description?: string
  handle: string
  
  // Configuration
  goal?: string
  instructions: string
  triggers: Trigger[]
  restrictions?: string
  memory?: string
  manualApproval: boolean
  
  // Metrics
  totalRuns: number
  inProgress: number
  succeeded: number
  exited: number
  errors: number
  
  // Status
  status: SkillStatus
  
  createdAt: Date
  updatedAt: Date
  
  // Relations
  agent?: Agent
  owner?: {
    id: string
    name: string
    email: string
  }
}

// Skill Run Types
export type SkillRunStatus = 
  | 'pending' 
  | 'running' 
  | 'succeeded' 
  | 'failed' 
  | 'exited'

export interface SkillRun {
  id: string
  skillId: string
  status: SkillRunStatus
  input?: Record<string, any>
  output?: Record<string, any>
  error?: string
  logs: Array<{
    timestamp: string
    level: 'info' | 'warn' | 'error'
    message: string
  }>
  startedAt?: Date
  completedAt?: Date
  durationMs?: number
  createdAt: Date
}

// Form Types
export interface SkillFormData {
  name: string
  description?: string
  agentId: string
  ownerId: string
  
  goal?: string
  instructions: string
  triggers: Trigger[]
  restrictions?: string
  memory?: string
  manualApproval: boolean
  
  status: SkillStatus
}




