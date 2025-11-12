'use client'

import { useState, useEffect } from 'react'
import { Skill } from '@/lib/types/agents'
import { Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { useAgentsStore } from '@/lib/stores/agents-mock'

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
  const [showRestrictions, setShowRestrictions] = useState(false)
  const [showMemory, setShowMemory] = useState(false)
  const [showManualApproval, setShowManualApproval] = useState(false)

  // Auto-save on change
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const updated = await updateSkill(skill.id, {
          goal,
          instructions,
          restrictions,
          memory,
          manualApproval,
        })
        onUpdate(updated)
      } catch (error) {
        console.error('Error auto-saving:', error)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [goal, instructions, restrictions, memory, manualApproval])

  return (
    <div className="max-w-3xl space-y-8">
      {/* Goal */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">Goal</h3>
        <p className="text-sm text-gray-500 mb-4">
          Define an overall goal for the skill. This will be used to guide the skill execution towards a specific outcome.
        </p>
        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Add to goal ..."
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Triggers */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Triggers</h3>
        <button className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors">
          <Plus size={20} className="mx-auto mb-2" />
          Add Trigger
        </button>
      </div>

      {/* Instructions */}
      <div>
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Instructions</h3>
          <p className="text-sm text-gray-500">
            Write detailed step-by-step instructions for the entire process. Include what to do, when to do it, and how to handle different scenarios. The more specific you are, the better the results.
          </p>
        </div>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Add instructions ..."
          rows={12}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
        />
        <p className="mt-2 text-xs text-gray-500">
          💡 To add actions, type / and select an action from the list.
        </p>
      </div>

      {/* Restrictions (Collapsible) */}
      <div>
        <button
          onClick={() => setShowRestrictions(!showRestrictions)}
          className="flex items-center justify-between w-full pb-4 border-b border-gray-200"
        >
          <div className="text-left">
            <h3 className="text-base font-semibold text-gray-900">
              Restrictions <span className="text-sm font-normal text-gray-400">optional</span>
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Define what should never be done or avoided.
            </p>
          </div>
          {showRestrictions ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
        </button>
        {showRestrictions && (
          <div className="mt-4">
            <textarea
              value={restrictions}
              onChange={(e) => setRestrictions(e.target.value)}
              placeholder="Add restrictions ..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}
      </div>

      {/* Memory (Collapsible) */}
      <div>
        <button
          onClick={() => setShowMemory(!showMemory)}
          className="flex items-center justify-between w-full pb-4 border-b border-gray-200"
        >
          <div className="text-left">
            <h3 className="text-base font-semibold text-gray-900">
              Memory <span className="text-sm font-normal text-gray-400">optional</span>
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Add important details here that the skill should remember throughout the execution.
            </p>
          </div>
          {showMemory ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
        </button>
        {showMemory && (
          <div className="mt-4">
            <textarea
              value={memory}
              onChange={(e) => setMemory(e.target.value)}
              placeholder="Add memory ..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}
      </div>

      {/* Manual Approval (Collapsible) */}
      <div>
        <button
          onClick={() => setShowManualApproval(!showManualApproval)}
          className="flex items-center justify-between w-full pb-4 border-b border-gray-200"
        >
          <div className="text-left">
            <h3 className="text-base font-semibold text-gray-900">
              Manually Approve Actions <span className="text-sm font-normal text-gray-400">optional</span>
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Review and approve actions before they're executed.
            </p>
          </div>
          {showManualApproval ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
        </button>
        {showManualApproval && (
          <div className="mt-4">
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
              <div>
                <span className="text-sm font-medium text-gray-900">Require manual approval</span>
                <p className="text-xs text-gray-500 mt-1">
                  You'll get notified before each action
                </p>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={manualApproval}
                  onChange={(e) => setManualApproval(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </div>
            </label>
          </div>
        )}
      </div>

      {/* Auto-save indicator */}
      <p className="text-xs text-gray-400 text-center pt-4">
        Changes are saved automatically
      </p>
    </div>
  )
}
