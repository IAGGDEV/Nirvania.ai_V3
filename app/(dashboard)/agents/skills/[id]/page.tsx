'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Play, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAgentsStore } from '@/lib/stores/agents-mock'
import { cn } from '@/lib/utils'
import { SkillOverview } from '@/components/features/agents/skill-overview'
import { SkillCreate } from '@/components/features/agents/skill-create'
import { SkillSettings } from '@/components/features/agents/skill-settings'

export default function SkillDetailPage() {
  const params = useParams()
  const router = useRouter()
  const skillId = params.id as string
  
  const { getSkill, loading } = useAgentsStore()
  const [skill, setSkill] = useState(getSkill(skillId))
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const foundSkill = getSkill(skillId)
    if (foundSkill) {
      setSkill(foundSkill)
    }
  }, [skillId, getSkill])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!skill) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Skill no encontrado</h2>
          <Button onClick={() => router.push('/agents')}>
            Volver a Agentes
          </Button>
        </div>
      </div>
    )
  }

  const statusColor = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-700',
    paused: 'bg-yellow-100 text-yellow-700',
  }[skill.status]

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{skill.name}</h1>
              <p className="mt-1 text-sm text-gray-500">
                Última edición: hace poco • Creado: hace poco por ti
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                statusColor
              )}>
                {skill.status === 'active' ? 'Activo' : skill.status === 'paused' ? 'Pausado' : 'Inactivo'}
              </span>
              <Button variant="outline" size="sm">
                <Play className="mr-2 h-4 w-4" />
                Probar Skill
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="create">Crear</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <SkillOverview skill={skill} />
          </TabsContent>

          <TabsContent value="create">
            <SkillCreate skill={skill} onUpdate={setSkill} />
          </TabsContent>

          <TabsContent value="settings">
            <SkillSettings skill={skill} onUpdate={setSkill} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
