import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { executeSkillWithClaude } from '@/lib/ai/execution-engine'
import type { LogEntry } from '@/lib/types/agents'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get skill
    const { data: skill, error: skillError } = await supabase
      .from('skills')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (skillError || !skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
    }
    
    // Parse request body
    const { input } = await request.json()
    
    if (!input) {
      return NextResponse.json({ error: 'Input is required' }, { status: 400 })
    }
    
    // Create skill run record
    const { data: skillRun, error: runError } = await supabase
      .from('skill_runs')
      .insert({
        skill_id: params.id,
        input,
        status: 'running',
        started_at: new Date().toISOString(),
        logs: [],
      })
      .select()
      .single()
    
    if (runError || !skillRun) {
      return NextResponse.json({ error: 'Failed to create skill run' }, { status: 500 })
    }
    
    // Execute with Claude
    const startTime = Date.now()
    const logs: LogEntry[] = []
    
    try {
      // Add initial log
      logs.push({
        timestamp: new Date().toISOString(),
        level: 'info',
        message: 'Starting skill execution with Claude AI...',
      })
      
      // Execute skill
      const result = await executeSkillWithClaude(skill, input, supabase)
      
      const duration_ms = Date.now() - startTime
      
      // Add completion log
      logs.push({
        timestamp: new Date().toISOString(),
        level: 'success',
        message: `Skill executed successfully in ${duration_ms}ms`,
      })
      
      // Update skill run with success
      await supabase
        .from('skill_runs')
        .update({
          status: 'succeeded',
          output: result.output,
          logs,
          duration_ms,
          completed_at: new Date().toISOString(),
        })
        .eq('id', skillRun.id)
      
      return NextResponse.json({
        success: true,
        output: result.output,
        logs,
        duration_ms,
      })
      
    } catch (executionError: any) {
      const duration_ms = Date.now() - startTime
      
      // Add error log
      logs.push({
        timestamp: new Date().toISOString(),
        level: 'error',
        message: executionError.message || 'Execution failed',
        metadata: { error: executionError.toString() },
      })
      
      // Update skill run with failure
      await supabase
        .from('skill_runs')
        .update({
          status: 'failed',
          error: executionError.message,
          logs,
          duration_ms,
          completed_at: new Date().toISOString(),
        })
        .eq('id', skillRun.id)
      
      return NextResponse.json({
        success: false,
        error: executionError.message,
        logs,
        duration_ms,
      }, { status: 500 })
    }
    
  } catch (error: any) {
    console.error('Error in POST /api/skills/[id]/execute:', error)
    return NextResponse.json(
      { error: error.message || 'Error al ejecutar skill' },
      { status: 500 }
    )
  }
}
