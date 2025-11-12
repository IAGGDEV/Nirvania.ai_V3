'use client'

import { Skill } from '@/lib/types/agents'
import { Card } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface SkillOverviewProps {
  skill: Skill
}

export function SkillOverview({ skill }: SkillOverviewProps) {
  // Mock data for chart
  const chartData = [
    { date: 'Nov 3', runs: 0 },
    { date: 'Nov 4', runs: 0 },
    { date: 'Nov 5', runs: 0 },
    { date: 'Nov 6', runs: 0 },
    { date: 'Nov 7', runs: 0 },
    { date: 'Nov 8', runs: 0 },
    { date: 'Nov 9', runs: 0 },
  ]

  const metrics = [
    { label: 'Total Runs', value: skill.totalRuns, color: 'text-gray-900' },
    { label: 'En progreso', value: skill.inProgress, color: 'text-blue-600' },
    { label: 'Exitosos', value: skill.succeeded, color: 'text-green-600' },
    { label: 'Finalizados', value: skill.exited, color: 'text-yellow-600' },
    { label: 'Errores', value: skill.errors, color: 'text-red-600' },
  ]

  return (
    <div className="space-y-8">
      {/* Metrics Cards */}
      <div className="grid grid-cols-5 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="p-6 text-center">
            <div className={`text-3xl font-bold ${metric.color}`}>{metric.value}</div>
            <div className="mt-2 text-sm text-gray-500">{metric.label}</div>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Ejecuciones de Skill</h3>
          <select className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>Últimos 7 días</option>
            <option>Últimos 30 días</option>
            <option>Últimos 90 días</option>
          </select>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="date" 
              stroke="#6B7280" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#6B7280" 
              fontSize={12}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="runs" 
              stroke="#0066FF" 
              strokeWidth={2}
              dot={{ fill: '#0066FF', r: 4 }}
              name="Ejecuciones"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Run History */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Historial de Ejecuciones</h3>
        
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-gray-500">Aún no hay ejecuciones de este skill</p>
          <p className="text-sm text-gray-400 mt-2">
            Las ejecuciones aparecerán aquí una vez que el skill esté activo
          </p>
        </div>
      </Card>
    </div>
  )
}




