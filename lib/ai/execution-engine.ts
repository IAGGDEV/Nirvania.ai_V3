import { ChatAnthropic } from '@langchain/anthropic'
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { createClaudeClient } from './claude-client'
import { getToolsForSkill, ToolName } from './tools'
import type { Skill, SkillRun } from '@/lib/types/agents'

/**
 * Logger para tracking de ejecuciones
 */
export class ExecutionLogger {
  private logs: Array<{
    timestamp: Date
    level: 'info' | 'warn' | 'error'
    message: string
    metadata?: any
  }> = []

  info(message: string, metadata?: any) {
    this.logs.push({
      timestamp: new Date(),
      level: 'info',
      message,
      metadata,
    })
    console.log(`[INFO] ${message}`, metadata || '')
  }

  warn(message: string, metadata?: any) {
    this.logs.push({
      timestamp: new Date(),
      level: 'warn',
      message,
      metadata,
    })
    console.warn(`[WARN] ${message}`, metadata || '')
  }

  error(message: string, metadata?: any) {
    this.logs.push({
      timestamp: new Date(),
      level: 'error',
      message,
      metadata,
    })
    console.error(`[ERROR] ${message}`, metadata || '')
  }

  getLogs() {
    return this.logs
  }

  clear() {
    this.logs = []
  }
}

/**
 * Opciones de ejecución
 */
export interface ExecutionOptions {
  testMode?: boolean
  requireApproval?: boolean
  toolNames?: ToolName[]
  maxIterations?: number
  timeout?: number
}

/**
 * Resultado de ejecución
 */
export interface ExecutionResult {
  success: boolean
  output?: any
  error?: string
  logs: ExecutionLogger['logs']
  toolsUsed: string[]
  duration: number
  status: 'succeeded' | 'failed' | 'exited' | 'pending_approval'
}

/**
 * SKILL EXECUTION ENGINE
 * Motor principal para ejecutar skills con LangChain + Claude
 */
export class SkillExecutionEngine {
  private logger: ExecutionLogger
  private llm: ChatAnthropic

  constructor() {
    this.logger = new ExecutionLogger()
    this.llm = createClaudeClient()
  }

  /**
   * Ejecuta un skill con el input proporcionado
   */
  async execute(
    skill: Skill,
    input: string,
    options: ExecutionOptions = {}
  ): Promise<ExecutionResult> {
    const startTime = Date.now()
    const toolsUsed: string[] = []
    
    const {
      testMode = true,
      requireApproval = skill.manualApproval,
      toolNames,
      maxIterations = 10,
      timeout = 60000, // 60 segundos
    } = options

    this.logger.clear()
    this.logger.info('Iniciando ejecución de skill', {
      skillId: skill.id,
      skillName: skill.name,
      testMode,
      requireApproval,
    })

    try {
      // Validar que tenga instrucciones
      if (!skill.instructions || skill.instructions.trim() === '') {
        throw new Error('El skill no tiene instrucciones configuradas')
      }

      // Construir el prompt del sistema
      const systemPrompt = this.buildSystemPrompt(skill, testMode)
      this.logger.info('Prompt del sistema construido')

      // Obtener herramientas
      const tools = getToolsForSkill(toolNames)
      this.logger.info(`${tools.length} herramientas cargadas`)

      // Si requiere aprobación manual, pausar aquí
      if (requireApproval && !testMode) {
        this.logger.warn('Requiere aprobación manual antes de continuar')
        return {
          success: false,
          status: 'pending_approval',
          logs: this.logger.getLogs(),
          toolsUsed,
          duration: Date.now() - startTime,
        }
      }

      // Crear el prompt template
      const prompt = ChatPromptTemplate.fromMessages([
        ['system', systemPrompt],
        ['human', '{input}'],
        ['placeholder', '{agent_scratchpad}'],
      ])

      // Crear el agente
      const agent = await createToolCallingAgent({
        llm: this.llm,
        tools,
        prompt,
      })

      // Crear el executor
      const executor = new AgentExecutor({
        agent,
        tools,
        maxIterations,
        returnIntermediateSteps: true,
        verbose: true,
      })

      this.logger.info('Ejecutando agente con LangChain')

      // Ejecutar con timeout
      const executionPromise = executor.invoke({
        input,
      })

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout: Ejecución excedió el tiempo límite')), timeout)
      )

      const result = await Promise.race([executionPromise, timeoutPromise]) as any

      // Registrar herramientas usadas
      if (result.intermediateSteps) {
        result.intermediateSteps.forEach((step: any) => {
          if (step.action?.tool) {
            toolsUsed.push(step.action.tool)
            this.logger.info(`Herramienta ejecutada: ${step.action.tool}`, {
              input: step.action.toolInput,
              output: step.observation,
            })
          }
        })
      }

      this.logger.info('Ejecución completada exitosamente')

      return {
        success: true,
        output: result.output,
        status: 'succeeded',
        logs: this.logger.getLogs(),
        toolsUsed: Array.from(new Set(toolsUsed)),
        duration: Date.now() - startTime,
      }
    } catch (error) {
      this.logger.error('Error en ejecución', {
        error: error instanceof Error ? error.message : String(error),
      })

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        status: 'failed',
        logs: this.logger.getLogs(),
        toolsUsed: Array.from(new Set(toolsUsed)),
        duration: Date.now() - startTime,
      }
    }
  }

  /**
   * Construye el prompt del sistema basado en la configuración del skill
   */
  private buildSystemPrompt(skill: Skill, testMode: boolean): string {
    let prompt = `Eres un asistente IA especializado en CRM para empresas en LATAM.

Tu rol es: ${skill.agent?.name || 'Agente CRM'}
Descripción: ${skill.agent?.description || ''}

`

    // Agregar objetivo si existe
    if (skill.goal) {
      prompt += `## OBJETIVO PRINCIPAL
${skill.goal}

`
    }

    // Agregar instrucciones
    prompt += `## INSTRUCCIONES
${skill.instructions}

`

    // Agregar restricciones
    if (skill.restrictions) {
      prompt += `## RESTRICCIONES IMPORTANTES
${skill.restrictions}

`
    }

    // Agregar memoria/contexto
    if (skill.memory) {
      prompt += `## CONTEXTO A RECORDAR
${skill.memory}

`
    }

    // Modo test
    if (testMode) {
      prompt += `## ⚠️ MODO TEST ACTIVADO
- NO envíes emails reales
- NO modifiques datos en la base de datos
- Simula todas las acciones
- Indica claramente que es una simulación en tu respuesta

`
    }

    prompt += `## REGLAS GENERALES
- Usa las herramientas disponibles para realizar las tareas
- Sé proactivo pero respetuoso
- Personaliza cada mensaje según el contexto del contacto
- Registra todas las actividades importantes
- Si no estás seguro, pregunta antes de actuar
- Responde siempre en español para LATAM

Comienza el análisis y ejecución:`

    return prompt
  }

  /**
   * Valida si un skill puede ejecutarse
   */
  validateSkill(skill: Skill): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!skill.instructions || skill.instructions.trim() === '') {
      errors.push('El skill no tiene instrucciones configuradas')
    }

    if (skill.status === 'inactive') {
      errors.push('El skill está inactivo. Actívalo antes de ejecutar.')
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  /**
   * Limpia los logs
   */
  clearLogs() {
    this.logger.clear()
  }

  /**
   * Obtiene los logs actuales
   */
  getLogs() {
    return this.logger.getLogs()
  }
}

/**
 * Instancia singleton del motor de ejecución
 */
let executionEngineInstance: SkillExecutionEngine | null = null

export function getExecutionEngine(): SkillExecutionEngine {
  if (!executionEngineInstance) {
    executionEngineInstance = new SkillExecutionEngine()
  }
  return executionEngineInstance
}
