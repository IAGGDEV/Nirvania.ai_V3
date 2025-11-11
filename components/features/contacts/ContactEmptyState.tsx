'use client'

import { useState } from 'react'
import { UserPlus, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ContactCreateModal } from './ContactCreateModal'

export function ContactEmptyState() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  
  const handleCreateContact = () => {
    setShowCreateModal(true)
  }

  const handleImport = () => {
    // TODO: Abrir modal de importación
    console.log('Importar contactos')
  }

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-50">
          <span className="text-4xl">👤</span>
        </div>
        
        <h3 className="mb-2 text-xl font-semibold text-gray-900">
          No hay contactos todavía
        </h3>
        
        <p className="mb-8 text-gray-600">
          Comienza agregando tu primer contacto o importa desde un archivo CSV.
        </p>
        
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={handleCreateContact}>
            <UserPlus className="mr-2 h-4 w-4" />
            Agregar Contacto
          </Button>
          
          <Button variant="outline" onClick={handleImport}>
            <Upload className="mr-2 h-4 w-4" />
            Importar CSV
          </Button>
        </div>
      </div>

      {/* Create Contact Modal */}
      <ContactCreateModal 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  )
}
