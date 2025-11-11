'use client'

import { useState } from 'react'
import { Skill } from '@/lib/types/agents'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown, Plus } from 'lucide-react'
import { useAgentsStore } from '@/lib/stores/agents-mock'
import { SkillTestPanel } from './skill-test-panel'

interface SkillCreateProps {
  skill: Skill
  onUpdate: (skill: Skill) => void
}

export function SkillCreate({ skill, onUpdate }: SkillCreateProps) {
  const { updateSkill } = useAgentsStore()
  const [goal, setGoal] = useState(skill.goal || '')
  const [instructions, setInstructions] = useState(skill.instructions || '')
  const [restrictions, setRestrictions] = useState(skill.restrictions || '')
  const [memory, setMemory] = useState(skill.memory || '')
  const [manualApproval, setManualApproval] = useState(skill.manualApproval)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const updated = await updateSkill(skill.id, {
        goal,
        instructions,
        restrictions,
        memory,
        manualApproval,
      })
      onUpdate(updated)
      console.log('✅ Cambios guardados correctamente')
    } catch (error) {
      console.error('Error al guardar:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Test Skill Panel */}
      <SkillTestPanel skill={skill} />

      {/* Goal */}
      <Collapsible defaultOpen>
        <Card>
          <CollapsibleTrigger className="flex w-full items-center justify-between p-6 hover:bg-gray-50 transition-colors">
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900">Objetivo</h3>
              <p className="mt-1 text-sm text-gray-500">
                Define un objetivo general para el skill. Esto guiará la ejecución hacia un resultado específico.
              </p>
            </div>
            <ChevronDown className="h-5 w-5 text-gray-400 transition-transform" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="border-t border-gray-200 p-6">
              <Textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Ej: Hacer seguimiento a todos los leads que no han respondido en 3 días..."
                rows={3}
              />
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Triggers */}
      <Collapsible defaultOpen>
        <Card>
          <CollapsibleTrigger className="flex w-full items-center justify-between p-6 hover:bg-gray-50 transition-colors">
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900">Disparadores</h3>
              <p className="mt-1 text-sm text-gray-500">
                Define cuándo debe ejecutarse este skill automáticamente.
              </p>
            </div>
            <ChevronDown className="h-5 w-5 text-gray-400 transition-transform" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="border-t border-gray-200 p-6">
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-sm text-gray-500 mb-4">No hay disparadores configurados</p>
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Disparador
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Instructions */}
      <Collapsible defaultOpen>
        <Card>
          <CollapsibleTrigger className="flex w-full items-center justify-between p-6 hover:bg-gray-50 transition-colors">
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900">Instrucciones</h3>
              <p className="mt-1 text-sm text-gray-500">
                Escribe instrucciones detalladas paso a paso. Incluye qué hacer, cuándo hacerlo, 
                y cómo manejar diferentes escenarios. Mientras más específico, mejores resultados.
              </p>
            </div>
            <ChevronDown className="h-5 w-5 text-gray-400 transition-transform" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="border-t border-gray-200 p-6">
              <Textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="1. Revisa todos los contactos en la base de datos...&#10;2. Filtra aquellos que no han respondido en 3 días...&#10;3. Envía un email de seguimiento personalizado..."
                rows={10}
                className="font-mono text-sm"
              />
              <p className="mt-2 text-xs text-gray-500">
                💡 Para agregar acciones, escribe / y selecciona una acción de la lista
              </p>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Restrictions */}
      <Collapsible>
        <Card>
          <CollapsibleTrigger className="flex w-full items-center justify-between p-6 hover:bg-gray-50 transition-colors">
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900">
                Restricciones <span className="text-sm font-normal text-gray-500">opcional</span>
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Define qué nunca debe hacerse o evitarse.
              </p>
            </div>
            <ChevronDown className="h-5 w-5 text-gray-400 transition-transform" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="border-t border-gray-200 p-6">
              <Textarea
                value={restrictions}
                onChange={(e) => setRestrictions(e.target.value)}
                placeholder="Ej: Nunca enviar emails los fines de semana, nunca modificar deals cerrados..."
                rows={4}
              />
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Memory */}
      <Collapsible>
        <Card>
          <CollapsibleTrigger className="flex w-full items-center justify-between p-6 hover:bg-gray-50 transition-colors">
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900">
                Memoria <span className="text-sm font-normal text-gray-500">opcional</span>
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Agrega detalles importantes que el skill debe recordar durante la ejecución.
              </p>
            </div>
            <ChevronDown className="h-5 w-5 text-gray-400 transition-transform" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="border-t border-gray-200 p-6">
              <Textarea
                value={memory}
                onChange={(e) => setMemory(e.target.value)}
                placeholder="Ej: El horario de atención es de 9am a 6pm...Nuestro producto principal es..."
                rows={4}
              />
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Manual Approval */}
      <Collapsible>
        <Card>
          <CollapsibleTrigger className="flex w-full items-center justify-between p-6 hover:bg-gray-50 transition-colors">
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900">
                Aprobación Manual <span className="text-sm font-normal text-gray-500">opcional</span>
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Revisa y aprueba acciones antes de que se ejecuten.
              </p>
            </div>
            <ChevronDown className="h-5 w-5 text-gray-400 transition-transform" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="border-t border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">Requiere aprobación manual</span>
                  <p className="text-xs text-gray-500 mt-1">
                    Recibirás una notificación antes de cada acción
                  </p>
                </div>
                <Switch
                  checked={manualApproval}
                  onCheckedChange={setManualApproval}
                />
              </div>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button 
          variant="outline" 
          onClick={() => {
            setGoal(skill.goal || '')
            setInstructions(skill.instructions || '')
            setRestrictions(skill.restrictions || '')
            setMemory(skill.memory || '')
            setManualApproval(skill.manualApproval)
          }}
        >
          Descartar cambios
        </Button>
        <Button onClick={handleSave} size="lg" disabled={isSaving}>
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        ✅ Los cambios se guardan automáticamente
      </p>
    </div>
  )
}
