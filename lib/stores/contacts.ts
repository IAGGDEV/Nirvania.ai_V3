import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { 
  Contact, 
  ContactView, 
  ContactFilter, 
  ContactSort, 
  ContactFormData 
} from '@/lib/types/contacts'
import { createClient } from '@/lib/supabase/client'

interface ContactsStore {
  // State
  contacts: Contact[]
  loading: boolean
  error: string | null
  selectedContacts: string[]
  currentView: ContactView | null
  views: ContactView[]
  filters: ContactFilter[]
  sort: ContactSort[]
  searchQuery: string
  pagination: {
    page: number
    pageSize: number
    total: number
  }

  // Actions - Data
  fetchContacts: (options?: { 
    page?: number
    pageSize?: number 
    filters?: ContactFilter[]
    sort?: ContactSort[]
  }) => Promise<void>
  
  createContact: (data: ContactFormData) => Promise<Contact>
  updateContact: (id: string, data: Partial<ContactFormData>) => Promise<Contact>
  deleteContact: (id: string) => Promise<void>
  deleteMultipleContacts: (ids: string[]) => Promise<void>
  
  // Actions - Selection
  selectContact: (id: string) => void
  deselectContact: (id: string) => void
  selectAllContacts: () => void
  clearSelection: () => void
  
  // Actions - Views
  fetchViews: () => Promise<void>
  createView: (view: Omit<ContactView, 'id' | 'createdBy'>) => Promise<void>
  updateView: (id: string, view: Partial<ContactView>) => Promise<void>
  deleteView: (id: string) => Promise<void>
  setActiveView: (viewId: string | null) => void
  
  // Actions - Filters & Search
  setFilters: (filters: ContactFilter[]) => void
  addFilter: (filter: ContactFilter) => void
  removeFilter: (index: number) => void
  setSort: (sort: ContactSort[]) => void
  setSearchQuery: (query: string) => void
  
  // Actions - Pagination
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  
  // Actions - UI
  clearError: () => void
  reset: () => void
}

const defaultState = {
  contacts: [],
  loading: false,
  error: null,
  selectedContacts: [],
  currentView: null,
  views: [],
  filters: [],
  sort: [{ field: 'createdAt', direction: 'desc' as const }],
  searchQuery: '',
  pagination: {
    page: 1,
    pageSize: 25,
    total: 0
  }
}

export const useContactsStore = create<ContactsStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...defaultState,

        // Fetch contacts with filters and pagination
        fetchContacts: async (options) => {
          set({ loading: true, error: null })
          
          try {
            const supabase = createClient()
            const { 
              page = get().pagination.page, 
              pageSize = get().pagination.pageSize,
              filters = get().filters,
              sort = get().sort
            } = options || {}
            
            // Build query
            let query = supabase
              .from('contacts')
              .select(`
                *,
                company:companies(id, name, website, industry),
                deals(id, name, amount, currency, stage, status)
              `, { count: 'exact' })
            
            // Apply search
            const searchQuery = get().searchQuery
            if (searchQuery) {
              query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,role.ilike.%${searchQuery}%`)
            }
            
            // Apply filters
            filters.forEach(filter => {
              switch (filter.operator) {
                case 'equals':
                  query = query.eq(filter.field, filter.value)
                  break
                case 'contains':
                  query = query.ilike(filter.field, `%${filter.value}%`)
                  break
                case 'startsWith':
                  query = query.ilike(filter.field, `${filter.value}%`)
                  break
                case 'endsWith':
                  query = query.ilike(filter.field, `%${filter.value}`)
                  break
                case 'isEmpty':
                  query = query.is(filter.field, null)
                  break
                case 'isNotEmpty':
                  query = query.not(filter.field, 'is', null)
                  break
              }
            })
            
            // Apply sorting
            sort.forEach(s => {
              query = query.order(s.field, { ascending: s.direction === 'asc' })
            })
            
            // Apply pagination
            const from = (page - 1) * pageSize
            const to = from + pageSize - 1
            query = query.range(from, to)
            
            const { data, error, count } = await query
            
            if (error) throw error
            
            set({
              contacts: data || [],
              pagination: {
                page,
                pageSize,
                total: count || 0
              }
            })
          } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Error al cargar contactos' })
          } finally {
            set({ loading: false })
          }
        },

        // Create contact
        createContact: async (data) => {
          set({ loading: true, error: null })
          
          try {
            const supabase = createClient()
            const { data: contact, error } = await supabase
              .from('contacts')
              .insert(data)
              .select(`
                *,
                company:companies(id, name, website, industry)
              `)
              .single()
            
            if (error) throw error
            
            // Optimistic update
            set(state => ({
              contacts: [contact, ...state.contacts],
              pagination: {
                ...state.pagination,
                total: state.pagination.total + 1
              }
            }))
            
            return contact
          } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Error al crear contacto' })
            throw error
          } finally {
            set({ loading: false })
          }
        },

        // Update contact
        updateContact: async (id, data) => {
          set({ loading: true, error: null })
          
          try {
            const supabase = createClient()
            const { data: contact, error } = await supabase
              .from('contacts')
              .update(data)
              .eq('id', id)
              .select(`
                *,
                company:companies(id, name, website, industry)
              `)
              .single()
            
            if (error) throw error
            
            // Optimistic update
            set(state => ({
              contacts: state.contacts.map(c => 
                c.id === id ? { ...c, ...contact } : c
              )
            }))
            
            return contact
          } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Error al actualizar contacto' })
            throw error
          } finally {
            set({ loading: false })
          }
        },

        // Delete contact
        deleteContact: async (id) => {
          set({ loading: true, error: null })
          
          try {
            const supabase = createClient()
            const { error } = await supabase
              .from('contacts')
              .delete()
              .eq('id', id)
            
            if (error) throw error
            
            // Optimistic update
            set(state => ({
              contacts: state.contacts.filter(c => c.id !== id),
              selectedContacts: state.selectedContacts.filter(sid => sid !== id),
              pagination: {
                ...state.pagination,
                total: state.pagination.total - 1
              }
            }))
          } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Error al eliminar contacto' })
            throw error
          } finally {
            set({ loading: false })
          }
        },

        // Delete multiple contacts
        deleteMultipleContacts: async (ids) => {
          set({ loading: true, error: null })
          
          try {
            const supabase = createClient()
            const { error } = await supabase
              .from('contacts')
              .delete()
              .in('id', ids)
            
            if (error) throw error
            
            // Optimistic update
            set(state => ({
              contacts: state.contacts.filter(c => !ids.includes(c.id)),
              selectedContacts: [],
              pagination: {
                ...state.pagination,
                total: state.pagination.total - ids.length
              }
            }))
          } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Error al eliminar contactos' })
            throw error
          } finally {
            set({ loading: false })
          }
        },

        // Selection actions
        selectContact: (id) => set(state => ({
          selectedContacts: [...state.selectedContacts, id]
        })),

        deselectContact: (id) => set(state => ({
          selectedContacts: state.selectedContacts.filter(sid => sid !== id)
        })),

        selectAllContacts: () => set(state => ({
          selectedContacts: state.contacts.map(c => c.id)
        })),

        clearSelection: () => set({ selectedContacts: [] }),

        // View actions
        fetchViews: async () => {
          try {
            const supabase = createClient()
            const { data, error } = await supabase
              .from('contact_views')
              .select('*')
              .order('name')
            
            if (error) throw error
            
            set({ views: data || [] })
            
            // Set default view if exists
            const defaultView = data?.find(v => v.isDefault)
            if (defaultView) {
              set({ currentView: defaultView })
            }
          } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Error al cargar vistas' })
          }
        },

        createView: async (view) => {
          try {
            const supabase = createClient()
            const { data, error } = await supabase
              .from('contact_views')
              .insert(view)
              .select()
              .single()
            
            if (error) throw error
            
            set(state => ({
              views: [...state.views, data],
              currentView: data
            }))
          } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Error al crear vista' })
            throw error
          }
        },

        updateView: async (id, updates) => {
          try {
            const supabase = createClient()
            const { data, error } = await supabase
              .from('contact_views')
              .update(updates)
              .eq('id', id)
              .select()
              .single()
            
            if (error) throw error
            
            set(state => ({
              views: state.views.map(v => v.id === id ? data : v),
              currentView: state.currentView?.id === id ? data : state.currentView
            }))
          } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Error al actualizar vista' })
            throw error
          }
        },

        deleteView: async (id) => {
          try {
            const supabase = createClient()
            const { error } = await supabase
              .from('contact_views')
              .delete()
              .eq('id', id)
            
            if (error) throw error
            
            set(state => ({
              views: state.views.filter(v => v.id !== id),
              currentView: state.currentView?.id === id ? null : state.currentView
            }))
          } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Error al eliminar vista' })
            throw error
          }
        },

        setActiveView: (viewId) => {
          const view = viewId ? get().views.find(v => v.id === viewId) : null
          set({ currentView: view })
          
          // Apply view settings
          if (view) {
            set({
              filters: view.filters || [],
              sort: view.sort || [{ field: 'createdAt', direction: 'desc' }]
            })
          }
        },

        // Filter & Search actions
        setFilters: (filters) => set({ filters }),
        
        addFilter: (filter) => set(state => ({
          filters: [...state.filters, filter]
        })),
        
        removeFilter: (index) => set(state => ({
          filters: state.filters.filter((_, i) => i !== index)
        })),
        
        setSort: (sort) => set({ sort }),
        
        setSearchQuery: (searchQuery) => set({ searchQuery }),

        // Pagination actions
        setPage: (page) => set(state => ({
          pagination: { ...state.pagination, page }
        })),
        
        setPageSize: (pageSize) => set(state => ({
          pagination: { ...state.pagination, pageSize, page: 1 }
        })),

        // UI actions
        clearError: () => set({ error: null }),
        
        reset: () => set(defaultState)
      }),
      {
        name: 'contacts-storage',
        partialize: (state) => ({
          currentView: state.currentView,
          pageSize: state.pagination.pageSize
        })
      }
    )
  )
)




