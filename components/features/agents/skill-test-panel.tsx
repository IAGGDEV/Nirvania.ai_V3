'use client'

import { useState } from 'react'
import { Play, Loader2 } from 'lucide-react'
import type { Skill } from '@/lib/types/agents'

interface SkillTestPanelProps {
  skill: Skill
}

export function SkillTestPanel({ skill }: SkillTestPanelProps) {
  const [testInput, setTestInput] = useState('')
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleTest = async () => {
    if (!testInput.trim()) return

    setTesting(true)
    setResult(null)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    setResult('Test completed successfully! The skill would execute with this input.')
    setTesting(false)
  }

  return (
    <div className="sticky top-0 h-screen overflow-y-auto">
      <div className="p-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Test Skill</h2>
          <p className="text-sm text-gray-600">
            Run this skill in test mode. This will not send any emails, messages, or modify any records in your system. This is a safe way to test your skills before going live.
          </p>
        </div>

        <div className="space-y-6">
          {/* Test Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Input <span className="text-red-500">*</span>
            </label>
            <textarea
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="Enter text to test with..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Test Button */}
          <button
            onClick={handleTest}
            disabled={!testInput.trim() || testing}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white text-sm font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {testing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Play size={16} />
                Test Skill
              </>
            )}
          </button>

          {/* Result */}
          {result && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">{result}</p>
            </div>
          )}

          {/* Info */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              💡 <strong>Tip:</strong> Test mode simulates the skill execution without affecting your real data. Use this to validate your skill configuration before activation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
