'use client'

import { useEffect } from 'react'
import { Plus, Edit2, MoreHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAgentsStore } from '@/lib/stores/agents-mock'
import { cn } from '@/lib/utils'

export default function AgentsPage() {
  const router = useRouter()
  const { agents, skills, loading, fetchAgents, fetchSkills } = useAgentsStore()

  useEffect(() => {
    fetchAgents()
    fetchSkills()
  }, [fetchAgents, fetchSkills])

  const activeSkillsCount = skills.filter(s => s.status === 'active').length

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-12 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Agents</h1>
              <p className="mt-1 text-sm text-gray-500">{activeSkillsCount} Active Skills Total</p>
            </div>
            <button
              onClick={() => router.push('/agents/skills/new')}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus size={18} strokeWidth={2.5} />
              Create New Skill
            </button>
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
          {loading && agents.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="inline-block w-8 h-8 border-3 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {agents.map((agent) => {
                const agentSkills = skills.filter(s => s.agentId === agent.id)
                
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
                        <button
                          onClick={() => router.push(`/agents/skills/new?agent=${agent.id}`)}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Plus size={16} />
                          Add Skill
                        </button>
                      </div>
                    ) : (
                      agentSkills.map((skill, index) => (
                        <div
                          key={skill.id}
                          className={cn(
                            "grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50/50 cursor-pointer transition-colors group",
                            index === agentSkills.length - 1 && "border-b-0"
                          )}
                          onClick={() => router.push(`/agents/skills/${skill.id}`)}
                        >
                          {/* Agent Name (Empty for skills, shown on agent row) */}
                          <div className="col-span-3" />
                          
                          {/* Skill Name */}
                          <div className="col-span-3 flex items-center">
                            <span className="text-sm font-medium text-gray-900">
                              {skill.name}
                            </span>
                          </div>
                          
                          {/* Completed */}
                          <div className="col-span-2 flex items-center justify-center">
                            <span className="text-sm text-gray-700">
                              {skill.succeeded}
                            </span>
                          </div>
                          
                          {/* Running */}
                          <div className="col-span-2 flex items-center justify-center">
                            <span className="text-sm text-gray-700">
                              {skill.inProgress}
                            </span>
                          </div>
                          
                          {/* Status */}
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
                          
                          {/* Actions */}
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
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                              title="More"
                            >
                              <MoreHorizontal size={16} />
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

