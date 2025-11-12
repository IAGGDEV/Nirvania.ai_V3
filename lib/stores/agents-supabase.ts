import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import type { Skill, SkillRun, SkillFormData, ExecutionResult } from '@/lib/types/agents'

interface AgentsState {
  // Data
  skills: Skill[]
  skillRuns: SkillRun[]
  loading: boolean
  error: string | null
  
  // Current Skill
  currentSkill: Skill | null
  currentRuns: SkillRun[]
  
  // Actions
  fetchSkills: () => Promise<void>
  fetchSkill: (id: string) => Promise<void>
  fetchSkillRuns: (skillId: string) => Promise<void>
  createSkill: (data: SkillFormData) => Promise<Skill | null>
  updateSkill: (id: string, data: Partial<SkillFormData>) => Promise<boolean>
  deleteSkill: (id: string) => Promise<boolean>
  executeSkill: (skillId: string, input: string) => Promise<ExecutionResult | null>
  
  // Utility
  clearError: () => void
  setCurrentSkill: (skill: Skill | null) => void
}

export const useAgentsStore = create<AgentsState>((set, get) => ({
  // Initial State
  skills: [],
  skillRuns: [],
  loading: false,
  error: null,
  currentSkill: null,
  currentRuns: [],

  // Fetch Skills
  fetchSkills: async () => {
    set({ loading: true, error: null })
    
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('skills')
        .select(`
          *,
          owner:users!owner_id(id, name, email)
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      set({ skills: data || [], loading: false })
    } catch (error: any) {
      console.error('Error fetching skills:', error)
      set({
        error: error.message || 'Error al cargar skills',
        loading: false,
      })
    }
  },

  // Fetch Single Skill
  fetchSkill: async (id: string) => {
    set({ loading: true, error: null })
    
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('skills')
        .select(`
          *,
          owner:users!owner_id(id, name, email)
        `)
        .eq('id', id)
        .single()
      
      if (error) throw error
      
      set({ currentSkill: data, loading: false })
      
      // Also fetch runs for this skill
      await get().fetchSkillRuns(id)
    } catch (error: any) {
      console.error('Error fetching skill:', error)
      set({
        error: error.message || 'Error al cargar skill',
        loading: false,
      })
    }
  },

  // Fetch Skill Runs
  fetchSkillRuns: async (skillId: string) => {
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('skill_runs')
        .select('*')
        .eq('skill_id', skillId)
        .order('created_at', { ascending: false })
        .limit(50)
      
      if (error) throw error
      
      set({ currentRuns: data || [] })
    } catch (error: any) {
      console.error('Error fetching skill runs:', error)
    }
  },

  // Create Skill
  createSkill: async (data: SkillFormData) => {
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
      
      const skillData = {
        ...data,
        organization_id: userData.organization_id,
        owner_id: user.id,
        status: data.status || 'inactive',
        manual_approval: data.manual_approval || false,
        total_runs: 0,
        succeeded: 0,
        errors: 0,
        exited: 0,
        in_progress: 0,
      }
      
      const { data: newSkill, error } = await supabase
        .from('skills')
        .insert(skillData)
        .select(`
          *,
          owner:users!owner_id(id, name, email)
        `)
        .single()
      
      if (error) throw error
      
      // Refresh list
      await get().fetchSkills()
      
      set({ loading: false })
      return newSkill
    } catch (error: any) {
      console.error('Error creating skill:', error)
      set({
        error: error.message || 'Error al crear skill',
        loading: false,
      })
      return null
    }
  },

  // Update Skill
  updateSkill: async (id: string, data: Partial<SkillFormData>) => {
    set({ loading: true, error: null })
    
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('skills')
        .update(data)
        .eq('id', id)
      
      if (error) throw error
      
      // Refresh current skill if it's the one being updated
      if (get().currentSkill?.id === id) {
        await get().fetchSkill(id)
      }
      
      // Refresh list
      await get().fetchSkills()
      
      set({ loading: false })
      return true
    } catch (error: any) {
      console.error('Error updating skill:', error)
      set({
        error: error.message || 'Error al actualizar skill',
        loading: false,
      })
      return false
    }
  },

  // Delete Skill
  deleteSkill: async (id: string) => {
    set({ loading: true, error: null })
    
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      // Refresh list
      await get().fetchSkills()
      
      set({ loading: false, currentSkill: null })
      return true
    } catch (error: any) {
      console.error('Error deleting skill:', error)
      set({
        error: error.message || 'Error al eliminar skill',
        loading: false,
      })
      return false
    }
  },

  // Execute Skill with Claude AI
  executeSkill: async (skillId: string, input: string) => {
    set({ loading: true, error: null })
    
    try {
      // Call API route to execute with Claude
      const response = await fetch(`/api/skills/${skillId}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al ejecutar skill')
      }
      
      const result: ExecutionResult = await response.json()
      
      // Refresh skill runs
      await get().fetchSkillRuns(skillId)
      
      // Refresh skill to update metrics
      if (get().currentSkill?.id === skillId) {
        await get().fetchSkill(skillId)
      }
      
      set({ loading: false })
      return result
    } catch (error: any) {
      console.error('Error executing skill:', error)
      set({
        error: error.message || 'Error al ejecutar skill',
        loading: false,
      })
      return null
    }
  },

  // Utility
  clearError: () => {
    set({ error: null })
  },

  setCurrentSkill: (skill: Skill | null) => {
    set({ currentSkill: skill })
  },
}))

