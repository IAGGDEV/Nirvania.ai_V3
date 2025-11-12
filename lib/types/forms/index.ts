export type FieldType = 
  | 'text'
  | 'email'
  | 'phone'
  | 'number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'file'

export interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  required: boolean
  options?: string[] // For select, radio, checkbox
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
  mappedTo?: string // CRM field mapping (e.g., 'contact.name', 'contact.email')
}

export interface Form {
  id: string
  organizationId: string
  ownerId: string
  
  title: string
  description?: string
  logoUrl?: string
  
  fields: FormField[]
  
  submitButtonText: string
  successMessage: string
  redirectUrl?: string
  
  primaryColor: string
  backgroundColor: string
  
  autoCreateContact: boolean
  sendNotificationEmail: boolean
  notificationEmail?: string
  
  viewCount: number
  submissionCount: number
  
  status: 'draft' | 'published' | 'paused'
  publishedAt?: Date
  
  createdAt: Date
  updatedAt: Date
  
  owner?: {
    id: string
    name: string
    email: string
  }
}

export interface FormSubmission {
  id: string
  formId: string
  responses: Record<string, any>
  submittedAt: Date
  ipAddress?: string
  userAgent?: string
  referer?: string
  contactId?: string
  contactCreated: boolean
  enriched: boolean
  
  form?: {
    id: string
    title: string
  }
  contact?: {
    id: string
    name: string
    email: string
  }
}




