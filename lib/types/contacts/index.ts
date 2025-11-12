// Contact types based on Supabase schema
export interface Contact {
  id: string
  organization_id: string
  owner_id: string | null
  company_id: string | null
  
  // Basic Info
  name: string
  email: string | null
  phone: string | null
  mobile: string | null
  whatsapp: string | null
  
  // Professional Info
  job_title: string | null
  department: string | null
  seniority: string | null
  
  // Social Media
  linkedin_url: string | null
  twitter_url: string | null
  
  // Address (LATAM fields)
  street: string | null
  city: string | null
  state: string | null
  postal_code: string | null
  country: string
  
  // Tax IDs (LATAM specific)
  rfc: string | null
  cnpj: string | null
  
  // Engagement
  lifecycle_stage: 'lead' | 'mql' | 'sql' | 'opportunity' | 'customer'
  lead_score: number
  lead_status: string
  
  // Metadata
  source: string | null
  tags: string[] | null
  
  // Communication Preferences
  email_opt_in: boolean
  whatsapp_opt_in: boolean
  
  // Timestamps
  last_contacted_at: string | null
  last_activity_at: string | null
  created_at: string
  updated_at: string
  
  // Relations (populated via joins)
  company?: Company
  owner?: User
  deals?: Deal[]
}

export interface Company {
  id: string
  name: string
  website: string | null
  industry: string | null
  logo_url: string | null
}

export interface User {
  id: string
  name: string
  email: string
  avatar_url: string | null
}

export interface Deal {
  id: string
  name: string
  amount: number
  currency: string
  status: 'open' | 'won' | 'lost'
}

export interface ContactFormData {
  name: string
  email?: string
  phone?: string
  mobile?: string
  whatsapp?: string
  job_title?: string
  department?: string
  seniority?: string
  company_id?: string
  lifecycle_stage?: Contact['lifecycle_stage']
  lead_status?: string
  country?: string
  city?: string
  state?: string
  street?: string
  postal_code?: string
  linkedin_url?: string
  twitter_url?: string
  tags?: string[]
  source?: string
  email_opt_in?: boolean
  whatsapp_opt_in?: boolean
}

export interface ContactFilters {
  lifecycle_stage?: Contact['lifecycle_stage'][]
  country?: string[]
  tags?: string[]
  has_email?: boolean
  has_phone?: boolean
  owner_id?: string
  lead_status?: string[]
  source?: string[]
}

export interface ContactsResponse {
  contacts: Contact[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
