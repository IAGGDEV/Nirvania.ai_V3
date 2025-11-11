import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getExecutionEngine } from '@/lib/ai/execution-engine'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// Schema de validación para la request
const executeSkillSchema = z.object({
  input: z.string().min(1, 'El input es requerido'),
  testMode: z.boolean().default(true),
  toolNames: z.array(z.string()).optional(),
})

/**
 * POST /api/skills/[id]/execute
 * Ejecuta un skill con el input proporcionado
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient()
    const body = await request.json()

    // Validar request
    const validatedData = executeSkillSchema.parse(body)
    const { input, testMode, toolNames } = validatedData

    // Obtener el skill
    const { data: skill, error: skillError } = await supabase
      .from('skills')
      .select(`
        *,
        agent:agents(*),
        owner:users(id, name, email)
      `)
      .eq('id', params.id)
      .single()

    if (skillError || !skill) {
      return NextResponse.json(
        { error: 'Skill no encontrado' },
        { status: 404 }
      )
    }

    // Validar que el skill pueda ejecutarse
    const engine = getExecutionEngine()
    const validation = engine.validateSkill(skill)

    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Skill inválido', details: validation.errors },
        { status: 400 }
      )
    }

    // Crear registro de ejecución
    const { data: run, error: runError } = await supabase
      .from('skill_runs')
      .insert({
        skill_id: params.id,
        status: 'running',
        input: { text: input, testMode },
        started_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (runError) {
      return NextResponse.json(
        { error: 'Error al crear registro de ejecución' },
        { status: 500 }
      )
    }

    // Ejecutar el skill
    const result = await engine.execute(skill, input, {
      testMode,
      requireApproval: skill.manual_approval,
      toolNames: toolNames as ToolName[],
      maxIterations: 10,
      timeout: 60000,
    })

    // Actualizar registro de ejecución
    await supabase
      .from('skill_runs')
      .update({
        status: result.status,
        output: result.output ? { result: result.output } : null,
        error: result.error,
        logs: result.logs,
        completed_at: new Date().toISOString(),
        duration_ms: result.duration,
      })
      .eq('id', run.id)

    // Actualizar métricas del skill
    const metricField = result.status === 'succeeded' ? 'succeeded' : 
                       result.status === 'failed' ? 'errors' :
                       result.status === 'exited' ? 'exited' : null

    if (metricField) {
      await supabase.rpc('increment_skill_metric', {
        skill_id: params.id,
        metric: metricField,
      })
    }

    // Incrementar total_runs
    await supabase
      .from('skills')
      .update({
        total_runs: skill.total_runs + 1,
      })
      .eq('id', params.id)

    return NextResponse.json({
      success: result.success,
      runId: run.id,
      output: result.output,
      error: result.error,
      logs: result.logs,
      toolsUsed: result.toolsUsed,
      duration: result.duration,
      status: result.status,
      testMode,
    })
  } catch (error) {
    console.error('Error executing skill:', error)
    return NextResponse.json(
      { 
        error: 'Error al ejecutar skill',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/skills/[id]/execute
 * Obtiene el historial de ejecuciones de un skill
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await supabase
      .from('skill_runs')
      .select('*', { count: 'exact' })
      .eq('skill_id', params.id)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      data: data || [],
      pagination: {
        page,
        pageSize,
        total: count || 0,
        pages: Math.ceil((count || 0) / pageSize),
      },
    })
  } catch (error) {
    console.error('Error fetching skill runs:', error)
    return NextResponse.json(
      { error: 'Error al obtener historial de ejecuciones' },
      { status: 500 }
    )
  }
}
