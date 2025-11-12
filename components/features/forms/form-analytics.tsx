'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { TrendingUp, Eye, CheckCircle, Users, Activity } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface FormAnalyticsProps {
  formId: string
}

export function FormAnalytics({ formId }: FormAnalyticsProps) {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [formId])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/forms/${formId}/analytics`)
      if (!response.ok) {
        throw new Error('Error al cargar analytics')
      }
      const data = await response.json()
      setAnalytics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
              </CardHeader>
            </Card>
          ))}
        </div>
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  const chartData = Object.entries(analytics.submissionsByDay || {}).map(([date, count]) => ({
    date: new Date(date).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' }),
    envíos: count,
  }))

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vistas Totales</CardTitle>
            <Eye className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.metrics.views.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Visitantes únicos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Envíos</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.metrics.submissions.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Formularios completados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.metrics.completionRate}%</div>
            <p className="text-xs text-gray-500 mt-1">
              {analytics.metrics.completionRate > 50 ? 'Excelente' : 
               analytics.metrics.completionRate > 30 ? 'Bueno' : 'Mejorar'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contactos Creados</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.metrics.contactsCreated.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Nuevos en el CRM</p>
          </CardContent>
        </Card>
      </div>

      {/* Submissions Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Envíos en el Tiempo</CardTitle>
          <CardDescription>Envíos diarios del formulario</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6B7280" 
                  fontSize={12}
                  tick={{ fill: '#6B7280' }}
                />
                <YAxis 
                  stroke="#6B7280" 
                  fontSize={12}
                  tick={{ fill: '#6B7280' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="envíos" 
                  stroke="#0066FF" 
                  strokeWidth={2}
                  dot={{ fill: '#0066FF', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No hay datos suficientes para mostrar
            </div>
          )}
        </CardContent>
      </Card>

      {/* Field Completion Rates */}
      <Card>
        <CardHeader>
          <CardTitle>Tasa de Completitud por Campo</CardTitle>
          <CardDescription>Porcentaje de usuarios que completan cada campo</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.fieldCompletionRates.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.fieldCompletionRates} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" domain={[0, 100]} stroke="#6B7280" fontSize={12} />
                <YAxis 
                  dataKey="fieldLabel" 
                  type="category" 
                  width={150}
                  stroke="#6B7280" 
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => `${value}%`}
                />
                <Bar 
                  dataKey="completionRate" 
                  fill="#0066FF" 
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No hay datos de campos disponibles
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Submissions */}
      <Card>
        <CardHeader>
          <CardTitle>Envíos Recientes</CardTitle>
          <CardDescription>Últimos 10 formularios enviados</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.recentSubmissions.length > 0 ? (
            <div className="space-y-4">
              {analytics.recentSubmissions.map((submission: any) => (
                <div 
                  key={submission.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      {submission.contact_created ? (
                        <Users className="h-5 w-5 text-primary-600" />
                      ) : (
                        <Activity className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {submission.contact?.name || 'Anónimo'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {submission.contact?.email || 'Sin email'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(submission.submitted_at).toLocaleDateString('es-MX', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(submission.submitted_at).toLocaleTimeString('es-MX', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No hay envíos recientes
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}




