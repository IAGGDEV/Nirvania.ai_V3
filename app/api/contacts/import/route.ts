import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/contacts/import - Import contacts from CSV
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user's organization
    const { data: userData } = await supabase
      .from('users')
      .select('organization_id')
      .eq('id', user.id)
      .single()
    
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Parse CSV from body
    const body = await request.json()
    const { csvData } = body
    
    if (!csvData) {
      return NextResponse.json({ error: 'CSV data is required' }, { status: 400 })
    }
    
    // Parse CSV
    const lines = csvData.split('\n').filter((line: string) => line.trim())
    const headers = lines[0].split(',').map((h: string) => h.trim().toLowerCase())
    
    let success = 0
    let failed = 0
    const errors: string[] = []
    
    // Process each row
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',').map((v: string) => v.trim())
        const row: any = {}
        
        headers.forEach((header: string, index: number) => {
          row[header] = values[index] || null
        })
        
        // Validate required fields
        if (!row.name && !row.nombre) {
          failed++
          errors.push(`Línea ${i + 1}: Falta el nombre`)
          continue
        }
        
        // Map CSV columns to database columns
        const contactData: any = {
          organization_id: userData.organization_id,
          owner_id: user.id,
          name: row.name || row.nombre,
          email: row.email || row.correo,
          phone: row.phone || row.telefono || row.teléfono,
          mobile: row.mobile || row.movil || row.móvil,
          whatsapp: row.whatsapp,
          job_title: row.job_title || row.cargo || row.puesto,
          department: row.department || row.departamento,
          seniority: row.seniority || row.senioridad,
          lifecycle_stage: row.lifecycle_stage || row.etapa || 'lead',
          lead_status: row.lead_status || row.estado || 'new',
          country: row.country || row.pais || row.país || 'MX',
          city: row.city || row.ciudad,
          state: row.state || row.estado_provincia,
          source: 'import',
          lead_score: 0,
          email_opt_in: true,
          whatsapp_opt_in: true,
        }
        
        const { error } = await supabase
          .from('contacts')
          .insert(contactData)
        
        if (error) {
          failed++
          errors.push(`Línea ${i + 1}: ${error.message}`)
        } else {
          success++
        }
      } catch (err: any) {
        failed++
        errors.push(`Línea ${i + 1}: ${err.message}`)
      }
    }
    
    return NextResponse.json({
      success,
      failed,
      total: lines.length - 1,
      errors: errors.slice(0, 10), // Return first 10 errors
    })
  } catch (error: any) {
    console.error('Error importing contacts:', error)
    return NextResponse.json(
      { error: error.message || 'Error al importar contactos' },
      { status: 500 }
    )
  }
}

