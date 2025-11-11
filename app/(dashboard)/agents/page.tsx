'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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

  if (loading && agents.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Agentes</h1>
            <p className="mt-2 text-sm text-gray-500">
              {activeSkillsCount} Skills activos
            </p>
          </div>
          <Button 
            size="lg"
            onClick={() => router.push('/agents/skills/new')}
            className="bg-primary-600 hover:bg-primary-700"
          >
            <Plus className="mr-2 h-5 w-5" />
            Crear Skill
          </Button>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-gray-500">
          <div className="col-span-3">Agentes</div>
          <div className="col-span-3">Skills</div>
          <div className="col-span-2 text-center">Completados</div>
          <div className="col-span-2 text-center">En progreso</div>
          <div className="col-span-1 text-center">Estado</div>
          <div className="col-span-1 text-right">Acciones</div>
        </div>

        {/* Agent Rows */}
        <div className="space-y-6 mt-4">
          {agents.map((agent) => {
            const agentSkills = skills.filter(s => s.agentId === agent.id)
            
            return (
              <div key={agent.id} className="rounded-lg border border-gray-200 bg-white">
                {/* Agent Header */}
                <div className="border-b border-gray-100 p-4">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{agent.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {agent.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {agent.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Skills for this Agent */}
                <div className="divide-y divide-gray-100">
                  {agentSkills.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-sm text-gray-500">
                        No hay skills configurados para este agente
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => router.push(`/agents/skills/new?agent=${agent.id}`)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Crear Skill
                      </Button>
                    </div>
                  ) : (
                    agentSkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="grid grid-cols-12 gap-4 px-4 py-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => router.push(`/agents/skills/${skill.id}`)}
                      >
                        <div className="col-span-3 flex items-center">
                          <span className="text-sm font-medium text-gray-900">
                            {skill.name}
                          </span>
                        </div>
                        <div className="col-span-3 flex items-center">
                          <span className="text-sm text-gray-600">
                            {skill.handle}
                          </span>
                        </div>
                        <div className="col-span-2 flex items-center justify-center">
                          <span className="text-sm text-gray-900">
                            {skill.succeeded}
                          </span>
                        </div>
                        <div className="col-span-2 flex items-center justify-center">
                          <span className="text-sm text-gray-900">
                            {skill.inProgress}
                          </span>
                        </div>
                        <div className="col-span-1 flex items-center justify-center">
                          <span
                            className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              skill.status === 'active' && 'bg-green-100 text-green-700',
                              skill.status === 'inactive' && 'bg-gray-100 text-gray-700',
                              skill.status === 'paused' && 'bg-yellow-100 text-yellow-700'
                            )}
                          >
                            {skill.status === 'active' ? 'Activo' : skill.status === 'paused' ? 'Pausado' : 'Inactivo'}
                          </span>
                        </div>
                        <div className="col-span-1 flex items-center justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button
                                variant="ghost"
                                size="sm"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  router.push(`/agents/skills/${skill.id}`)
                                }}
                              >
                                Editar Skill
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  // TODO: Duplicate skill
                                }}
                              >
                                Duplicar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  // TODO: Delete skill
                                }}
                              >
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-primary-50 rounded-lg p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-primary-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-primary-900 mb-1">¿Cómo funcionan los agentes?</h3>
              <p className="text-sm text-primary-800">
                Los agentes son asistentes IA que automatizan tareas específicas en tu CRM. 
                Cada agente tiene habilidades configurables que puedes personalizar con instrucciones en lenguaje natural. 
                Una vez activados, trabajarán 24/7 siguiendo tus reglas y objetivos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

