'use client'

import { useState } from 'react'
import { Skill } from '@/lib/types/agents'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { useAgentsStore } from '@/lib/stores/agents-mock'
import { useRouter } from 'next/navigation'

interface SkillSettingsProps {
  skill: Skill
  onUpdate: (skill: Skill) => void
}

export function SkillSettings({ skill, onUpdate }: SkillSettingsProps) {
  const router = useRouter()
  const { agents, updateSkill, deleteSkill } = useAgentsStore()
  
  const [description, setDescription] = useState(skill.description || '')
  const [handle, setHandle] = useState(skill.handle.replace('@', ''))
  const [selectedAgent, setSelectedAgent] = useState(skill.agentId)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const updated = await updateSkill(skill.id, {
        description,
        handle: `@${handle}`,
        agentId: selectedAgent,
      })
      onUpdate(updated)
      console.log('✅ Configuración guardada')
    } catch (error) {
      console.error('Error al guardar:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    const confirmed = confirm(
      '¿Estás seguro de que quieres eliminar este skill? Esta acción no se puede deshacer.'
    )
    
    if (!confirmed) return
    
    setIsDeleting(true)
    try {
      await deleteSkill(skill.id)
      console.log('✅ Skill eliminado')
      router.push('/agents')
    } catch (error) {
      console.error('Error al eliminar:', error)
      setIsDeleting(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      {/* Skill Description */}
      <div>
        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
          Descripción del Skill
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe brevemente qué hace este skill..."
          className="mt-2"
          rows={3}
        />
        <p className="mt-1 text-xs text-gray-500">
          Esta descripción ayuda a otros usuarios a entender el propósito del skill
        </p>
      </div>

      {/* Handle */}
      <div>
        <Label htmlFor="handle" className="text-sm font-medium text-gray-700">
          Handle
        </Label>
        <div className="relative mt-2">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-500 font-medium">
            @
          </span>
          <Input
            id="handle"
            value={handle}
            onChange={(e) => setHandle(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
            placeholder="miSkillHandle"
            className="pl-8"
            maxLength={50}
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          El handle es un identificador único para este skill (solo letras, números y guiones bajos)
        </p>
      </div>

      {/* Owner */}
      <div>
        <Label htmlFor="owner" className="text-sm font-medium text-gray-700">
          Propietario
        </Label>
        <div className="mt-2 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-sm font-medium text-primary-600">
                {skill.owner?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {skill.owner?.name || 'Usuario Demo'}
              </p>
              <p className="text-xs text-gray-500">
                {skill.owner?.email || 'demo@nirvania.ai'}
              </p>
            </div>
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          El propietario tiene control total sobre este skill
        </p>
      </div>

      {/* Worker */}
      <div>
        <Label htmlFor="worker" className="text-sm font-medium text-gray-700">
          Agente Asignado
        </Label>
        <select
          id="worker"
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

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Guardando...' : 'Guardar Configuración'}
        </Button>
      </div>

      {/* Danger Zone */}
      <Card className="border-red-200 bg-red-50">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Zona Peligrosa</h3>
          <p className="text-sm text-red-700 mb-4">
            Una vez que elimines un skill, no hay vuelta atrás. Por favor, ten certeza.
          </p>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeleting ? 'Eliminando...' : 'Eliminar Skill'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
