'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ContactsTable } from '@/components/features/contacts/ContactsTable'
import { ContactFormModal } from '@/components/features/contacts/ContactFormModal'
import { useContactsStore } from '@/lib/stores/contacts-supabase'
import { Button } from '@/components/ui/button'
import type { ContactFormData } from '@/lib/types/contacts'

export default function ContactsPage() {
  const { error, clearError, createContact } = useContactsStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCreateContact = async (data: ContactFormData) => {
    const result = await createContact(data)
    if (result) {
      setIsModalOpen(false)
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contactos</h1>
            <p className="text-gray-600 mt-1">Gestiona todos tus contactos en un solo lugar</p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Contacto
          </Button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="ml-auto flex-shrink-0 text-red-400 hover:text-red-500"
            >
              <span className="sr-only">Cerrar</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Contacts Table */}
        <ContactsTable />

        {/* Create Contact Modal */}
        <ContactFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleCreateContact}
          mode="create"
        />
      </div>
    </div>
  )
}
