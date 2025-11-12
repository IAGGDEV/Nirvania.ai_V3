'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { useAgentsStore } from '@/lib/stores/agents-mock'

export default function NewSkillPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedAgent = searchParams.get('agent')
  
  const { agents, createSkill } = useAgentsStore()
  
  const [name, setName] = useState('')
  const [handle, setHandle] = useState('')
  const [selectedAgent, setSelectedAgent] = useState(preselectedAgent || agents[0]?.id || '')
  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = async () => {
    if (!name.trim() || !handle.trim()) {
      alert('Por favor completa el nombre y el handle')
      return
    }

    setIsCreating(true)
    try {
      const newSkill = await createSkill({
        name: name.trim(),
        description: '',
        agentId: selectedAgent,
        ownerId: 'user-1', // TODO: Get from auth
        handle: `@${handle.trim()}`,
        goal: '',
        instructions: '',
        triggers: [],
        restrictions: '',
        memory: '',
        manualApproval: false,
        status: 'inactive'
      })
      
      console.log('✅ Skill creado:', newSkill)
      router.push(`/agents/skills/${newSkill.id}`)
    } catch (error) {
      console.error('Error al crear skill:', error)
      alert('Error al crear el skill')
    } finally {
      setIsCreating(false)
    }
  }

  // Generate handle suggestion from name
  const handleNameChange = (value: string) => {
    setName(value)
    if (!handle || handle === name.toLowerCase().replace(/\s+/g, '')) {
      setHandle(value.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9_]/g, ''))
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>

          <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Skill</h1>
          <p className="mt-2 text-gray-600">
            Define un nuevo skill para automatizar tareas en tu CRM
          </p>
        </div>

        {/* Form */}
        <Card className="p-8">
          <div className="space-y-6">
            {/* Name */}
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Nombre del Skill <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ej: Seguimiento a Leads Inactivos"
                className="mt-2"
                maxLength={100}
              />
              <p className="mt-1 text-xs text-gray-500">
                Un nombre descriptivo que explique qué hace el skill
              </p>
            </div>

            {/* Handle */}
            <div>
              <Label htmlFor="handle" className="text-sm font-medium">
                Handle <span className="text-red-500">*</span>
              </Label>
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-500 font-medium">
                  @
                </span>
                <Input
                  id="handle"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value.replace(/[^a-z0-9_]/g, ''))}
                  placeholder="seguimientoLeads"
                  className="pl-8"
                  maxLength={50}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Identificador único (solo letras minúsculas, números y guiones bajos)
              </p>
            </div>

            {/* Agent Selection */}
            <div>
              <Label htmlFor="agent" className="text-sm font-medium">
                Agente Asignado <span className="text-red-500">*</span>
              </Label>
              <select
                id="agent"
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.icon} {agent.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Selecciona qué agente ejecutará este skill
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">
                    Próximos pasos
                  </h4>
                  <p className="text-sm text-blue-800">
                    Después de crear el skill, podrás configurar sus instrucciones, 
                    objetivos, disparadores y restricciones en la página de detalle.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
                disabled={isCreating}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreate}
                disabled={isCreating || !name.trim() || !handle.trim()}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  'Crear Skill'
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}




