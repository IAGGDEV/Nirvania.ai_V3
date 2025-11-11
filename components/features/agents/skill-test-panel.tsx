'use client'

import { useState } from 'react'
import { Skill } from '@/lib/types/agents'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Play, Loader2, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface SkillTestPanelProps {
  skill: Skill
}

interface TestResult {
  success: boolean
  output?: string
  error?: string
  logs?: Array<{
    timestamp: string
    level: 'info' | 'warn' | 'error'
    message: string
  }>
  toolsUsed?: string[]
  duration?: number
}

export function SkillTestPanel({ skill }: SkillTestPanelProps) {
  const [testInput, setTestInput] = useState('')
  const [isExecuting, setIsExecuting] = useState(false)
  const [result, setResult] = useState<TestResult | null>(null)
  const [showLogs, setShowLogs] = useState(false)

  const handleTest = async () => {
    if (!testInput.trim()) {
      alert('Por favor ingresa un texto para probar')
      return
    }

    setIsExecuting(true)
    setResult(null)

    try {
      const response = await fetch(`/api/skills/${skill.id}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: testInput,
          testMode: true,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al ejecutar skill')
      }

      setResult({
        success: data.success,
        output: data.output,
        error: data.error,
        logs: data.logs,
        toolsUsed: data.toolsUsed,
        duration: data.duration,
      })
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      })
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
          🧪 Probar Skill
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Ejecuta este skill en modo de prueba. No enviará emails, mensajes, ni modificará registros. 
          Es una forma segura de probar antes de activarlo.
        </p>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="test-input" className="text-sm font-medium">
              Input de prueba <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="test-input"
              placeholder="Ej: Busca todos los leads de México que no han respondido en 3 días y envíales un email de seguimiento"
              className="mt-2 bg-white"
              rows={4}
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              disabled={isExecuting}
            />
            <p className="mt-1 text-xs text-gray-600">
              Describe qué quieres que haga el skill o simula un escenario real
            </p>
          </div>

          <Button 
            className="w-full" 
            onClick={handleTest}
            disabled={isExecuting || !testInput.trim()}
          >
            {isExecuting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ejecutando skill...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Probar Skill
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Result */}
      {result && (
        <Card className={`p-6 ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-start gap-3 mb-4">
            {result.success ? (
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1">
                {result.success ? '✅ Ejecución Exitosa' : '❌ Error en Ejecución'}
              </h4>
              {result.duration && (
                <p className="text-xs text-gray-600">
                  Duración: {(result.duration / 1000).toFixed(2)}s
                </p>
              )}
            </div>
          </div>

          {/* Output */}
          {result.output && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Resultado:</p>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <pre className="text-sm whitespace-pre-wrap text-gray-900">
                  {result.output}
                </pre>
              </div>
            </div>
          )}

          {/* Error */}
          {result.error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                <strong>Error:</strong> {result.error}
              </AlertDescription>
            </Alert>
          )}

          {/* Tools Used */}
          {result.toolsUsed && result.toolsUsed.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Herramientas utilizadas:
              </p>
              <div className="flex flex-wrap gap-2">
                {result.toolsUsed.map((tool, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-white rounded text-xs font-mono border border-gray-300"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Logs */}
          {result.logs && result.logs.length > 0 && (
            <Collapsible open={showLogs} onOpenChange={setShowLogs}>
              <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 w-full">
                {showLogs ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                Ver logs detallados ({result.logs.length})
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="bg-white rounded-lg border border-gray-300 p-4 max-h-96 overflow-y-auto">
                  <div className="space-y-2 font-mono text-xs">
                    {result.logs.map((log, i) => (
                      <div
                        key={i}
                        className={`flex gap-2 ${
                          log.level === 'error' ? 'text-red-600' :
                          log.level === 'warn' ? 'text-yellow-600' :
                          'text-gray-600'
                        }`}
                      >
                        <span className="text-gray-400">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="font-semibold">
                          [{log.level.toUpperCase()}]
                        </span>
                        <span>{log.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </Card>
      )}
    </div>
  )
}
