import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import type { Contact, ContactFormData, ContactFilters, ContactsResponse } from '@/lib/types/contacts'

interface ContactsState {
  // Data
  contacts: Contact[]
  total: number
  loading: boolean
  error: string | null
  
  // Selection
  selectedContacts: string[]
  
  // Pagination
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
  
  // Search & Filters
  searchQuery: string
  filters: ContactFilters
  sortBy: string
  sortOrder: 'asc' | 'desc'
  
  // Actions
  fetchContacts: () => Promise<void>
  createContact: (data: ContactFormData) => Promise<Contact | null>
  updateContact: (id: string, data: Partial<ContactFormData>) => Promise<boolean>
  deleteContact: (id: string) => Promise<boolean>
  deleteContacts: (ids: string[]) => Promise<boolean>
  
  // Selection Actions
  selectContact: (id: string) => void
  deselectContact: (id: string) => void
  selectAllContacts: () => void
  clearSelection: () => void
  
  // Search & Filter Actions
  setSearchQuery: (query: string) => void
  setFilters: (filters: ContactFilters) => void
  setSorting: (field: string, order: 'asc' | 'desc') => void
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  
  // Utility
  clearError: () => void
  importFromCSV: (file: File) => Promise<{success: number, failed: number}>
}

export const useContactsStore = create<ContactsState>((set, get) => ({
  // Initial State
  contacts: [],
  total: 0,
  loading: false,
  error: null,
  selectedContacts: [],
  pagination: {
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  },
  searchQuery: '',
  filters: {},
  sortBy: 'created_at',
  sortOrder: 'desc',

  // Fetch Contacts
  fetchContacts: async () => {
    set({ loading: true, error: null })
    
    try {
      const supabase = createClient()
      const { page, pageSize } = get().pagination
      const { searchQuery, filters, sortBy, sortOrder } = get()
      
      // Start query
      let query = supabase
        .from('contacts')
        .select(`
          *,
          company:companies(id, name, website, industry, logo_url),
          owner:users!owner_id(id, name, email, avatar_url)
        `, { count: 'exact' })
      
      // Apply search
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`)
      }
      
      // Apply filters
      if (filters.lifecycle_stage && filters.lifecycle_stage.length > 0) {
        query = query.in('lifecycle_stage', filters.lifecycle_stage)
      }
      
      if (filters.country && filters.country.length > 0) {
        query = query.in('country', filters.country)
      }
      
      if (filters.has_email) {
        query = query.not('email', 'is', null)
      }
      
      if (filters.has_phone) {
        query = query.not('phone', 'is', null)
      }
      
      if (filters.owner_id) {
        query = query.eq('owner_id', filters.owner_id)
      }
      
      if (filters.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags)
      }
      
      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })
      
      // Apply pagination
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1
      query = query.range(from, to)
      
      const { data, error, count } = await query
      
      if (error) throw error
      
      const totalPages = count ? Math.ceil(count / pageSize) : 0
      
      set({
        contacts: data || [],
        total: count || 0,
        loading: false,
        pagination: {
          ...get().pagination,
          total: count || 0,
          totalPages,
        },
      })
    } catch (error: any) {
      console.error('Error fetching contacts:', error)
      set({
        error: error.message || 'Error al cargar contactos',
        loading: false,
      })
    }
  },

  // Create Contact
  createContact: async (data: ContactFormData) => {
    set({ loading: true, error: null })
    
    try {
      const supabase = createClient()
      
      // Get current user's organization
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')
      
      const { data: userData } = await supabase
        .from('users')
        .select('organization_id')
        .eq('id', user.id)
        .single()
      
      if (!userData) throw new Error('Usuario no encontrado')
      
      const contactData = {
        ...data,
        organization_id: userData.organization_id,
        owner_id: user.id,
        lifecycle_stage: data.lifecycle_stage || 'lead',
        lead_status: data.lead_status || 'new',
        country: data.country || 'MX',
        lead_score: 0,
        email_opt_in: data.email_opt_in !== false,
        whatsapp_opt_in: data.whatsapp_opt_in !== false,
        source: data.source || 'manual',
      }
      
      const { data: newContact, error } = await supabase
        .from('contacts')
        .insert(contactData)
        .select(`
          *,
          company:companies(id, name, website, industry, logo_url),
          owner:users!owner_id(id, name, email, avatar_url)
        `)
        .single()
      
      if (error) throw error
      
      // Refresh list
      await get().fetchContacts()
      
      set({ loading: false })
      return newContact
    } catch (error: any) {
      console.error('Error creating contact:', error)
      set({
        error: error.message || 'Error al crear contacto',
        loading: false,
      })
      return null
    }
  },

  // Update Contact
  updateContact: async (id: string, data: Partial<ContactFormData>) => {
    set({ loading: true, error: null })
    
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('contacts')
        .update(data)
        .eq('id', id)
      
      if (error) throw error
      
      // Refresh list
      await get().fetchContacts()
      
      set({ loading: false })
      return true
    } catch (error: any) {
      console.error('Error updating contact:', error)
      set({
        error: error.message || 'Error al actualizar contacto',
        loading: false,
      })
      return false
    }
  },

  // Delete Contact
  deleteContact: async (id: string) => {
    set({ loading: true, error: null })
    
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      // Refresh list
      await get().fetchContacts()
      
      set({ loading: false })
      return true
    } catch (error: any) {
      console.error('Error deleting contact:', error)
      set({
        error: error.message || 'Error al eliminar contacto',
        loading: false,
      })
      return false
    }
  },

  // Delete Multiple Contacts
  deleteContacts: async (ids: string[]) => {
    set({ loading: true, error: null })
    
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('contacts')
        .delete()
        .in('id', ids)
      
      if (error) throw error
      
      // Clear selection and refresh
      set({ selectedContacts: [] })
      await get().fetchContacts()
      
      set({ loading: false })
      return true
    } catch (error: any) {
      console.error('Error deleting contacts:', error)
      set({
        error: error.message || 'Error al eliminar contactos',
        loading: false,
      })
      return false
    }
  },

  // Selection Actions
  selectContact: (id: string) => {
    set((state) => ({
      selectedContacts: [...state.selectedContacts, id],
    }))
  },

  deselectContact: (id: string) => {
    set((state) => ({
      selectedContacts: state.selectedContacts.filter((contactId) => contactId !== id),
    }))
  },

  selectAllContacts: () => {
    set((state) => ({
      selectedContacts: state.contacts.map((c) => c.id),
    }))
  },

  clearSelection: () => {
    set({ selectedContacts: [] })
  },

  // Search & Filter Actions
  setSearchQuery: (query: string) => {
    set({ searchQuery: query, pagination: { ...get().pagination, page: 1 } })
    // Debounce and fetch
    setTimeout(() => {
      if (get().searchQuery === query) {
        get().fetchContacts()
      }
    }, 300)
  },

  setFilters: (filters: ContactFilters) => {
    set({ filters, pagination: { ...get().pagination, page: 1 } })
    get().fetchContacts()
  },

  setSorting: (field: string, order: 'asc' | 'desc') => {
    set({ sortBy: field, sortOrder: order })
    get().fetchContacts()
  },

  setPage: (page: number) => {
    set({ pagination: { ...get().pagination, page } })
    get().fetchContacts()
  },

  setPageSize: (pageSize: number) => {
    set({ pagination: { ...get().pagination, pageSize, page: 1 } })
    get().fetchContacts()
  },

  // Utility
  clearError: () => {
    set({ error: null })
  },

  // Import from CSV
  importFromCSV: async (file: File) => {
    set({ loading: true, error: null })
    
    try {
      const supabase = createClient()
      
      // Get current user's organization
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')
      
      const { data: userData } = await supabase
        .from('users')
        .select('organization_id')
        .eq('id', user.id)
        .single()
      
      if (!userData) throw new Error('Usuario no encontrado')
      
      // Parse CSV
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
      
      let success = 0
      let failed = 0
      
      // Process each row
      for (let i = 1; i < lines.length; i++) {
        try {
          const values = lines[i].split(',').map(v => v.trim())
          const row: any = {}
          
          headers.forEach((header, index) => {
            row[header] = values[index] || null
          })
          
          // Map CSV columns to database columns
          const contactData: any = {
            organization_id: userData.organization_id,
            owner_id: user.id,
            name: row.name || row.nombre,
            email: row.email || row.correo,
            phone: row.phone || row.telefono || row.teléfono,
            mobile: row.mobile || row.movil || row.móvil,
            whatsapp: row.whatsapp,
            job_title: row.job_title || row.cargo || row.puesto,
            company_id: null, // TODO: Match by company name
            lifecycle_stage: row.lifecycle_stage || row.etapa || 'lead',
            lead_status: row.lead_status || row.estado || 'new',
            country: row.country || row.pais || row.país || 'MX',
            city: row.city || row.ciudad,
            source: 'import',
            lead_score: 0,
          }
          
          const { error } = await supabase
            .from('contacts')
            .insert(contactData)
          
          if (error) {
            failed++
            console.error(`Error importing row ${i}:`, error)
          } else {
            success++
          }
        } catch (err) {
          failed++
          console.error(`Error processing row ${i}:`, err)
        }
      }
      
      // Refresh list
      await get().fetchContacts()
      
      set({ loading: false })
      return { success, failed }
    } catch (error: any) {
      console.error('Error importing CSV:', error)
      set({
        error: error.message || 'Error al importar CSV',
        loading: false,
      })
      return { success: 0, failed: 0 }
    }
  },
}))

