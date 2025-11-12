'use client'

import { useState } from 'react'
import { flexRender, type Row } from '@tanstack/react-table'
import { MoreHorizontal, Edit2, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ContactFormModal } from './ContactFormModal'
import { useContactsStore } from '@/lib/stores/contacts-supabase'
import type { Contact, ContactFormData } from '@/lib/types/contacts'

interface ContactRowProps {
  row: Row<Contact>
}

export function ContactRow({ row }: ContactRowProps) {
  const { updateContact, deleteContact } = useContactsStore()
  const [showMenu, setShowMenu] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleEdit = () => {
    setIsEditModalOpen(true)
    setShowMenu(false)
  }

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de eliminar este contacto?')) {
      await deleteContact(row.original.id)
    }
    setShowMenu(false)
  }

  const handleUpdate = async (data: ContactFormData) => {
    await updateContact(row.original.id, data)
    setIsEditModalOpen(false)
  }

  return (
    <>
      <tr className="hover:bg-gray-50 group">
        {row.getVisibleCells().map((cell) => (
          <td key={cell.id} className="px-6 py-4 text-sm">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
        
        {/* Actions Column */}
        <td className="px-6 py-4 text-right relative">
          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="h-8 w-8 p-0"
              title="Editar"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Eliminar"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </td>
      </tr>

      {/* Edit Modal */}
      <ContactFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdate}
        contact={row.original}
        mode="edit"
      />
    </>
  )
}
