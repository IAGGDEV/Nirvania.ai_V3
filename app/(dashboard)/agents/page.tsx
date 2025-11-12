'use client'

import { useEffect } from 'react'
import { Plus, Edit2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAgentsStore } from '@/lib/stores/agents-supabase'
import { PREDEFINED_AGENTS } from '@/lib/types/agents'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default function AgentsPage() {
  const router = useRouter()
  const { skills, loading, fetchSkills } = useAgentsStore()

  useEffect(() => {
    fetchSkills()
  }, [fetchSkills])

  // Group skills by agent category
  const skillsByAgent = PREDEFINED_AGENTS.map(agent => ({
    ...agent,
    skills: skills.filter(skill => 
      // Match by name pattern or just show all for now
      true
    ),
  }))

  const totalActiveSkills = skills.filter(s => s.status === 'active').length

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-12 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Agents</h1>
              <p className="mt-1 text-sm text-gray-500">{totalActiveSkills} Active Skills Total</p>
            </div>
            <Button
              onClick={() => router.push('/agents/skills/new')}
              className="bg-gray-900 hover:bg-gray-800"
            >
              <Plus size={18} strokeWidth={2.5} className="mr-2" />
              Create New Skill
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="px-12 py-8">
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <div className="col-span-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Agents
            </div>
            <div className="col-span-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Skills
            </div>
            <div className="col-span-2 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
              Completed
            </div>
            <div className="col-span-2 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
              Running
            </div>
            <div className="col-span-1 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
              Status
            </div>
            <div className="col-span-1 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">
              Actions
            </div>
          </div>

          {/* Table Body */}
          {loading && skills.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="inline-block w-8 h-8 border-3 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {skillsByAgent.map((agent) => {
                const agentSkills = agent.skills
                
                return (
                  <div key={agent.id}>
                    {/* Agent Row */}
                    <div className="px-6 py-5 bg-gray-50/30">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{agent.icon}</div>
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">
                            {agent.name}
                          </h3>
                          <p className="mt-0.5 text-sm text-gray-500">
                            {agent.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Skills Rows */}
                    {agentSkills.length === 0 ? (
                      <div className="px-6 py-12 text-center">
                        <p className="text-sm text-gray-500 mb-4">
                          No skills yet
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => router.push(`/agents/skills/new?agent=${agent.id}`)}
                        >
                          <Plus size={16} className="mr-2" />
                          Add Skill
                        </Button>
                      </div>
                    ) : (
                      agentSkills.map((skill) => (
                        <div
                          key={skill.id}
                          className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50/50 cursor-pointer transition-colors group"
                          onClick={() => router.push(`/agents/skills/${skill.id}`)}
                        >
                          <div className="col-span-3" />
                          
                          <div className="col-span-3 flex items-center">
                            <span className="text-sm font-medium text-gray-900">
                              {skill.name}
                            </span>
                          </div>
                          
                          <div className="col-span-2 flex items-center justify-center">
                            <span className="text-sm text-gray-700">
                              {skill.succeeded}
                            </span>
                          </div>
                          
                          <div className="col-span-2 flex items-center justify-center">
                            <span className="text-sm text-gray-700">
                              {skill.in_progress}
                            </span>
                          </div>
                          
                          <div className="col-span-1 flex items-center justify-center">
                            <span
                              className={cn(
                                "text-xs font-medium",
                                skill.status === 'active' && 'text-green-700',
                                skill.status === 'inactive' && 'text-gray-500',
                                skill.status === 'paused' && 'text-orange-600'
                              )}
                            >
                              {skill.status}
                            </span>
                          </div>
                          
                          <div className="col-span-1 flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                router.push(`/agents/skills/${skill.id}`)
                              }}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
