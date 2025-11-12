'use client'

import { Users, Plus, Upload, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ContactEmptyStateProps {
  onCreateContact: () => void
}

export function ContactEmptyState({ onCreateContact }: ContactEmptyStateProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-16 text-center">
        <div className="mx-auto w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <Users className="w-10 h-10 text-blue-600" strokeWidth={1.5} />
        </div>
        
        <h3 class="text-xl font-semibold text-gray-900 mb-2">
          No tienes contactos aún
        </h3>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Los contactos son el corazón de tu CRM. Comienza agregando tu primer contacto
          o importa una lista completa desde un archivo CSV.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onCreateContact}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear Primer Contacto
          </Button>
          
          <Button
            variant="outline"
            onClick={() => alert('Import CSV - Usa el botón en el toolbar')}
          >
            <Upload className="w-4 h-4 mr-2" />
            Importar desde CSV
          </Button>
        </div>

        {/* Quick Tips */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-3xl mx-auto">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Crear Manual</h4>
            <p className="text-sm text-gray-600">
              Agrega contactos uno por uno con todos sus detalles
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <Upload className="w-5 h-5 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Importar CSV</h4>
            <p className="text-sm text-gray-600">
              Sube archivos CSV con cientos de contactos a la vez
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Formularios</h4>
            <p className="text-sm text-gray-600">
              Los formularios públicos crean contactos automáticamente
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
