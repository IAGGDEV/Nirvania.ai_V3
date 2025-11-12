'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Eye, Link as LinkIcon } from 'lucide-react'
import { useAgentsStore } from '@/lib/stores/agents-mock'
import { cn } from '@/lib/utils'
import { SkillOverview } from '@/components/features/agents/skill-overview'
import { SkillCreate } from '@/components/features/agents/skill-create'
import { SkillSettings } from '@/components/features/agents/skill-settings'
import { SkillTestPanel } from '@/components/features/agents/skill-test-panel'

export default function SkillDetailPage() {
  const params = useParams()
  const router = useRouter()
  const skillId = params.id as string
  
  const { getSkill } = useAgentsStore()
  const [skill, setSkill] = useState(getSkill(skillId))
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const foundSkill = getSkill(skillId)
    if (foundSkill) {
      setSkill(foundSkill)
    }
  }, [skillId, getSkill])

  if (!skill) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Skill not found</h2>
          <button
            onClick={() => router.push('/agents')}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Agents
          </button>
        </div>
      </div>
    )
  }

  const statusConfig = {
    active: { label: 'Active', color: 'text-green-600' },
    inactive: { label: 'Inactive', color: 'text-gray-500' },
    paused: { label: 'Paused', color: 'text-orange-600' },
  }[skill.status]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-12 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{skill.name}</h1>
              <p className="mt-1 text-xs text-gray-500">
                Last edited: just now • Created: just now by you
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all" title="Preview">
                <Eye size={18} />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all" title="Copy link">
                <LinkIcon size={18} />
              </button>
              <span className={cn("text-xs font-semibold", statusConfig.color)}>
                {statusConfig.label}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-12">
          <div className="flex gap-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={cn(
                "pb-3 px-1 text-sm font-medium border-b-2 transition-colors",
                activeTab === 'overview'
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={cn(
                "pb-3 px-1 text-sm font-medium border-b-2 transition-colors",
                activeTab === 'create'
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              Create
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={cn(
                "pb-3 px-1 text-sm font-medium border-b-2 transition-colors",
                activeTab === 'settings'
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Content with Test Panel */}
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 px-12 py-8">
          {activeTab === 'overview' && <SkillOverview skill={skill} />}
          {activeTab === 'create' && <SkillCreate skill={skill} onUpdate={setSkill} />}
          {activeTab === 'settings' && <SkillSettings skill={skill} onUpdate={setSkill} />}
        </div>

        {/* Test Panel - Only show on Create tab */}
        {activeTab === 'create' && (
          <div className="w-[400px] border-l border-gray-100 bg-gray-50/30">
            <SkillTestPanel skill={skill} />
          </div>
        )}
      </div>
    </div>
  )
}



