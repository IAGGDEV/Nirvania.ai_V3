'use client'

import { useState, useRef } from 'react'
import { Search, Filter, Download, Upload, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useContactsStore } from '@/lib/stores/contacts-supabase'
import type { Table } from '@tanstack/react-table'
import type { Contact, ContactFilters } from '@/lib/types/contacts'

interface ContactTableToolbarProps {
  table: Table<Contact>
}

export function ContactTableToolbar({ table }: ContactTableToolbarProps) {
  const {
    searchQuery,
    setSearchQuery,
    selectedContacts,
    deleteContacts,
    clearSelection,
    filters,
    setFilters,
    importFromCSV,
  } = useContactsStore()

  const [showFilters, setShowFilters] = useState(false)
  const [localFilters, setLocalFilters] = useState<ContactFilters>(filters)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSearch = (value: string) => {
    setSearchQuery(value)
  }

  const handleApplyFilters = () => {
    setFilters(localFilters)
    setShowFilters(false)
  }

  const handleClearFilters = () => {
    setLocalFilters({})
    setFilters({})
  }

  const handleDeleteSelected = async () => {
    if (selectedContacts.length === 0) return
    
    if (confirm(`¿Estás seguro de eliminar ${selectedContacts.length} contacto(s)?`)) {
      await deleteContacts(selectedContacts)
    }
  }

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const result = await importFromCSV(file)
      alert(`Importación completada:\n✅ ${result.success} contactos importados\n❌ ${result.failed} fallidos`)
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      alert('Error al importar CSV')
    }
  }

  const handleExportCSV = () => {
    // TODO: Implement export
    alert('Export CSV - Próximamente')
  }

  const activeFiltersCount = Object.keys(filters).filter(key => {
    const value = filters[key as keyof ContactFilters]
    return value && (Array.isArray(value) ? value.length > 0 : true)
  }).length

  return (
    <div className="space-y-4">
      {/* Main Toolbar */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filters */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          {activeFiltersCount > 0 && (
            <span className="ml-2 px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </Button>

        {/* Import CSV */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleImportCSV}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Importar CSV
          </Button>
        </div>

        {/* Export CSV */}
        <Button
          variant="outline"
          onClick={handleExportCSV}
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>

        {/* Delete Selected */}
        {selectedContacts.length > 0 && (
          <Button
            variant="outline"
            onClick={handleDeleteSelected}
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar ({selectedContacts.length})
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Filtros</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
            >
              Limpiar todo
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Lifecycle Stage Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Etapa del Lead
              </label>
              <select
                multiple
                value={localFilters.lifecycle_stage || []}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value) as any
                  setLocalFilters(prev => ({ ...prev, lifecycle_stage: selected }))
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                size={5}
              >
                <option value="lead">Lead</option>
                <option value="mql">MQL</option>
                <option value="sql">SQL</option>
                <option value="opportunity">Opportunity</option>
                <option value="customer">Customer</option>
              </select>
            </div>

            {/* Country Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                País
              </label>
              <select
                multiple
                value={localFilters.country || []}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value)
                  setLocalFilters(prev => ({ ...prev, country: selected }))
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                size={5}
              >
                <option value="MX">🇲🇽 México</option>
                <option value="BR">🇧🇷 Brasil</option>
                <option value="CO">🇨🇴 Colombia</option>
                <option value="AR">🇦🇷 Argentina</option>
                <option value="CL">🇨🇱 Chile</option>
                <option value="PE">🇵🇪 Perú</option>
              </select>
            </div>

            {/* Quick Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtros Rápidos
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={localFilters.has_email || false}
                    onChange={(e) => setLocalFilters(prev => ({ ...prev, has_email: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Con email</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={localFilters.has_phone || false}
                    onChange={(e) => setLocalFilters(prev => ({ ...prev, has_phone: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Con teléfono</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Aplicar Filtros
            </Button>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Filtros activos:</span>
          {filters.lifecycle_stage && filters.lifecycle_stage.length > 0 && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs flex items-center gap-1">
              Etapa: {filters.lifecycle_stage.join(', ')}
              <button
                onClick={() => setFilters({ ...filters, lifecycle_stage: undefined })}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.country && filters.country.length > 0 && (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs flex items-center gap-1">
              País: {filters.country.join(', ')}
              <button
                onClick={() => setFilters({ ...filters, country: undefined })}
                className="hover:bg-green-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          <button
            onClick={handleClearFilters}
            className="text-xs text-gray-600 hover:text-gray-900 underline"
          >
            Limpiar todos
          </button>
        </div>
      )}
    </div>
  )
}
