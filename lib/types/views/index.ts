// View types for customizable table views

export interface ContactView {
  id: string
  organization_id: string
  user_id: string
  
  // View Info
  name: string
  type: 'table' | 'kanban'
  icon: string | null
  
  // Configuration
  visible_columns: string[]
  sort_by: string
  sort_order: 'asc' | 'desc'
  
  // Filters
  filters: Record<string, any> | null
  
  // Sharing
  is_shared: boolean
  is_default: boolean
  
  // Position
  display_order: number
  
  created_at: string
  updated_at: string
}

export interface ViewColumn {
  id: string
  label: string
  icon?: string
  visible: boolean
  sortable: boolean
  category?: 'basic' | 'professional' | 'location' | 'system'
}

export const AVAILABLE_COLUMNS: ViewColumn[] = [
  // Basic
  { id: 'name', label: 'Name', icon: '👤', visible: true, sortable: true, category: 'basic' },
  { id: 'email', label: 'Email', icon: '📧', visible: true, sortable: true, category: 'basic' },
  { id: 'phone', label: 'Phone', icon: '📱', visible: true, sortable: false, category: 'basic' },
  { id: 'mobile', label: 'Mobile', icon: '📱', visible: false, sortable: false, category: 'basic' },
  { id: 'whatsapp', label: 'WhatsApp', icon: '💬', visible: false, sortable: false, category: 'basic' },
  
  // Professional
  { id: 'job_title', label: 'Role', icon: '💼', visible: false, sortable: true, category: 'professional' },
  { id: 'department', label: 'Department', icon: '🏢', visible: false, sortable: true, category: 'professional' },
  { id: 'seniority', label: 'Seniority', icon: '⭐', visible: false, sortable: true, category: 'professional' },
  { id: 'linkedin_url', label: 'LinkedIn', icon: '🔗', visible: false, sortable: false, category: 'professional' },
  
  // Location
  { id: 'city', label: 'City', icon: '🏙️', visible: false, sortable: true, category: 'location' },
  { id: 'state', label: 'State', icon: '📍', visible: false, sortable: true, category: 'location' },
  { id: 'country', label: 'Country', icon: '🌎', visible: true, sortable: true, category: 'location' },
  { id: 'location', label: 'Location', icon: '📍', visible: true, sortable: false, category: 'location' },
  
  // Company
  { id: 'company', label: 'Company', icon: '🏢', visible: true, sortable: true, category: 'basic' },
  { id: 'industry', label: 'Industry', icon: '🏭', visible: true, sortable: true, category: 'basic' },
  
  // Engagement
  { id: 'lifecycle_stage', label: 'Lifecycle Stage', icon: '🎯', visible: true, sortable: true, category: 'system' },
  { id: 'lead_status', label: 'Lead Status', icon: '📊', visible: false, sortable: true, category: 'system' },
  { id: 'lead_score', label: 'Lead Score', icon: '⭐', visible: false, sortable: true, category: 'system' },
  { id: 'source', label: 'Source', icon: '🔍', visible: false, sortable: true, category: 'system' },
  { id: 'tags', label: 'Tags', icon: '🏷️', visible: false, sortable: false, category: 'system' },
  
  // Deals
  { id: 'deals', label: 'Deals (Primary Contact)', icon: '💰', visible: true, sortable: false, category: 'basic' },
  
  // Timestamps
  { id: 'created_at', label: 'Created', icon: '📅', visible: true, sortable: true, category: 'system' },
  { id: 'updated_at', label: 'Updated', icon: '🔄', visible: false, sortable: true, category: 'system' },
  { id: 'last_contacted_at', label: 'Last Contacted', icon: '📞', visible: false, sortable: true, category: 'system' },
  { id: 'last_activity_at', label: 'Last Activity', icon: '⚡', visible: false, sortable: true, category: 'system' },
]

export const SORT_OPTIONS = [
  { value: 'created_at', label: 'Created At' },
  { value: 'updated_at', label: 'Updated At' },
  { value: 'name', label: 'Name' },
  { value: 'email', label: 'Email' },
  { value: 'lifecycle_stage', label: 'Lifecycle Stage' },
  { value: 'lead_score', label: 'Lead Score' },
  { value: 'last_contacted_at', label: 'Last Contacted' },
  { value: 'last_activity_at', label: 'Last Activity' },
]

