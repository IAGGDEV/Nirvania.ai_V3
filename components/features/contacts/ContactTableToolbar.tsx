'use client'

import { useState } from 'react'
import { Table } from '@tanstack/react-table'
import { Search, Filter, Download, Upload, Trash2, Plus, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useContactsStore } from '@/lib/stores/contacts-mock'
import type { Contact } from '@/lib/types/contacts'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ContactCreateModal } from './ContactCreateModal'

interface ContactTableToolbarProps {
  table: Table<Contact>
}

export function ContactTableToolbar({ table }: ContactTableToolbarProps) {
  const {
    searchQuery,
    setSearchQuery,
    selectedContacts,
    deleteMultipleContacts,
    filters,
    setFilters,
  } = useContactsStore()

  const [isDeleting, setIsDeleting] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const handleDeleteSelected = async () => {
    if (selectedContacts.length === 0) return
    
    const confirmMessage = selectedContacts.length === 1 
      ? '¿Estás seguro de que quieres eliminar este contacto?'
      : `¿Estás seguro de que quieres eliminar ${selectedContacts.length} contactos?`
    
    if (!confirm(confirmMessage)) return
    
    setIsDeleting(true)
    try {
      await deleteMultipleContacts(selectedContacts)
    } catch (error) {
      console.error('Error deleting contacts:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleExport = () => {
    // TODO: Implementar exportación CSV
    console.log('Exportar contactos')
  }

  const handleImport = () => {
    // TODO: Abrir modal de importación
    console.log('Importar contactos')
  }

  const handleCreateContact = () => {
    setShowCreateModal(true)
  }

  const handleViewSettings = () => {
    // TODO: Abrir panel de configuración de vista
    console.log('Configurar vista')
  }

  return (
    <div className="flex items-center justify-between space-x-2">
      <div className="flex flex-1 items-center space-x-2">
        {/* Search */}
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar por nombre, email o empresa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filters */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="default">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
              {filters.length > 0 && (
                <span className="ml-1 rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
                  {filters.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem>
              <span className="text-sm font-medium">Filtrar por empresa</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span className="text-sm font-medium">Filtrar por ubicación</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span className="text-sm font-medium">Filtrar por fecha</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => setFilters([])}
              disabled={filters.length === 0}
            >
              <span className="text-sm">Limpiar filtros</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Bulk actions */}
        {selectedContacts.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {selectedContacts.length} seleccionado(s)
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteSelected}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {/* Import/Export */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="default">
              <Download className="mr-2 h-4 w-4" />
              Acciones
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Exportar a CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleImport}>
              <Upload className="mr-2 h-4 w-4" />
              Importar CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* View Settings */}
        <Button 
          variant="outline" 
          size="icon"
          onClick={handleViewSettings}
        >
          <Settings2 className="h-4 w-4" />
        </Button>

        {/* Create Contact */}
        <Button onClick={handleCreateContact}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo contacto
        </Button>
      </div>

      {/* Create Contact Modal */}
      <ContactCreateModal 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  )
}
