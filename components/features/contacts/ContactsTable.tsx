'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table'
import { useContactsStore } from '@/lib/stores/contacts-supabase'
import type { Contact } from '@/lib/types/contacts'
import { ContactRow } from './ContactRow'
import { ContactTableHeader } from './ContactTableHeader'
import { ContactTableToolbar } from './ContactTableToolbar'
import { ContactTablePagination } from './ContactTablePagination'
import { ContactEmptyState } from './ContactEmptyState'
import { Checkbox } from '@/components/ui/checkbox'
import { Building2, Mail, Phone, MapPin, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ContactsTable() {
  const {
    contacts,
    loading,
    selectedContacts,
    selectContact,
    deselectContact,
    selectAllContacts,
    clearSelection,
    fetchContacts,
    pagination,
    searchQuery,
    filters,
  } = useContactsStore()

  // Fetch contacts on mount
  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  // Columnas de la tabla
  const columns = useMemo<ColumnDef<Contact>[]>(
    () => [
      {
        id: 'select',
        size: 40,
        header: ({ table }) => (
          <Checkbox
            checked={selectedContacts.length > 0 && selectedContacts.length === contacts.length}
            onCheckedChange={(value) => {
              if (value) {
                selectAllContacts()
              } else {
                clearSelection()
              }
            }}
            aria-label="Seleccionar todos"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={selectedContacts.includes(row.original.id)}
            onCheckedChange={(value) => {
              if (value) {
                selectContact(row.original.id)
              } else {
                deselectContact(row.original.id)
              }
            }}
            aria-label="Seleccionar fila"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'name',
        header: 'Nombre',
        size: 200,
        cell: ({ row }) => {
          const contact = row.original
          return (
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">{contact.name}</span>
              {contact.job_title && (
                <span className="text-sm text-gray-500">{contact.job_title}</span>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 250,
        cell: ({ row }) => {
          const email = row.getValue('email') as string
          if (!email) return <span className="text-gray-400">—</span>
          
          return (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <a
                href={`mailto:${email}`}
                className="text-blue-600 hover:text-blue-700 hover:underline"
              >
                {email}
              </a>
            </div>
          )
        },
      },
      {
        accessorKey: 'phone',
        header: 'Teléfono',
        size: 150,
        cell: ({ row }) => {
          const phone = row.getValue('phone') as string | null
          const whatsapp = row.original.whatsapp
          
          if (!phone && !whatsapp) return <span className="text-gray-400">—</span>
          
          const displayPhone = phone || whatsapp
          
          return (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{displayPhone}</span>
            </div>
          )
        },
      },
      {
        id: 'company',
        header: 'Empresa',
        size: 200,
        cell: ({ row }) => {
          const company = row.original.company
          if (!company) return <span className="text-gray-400">—</span>
          
          return (
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-400" />
              <span className="truncate">{company.name}</span>
            </div>
          )
        },
      },
      {
        id: 'location',
        header: 'Ubicación',
        size: 150,
        cell: ({ row }) => {
          const { city, country } = row.original
          
          if (!city && !country) return <span className="text-gray-400">—</span>
          
          return (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="truncate text-sm">
                {[city, country].filter(Boolean).join(', ')}
              </span>
            </div>
          )
        },
      },
      {
        accessorKey: 'lifecycle_stage',
        header: 'Etapa',
        size: 120,
        cell: ({ row }) => {
          const stage = row.getValue('lifecycle_stage') as string
          const colors: Record<string, string> = {
            lead: 'bg-gray-100 text-gray-700',
            mql: 'bg-blue-100 text-blue-700',
            sql: 'bg-purple-100 text-purple-700',
            opportunity: 'bg-orange-100 text-orange-700',
            customer: 'bg-green-100 text-green-700',
          }
          
          return (
            <span className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              colors[stage] || 'bg-gray-100 text-gray-700'
            )}>
              {stage.toUpperCase()}
            </span>
          )
        },
      },
      {
        accessorKey: 'created_at',
        header: 'Creado',
        size: 120,
        cell: ({ row }) => {
          const date = new Date(row.getValue('created_at') as string)
          return (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600 text-sm">
                {date.toLocaleDateString('es-MX', { 
                  day: '2-digit', 
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
          )
        },
      },
    ],
    [selectedContacts, contacts, selectContact, deselectContact, selectAllContacts, clearSelection]
  )

  // Configuración de la tabla
  const table = useReactTable({
    data: contacts,
    columns,
    pageCount: pagination.totalPages,
    state: {
      pagination: {
        pageIndex: pagination.page - 1,
        pageSize: pagination.pageSize,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  })

  if (loading && contacts.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!loading && contacts.length === 0 && !searchQuery && Object.keys(filters).length === 0) {
    return <ContactEmptyState onCreateContact={() => setIsModalOpen(true)} />
  }

  return (
    <>
      <div className="space-y-4">
        <ContactTableToolbar table={table} />
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <ContactTableHeader key={header.id} header={header} />
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200">
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <ContactRow key={row.id} row={row} />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-6 py-16 text-center text-gray-500"
                    >
                      No se encontraron contactos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <ContactTablePagination table={table} />
        </div>
      </div>

      {/* Create/Edit Modal */}
      <ContactFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateContact}
        mode="create"
      />
    </>
  )
}
