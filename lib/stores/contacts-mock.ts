import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { 
  Contact, 
  ContactView, 
  ContactFilter, 
  ContactSort, 
  ContactFormData 
} from '@/lib/types/contacts'

// Mock data para demostración
const MOCK_CONTACTS: Contact[] = [
  {
    id: '1',
    organizationId: 'org-1',
    name: 'María García',
    email: 'maria.garcia@empresa.mx',
    phone: '+52 55 1234 5678',
    role: 'Directora de Marketing',
    location: 'Ciudad de México',
    country: 'MX',
    whatsapp: '+52 55 1234 5678',
    preferredLanguage: 'es',
    enriched: true,
    source: 'manual',
    company: {
      id: 'comp-1',
      name: 'Tech Solutions México',
      website: 'https://techsolutions.mx',
      industry: 'Tecnología'
    },
    deals: [
      {
        id: 'deal-1',
        name: 'Implementación CRM',
        amount: 50000,
        currency: 'MXN',
        stage: 'Propuesta',
        status: 'open'
      }
    ],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    organizationId: 'org-1',
    name: 'Carlos Rodríguez',
    email: 'carlos@startupbr.com',
    phone: '+55 11 98765 4321',
    role: 'CEO',
    location: 'São Paulo',
    country: 'BR',
    preferredLanguage: 'pt',
    enriched: false,
    source: 'form',
    company: {
      id: 'comp-2',
      name: 'Startup Brasil',
      website: 'https://startupbr.com',
      industry: 'E-commerce'
    },
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: '3',
    organizationId: 'org-1',
    name: 'Ana Martínez',
    email: 'ana.martinez@fintech.co',
    phone: '+57 300 123 4567',
    role: 'CFO',
    location: 'Bogotá',
    country: 'CO',
    linkedin: 'https://linkedin.com/in/anamartinez',
    preferredLanguage: 'es',
    enriched: true,
    source: 'import',
    company: {
      id: 'comp-3',
      name: 'FinTech Colombia',
      website: 'https://fintech.co',
      industry: 'Finanzas'
    },
    deals: [
      {
        id: 'deal-2',
        name: 'Consultoría Financiera',
        amount: 75000,
        currency: 'USD',
        stage: 'Negociación',
        status: 'open'
      },
      {
        id: 'deal-3',
        name: 'Implementación Software',
        amount: 120000,
        currency: 'USD',
        stage: 'Cerrado',
        status: 'won',
        closedAt: new Date('2024-01-20')
      }
    ],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-02-15')
  }
]

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

  // Actions
  fetchContacts: (options?: any) => Promise<void>
  createContact: (data: ContactFormData) => Promise<Contact>
  updateContact: (id: string, data: Partial<ContactFormData>) => Promise<Contact>
  deleteContact: (id: string) => Promise<void>
  deleteMultipleContacts: (ids: string[]) => Promise<void>
  
  selectContact: (id: string) => void
  deselectContact: (id: string) => void
  selectAllContacts: () => void
  clearSelection: () => void
  
  fetchViews: () => Promise<void>
  createView: (view: Omit<ContactView, 'id' | 'createdBy'>) => Promise<void>
  updateView: (id: string, view: Partial<ContactView>) => Promise<void>
  deleteView: (id: string) => Promise<void>
  setActiveView: (viewId: string | null) => void
  
  setFilters: (filters: ContactFilter[]) => void
  addFilter: (filter: ContactFilter) => void
  removeFilter: (index: number) => void
  setSort: (sort: ContactSort[]) => void
  setSearchQuery: (query: string) => void
  
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  
  clearError: () => void
  reset: () => void
}

const defaultState = {
  contacts: [...MOCK_CONTACTS],
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
    total: MOCK_CONTACTS.length
  }
}

export const useContactsStore = create<ContactsStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...defaultState,

        fetchContacts: async () => {
          set({ loading: true, error: null })
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500))
          
          const { searchQuery, pagination } = get()
          let filteredContacts = [...MOCK_CONTACTS]
          
          // Apply search
          if (searchQuery) {
            filteredContacts = filteredContacts.filter(contact =>
              contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
              contact.role?.toLowerCase().includes(searchQuery.toLowerCase())
            )
          }
          
          set({
            contacts: filteredContacts,
            pagination: {
              ...pagination,
              total: filteredContacts.length
            },
            loading: false
          })
        },

        createContact: async (data) => {
          set({ loading: true, error: null })
          
          await new Promise(resolve => setTimeout(resolve, 500))
          
          const newContact: Contact = {
            id: String(Date.now()),
            organizationId: 'org-1',
            ...data,
            enriched: false,
            source: 'manual',
            createdAt: new Date(),
            updatedAt: new Date()
          }
          
          set(state => ({
            contacts: [newContact, ...state.contacts],
            pagination: {
              ...state.pagination,
              total: state.pagination.total + 1
            },
            loading: false
          }))
          
          return newContact
        },

        updateContact: async (id, data) => {
          set({ loading: true, error: null })
          
          await new Promise(resolve => setTimeout(resolve, 500))
          
          const updatedContact = {
            ...get().contacts.find(c => c.id === id)!,
            ...data,
            updatedAt: new Date()
          }
          
          set(state => ({
            contacts: state.contacts.map(c => 
              c.id === id ? updatedContact : c
            ),
            loading: false
          }))
          
          return updatedContact as Contact
        },

        deleteContact: async (id) => {
          set({ loading: true, error: null })
          
          await new Promise(resolve => setTimeout(resolve, 500))
          
          set(state => ({
            contacts: state.contacts.filter(c => c.id !== id),
            selectedContacts: state.selectedContacts.filter(sid => sid !== id),
            pagination: {
              ...state.pagination,
              total: state.pagination.total - 1
            },
            loading: false
          }))
        },

        deleteMultipleContacts: async (ids) => {
          set({ loading: true, error: null })
          
          await new Promise(resolve => setTimeout(resolve, 500))
          
          set(state => ({
            contacts: state.contacts.filter(c => !ids.includes(c.id)),
            selectedContacts: [],
            pagination: {
              ...state.pagination,
              total: state.pagination.total - ids.length
            },
            loading: false
          }))
        },

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

        fetchViews: async () => {
          await new Promise(resolve => setTimeout(resolve, 300))
          set({ views: [] })
        },

        createView: async (view) => {
          const newView = {
            ...view,
            id: String(Date.now()),
            createdBy: 'user-1'
          }
          set(state => ({
            views: [...state.views, newView],
            currentView: newView
          }))
        },

        updateView: async (id, updates) => {
          set(state => ({
            views: state.views.map(v => v.id === id ? { ...v, ...updates } : v),
            currentView: state.currentView?.id === id ? { ...state.currentView, ...updates } : state.currentView
          }))
        },

        deleteView: async (id) => {
          set(state => ({
            views: state.views.filter(v => v.id !== id),
            currentView: state.currentView?.id === id ? null : state.currentView
          }))
        },

        setActiveView: (viewId) => {
          const view = viewId ? get().views.find(v => v.id === viewId) : null
          set({ currentView: view })
        },

        setFilters: (filters) => set({ filters }),
        addFilter: (filter) => set(state => ({ filters: [...state.filters, filter] })),
        removeFilter: (index) => set(state => ({ filters: state.filters.filter((_, i) => i !== index) })),
        setSort: (sort) => set({ sort }),
        setSearchQuery: (searchQuery) => set({ searchQuery }),
        setPage: (page) => set(state => ({ pagination: { ...state.pagination, page } })),
        setPageSize: (pageSize) => set(state => ({ pagination: { ...state.pagination, pageSize, page: 1 } })),
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
