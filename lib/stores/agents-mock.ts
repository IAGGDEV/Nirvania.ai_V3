import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { Agent, Skill, SkillFormData } from '@/lib/types/agents'

// Mock agents data
const MOCK_AGENTS: Agent[] = [
  {
    id: '1',
    organizationId: 'org-1',
    name: 'Account Manager',
    description: 'Drives your pipeline and grows existing accounts',
    icon: '🤝',
    type: 'account_manager',
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    organizationId: 'org-1',
    name: 'Outbound Manager',
    description: 'Proactively finds and engages new prospects',
    icon: '📤',
    type: 'outbound_manager',
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    organizationId: 'org-1',
    name: 'Inbound Manager',
    description: 'Handles inbound inquiries from potential customers',
    icon: '📥',
    type: 'inbound_manager',
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '4',
    organizationId: 'org-1',
    name: 'System Manager',
    description: 'Handles system tasks like imports, data syncing, and more',
    icon: '⚙️',
    type: 'system_manager',
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
]

// Mock skills data
const MOCK_SKILLS: Skill[] = []

interface AgentsStore {
  // State
  agents: Agent[]
  skills: Skill[]
  loading: boolean
  error: string | null

  // Actions - Agents
  fetchAgents: () => Promise<void>
  
  // Actions - Skills
  fetchSkills: () => Promise<void>
  getSkill: (id: string) => Skill | undefined
  createSkill: (data: SkillFormData) => Promise<Skill>
  updateSkill: (id: string, data: Partial<SkillFormData>) => Promise<Skill>
  deleteSkill: (id: string) => Promise<void>
  
  // UI Actions
  clearError: () => void
  reset: () => void
}

const defaultState = {
  agents: [...MOCK_AGENTS],
  skills: [...MOCK_SKILLS],
  loading: false,
  error: null
}

export const useAgentsStore = create<AgentsStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...defaultState,

        // Fetch agents
        fetchAgents: async () => {
          set({ loading: true, error: null })
          
          await new Promise(resolve => setTimeout(resolve, 300))
          
          set({
            agents: MOCK_AGENTS,
            loading: false
          })
        },

        // Fetch skills
        fetchSkills: async () => {
          set({ loading: true, error: null })
          
          await new Promise(resolve => setTimeout(resolve, 300))
          
          set({
            skills: get().skills,
            loading: false
          })
        },

        // Get single skill
        getSkill: (id) => {
          return get().skills.find(s => s.id === id)
        },

        // Create skill
        createSkill: async (data) => {
          set({ loading: true, error: null })
          
          await new Promise(resolve => setTimeout(resolve, 500))
          
          const agent = get().agents.find(a => a.id === data.agentId)
          
          const newSkill: Skill = {
            id: String(Date.now()),
            organizationId: 'org-1',
            ...data,
            totalRuns: 0,
            inProgress: 0,
            succeeded: 0,
            exited: 0,
            errors: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            agent,
            owner: {
              id: data.ownerId,
              name: 'Usuario Demo',
              email: 'demo@nirvania.ai'
            }
          }
          
          set(state => ({
            skills: [...state.skills, newSkill],
            loading: false
          }))
          
          return newSkill
        },

        // Update skill
        updateSkill: async (id, data) => {
          set({ loading: true, error: null })
          
          await new Promise(resolve => setTimeout(resolve, 500))
          
          const updatedSkill = {
            ...get().skills.find(s => s.id === id)!,
            ...data,
            updatedAt: new Date()
          }
          
          set(state => ({
            skills: state.skills.map(s => 
              s.id === id ? updatedSkill as Skill : s
            ),
            loading: false
          }))
          
          return updatedSkill as Skill
        },

        // Delete skill
        deleteSkill: async (id) => {
          set({ loading: true, error: null })
          
          await new Promise(resolve => setTimeout(resolve, 500))
          
          set(state => ({
            skills: state.skills.filter(s => s.id !== id),
            loading: false
          }))
        },

        // UI actions
        clearError: () => set({ error: null }),
        reset: () => set(defaultState)
      }),
      {
        name: 'agents-storage',
        partialize: (state) => ({
          // Only persist necessary data
          skills: state.skills
        })
      }
    )
  )
)
