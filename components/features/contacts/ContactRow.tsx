'use client'

import { Row, flexRender } from '@tanstack/react-table'
import type { Contact } from '@/lib/types/contacts'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Eye, Edit, Trash, Phone, Mail, MessageCircle } from 'lucide-react'
import { useContactsStore } from '@/lib/stores/contacts-mock'
import { ContactCreateModal } from './ContactCreateModal'

interface ContactRowProps {
  row: Row<Contact>
}

export function ContactRow({ row }: ContactRowProps) {
  const router = useRouter()
  const { deleteContact } = useContactsStore()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const handleView = () => {
    router.push(`/contacts/${row.original.id}`)
  }

  const handleEdit = () => {
    setShowEditModal(true)
  }

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar este contacto?')) return
    
    setIsDeleting(true)
    try {
      await deleteContact(row.original.id)
    } catch (error) {
      console.error('Error deleting contact:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleWhatsApp = () => {
    const phone = row.original.whatsapp || row.original.phone
    if (!phone) return
    
    // Eliminar caracteres no numéricos excepto el +
    const cleanPhone = phone.replace(/[^\d+]/g, '')
    window.open(`https://wa.me/${cleanPhone.replace('+', '')}`, '_blank')
  }

  const handleEmail = () => {
    window.open(`mailto:${row.original.email}`, '_blank')
  }

  return (
    <tr 
      className={cn(
        "hover:bg-gray-50 transition-colors",
        isDeleting && "opacity-50 pointer-events-none"
      )}
    >
      {row.getVisibleCells().map((cell) => (
        <td
          key={cell.id}
          className={cn(
            "px-6 py-4 whitespace-nowrap text-sm",
            cell.column.id === 'select' && "w-12"
          )}
          style={{
            width: cell.column.getSize(),
          }}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
      
      {/* Actions column */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              disabled={isDeleting}
            >
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleView}>
              <Eye className="mr-2 h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={handleEmail}>
              <Mail className="mr-2 h-4 w-4" />
              Enviar email
            </DropdownMenuItem>
            {row.original.phone && (
              <DropdownMenuItem onClick={() => window.open(`tel:${row.original.phone}`)}>
                <Phone className="mr-2 h-4 w-4" />
                Llamar
              </DropdownMenuItem>
            )}
            {(row.original.whatsapp || row.original.phone) && (
              <DropdownMenuItem onClick={handleWhatsApp}>
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={handleDelete}
              className="text-red-600 focus:bg-red-50 focus:text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>

      {/* Edit Contact Modal */}
      <ContactCreateModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        contact={row.original}
      />
    </tr>
  )
}
