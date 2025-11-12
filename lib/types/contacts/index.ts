export interface Contact {
  id: string
  organizationId: string
  companyId?: string
  
  // Basic info
  name: string
  email: string
  phone?: string
  role?: string
  linkedin?: string
  
  // Location
  location?: string
  country?: 'MX' | 'BR' | 'CO' | 'AR' | 'CL' | 'PE' | 'VE' | 'EC' | 'BO' | 'PY' | 'UY' | 'CR' | 'PA' | 'GT' | 'HN' | 'SV' | 'NI'
  
  // LATAM specific
  whatsapp?: string
  preferredLanguage?: 'es' | 'pt' | 'en'
  
  // Enrichment
  enriched: boolean
  enrichmentData?: Record<string, any>
  
  // Source tracking
  source?: 'form' | 'manual' | 'import' | 'api'
  formSubmissionId?: string
  
  // Relations
  company?: Company
  deals?: Deal[]
  
  // Metadata
  createdAt: Date
  updatedAt: Date
}

export interface Company {
  id: string
  name: string
  website?: string
  industry?: string
  logo?: string
}

export interface Deal {
  id: string
  name: string
  amount: number
  currency: string
  stage: string
  status: 'open' | 'won' | 'lost'
  closedAt?: Date
}

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  role?: string
  companyId?: string
  location?: string
  country?: string
  linkedin?: string
  whatsapp?: string
  preferredLanguage?: 'es' | 'pt' | 'en'
}

export interface ContactColumn {
  // Direct fields
  id: 'name' | 'email' | 'phone' | 'role' | 'location' | 'linkedin' | 'createdAt' | 'updatedAt'
  label: string
  accessor: string
  visible: boolean
  sortable: boolean
  width?: number
}

export interface ContactView {
  id: string
  name: string
  type: 'table' | 'kanban'
  columns: ContactColumn[]
  filters?: ContactFilter[]
  sort?: ContactSort[]
  shared: boolean
  createdBy: string
  isDefault?: boolean
}

export interface ContactFilter {
  field: string
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'isEmpty' | 'isNotEmpty'
  value?: string
}

export interface ContactSort {
  field: string
  direction: 'asc' | 'desc'
}

export interface ContactsState {
  contacts: Contact[]
  loading: boolean
  selectedContacts: string[]
  currentView: ContactView | null
  views: ContactView[]
  filters: ContactFilter[]
  sort: ContactSort[]
  pagination: {
    page: number
    pageSize: number
    total: number
  }
}

// LATAM Phone patterns
export const PHONE_PATTERNS = {
  MX: /^\+52\d{10}$/,     // +52 1234567890
  BR: /^\+55\d{11}$/,     // +55 11987654321
  CO: /^\+57\d{10}$/,     // +57 3001234567
  AR: /^\+54\d{10,11}$/,  // +54 1123456789
  CL: /^\+56\d{9}$/,      // +56 912345678
  PE: /^\+51\d{9}$/,      // +51 987654321
  VE: /^\+58\d{10}$/,     // +58 4121234567
  EC: /^\+593\d{9}$/,     // +593 987654321
  BO: /^\+591\d{8}$/,     // +591 76543210
  PY: /^\+595\d{9}$/,     // +595 971234567
  UY: /^\+598\d{8}$/,     // +598 98765432
  CR: /^\+506\d{8}$/,     // +506 87654321
  PA: /^\+507\d{8}$/,     // +507 67890123
  GT: /^\+502\d{8}$/,     // +502 56789012
  HN: /^\+504\d{8}$/,     // +504 98765432
  SV: /^\+503\d{8}$/,     // +503 76543210
  NI: /^\+505\d{8}$/      // +505 87654321
} as const




