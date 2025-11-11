'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from '@tanstack/react-table'
import { useContactsStore } from '@/lib/stores/contacts-mock'
import type { Contact } from '@/lib/types/contacts'
import { ContactRow } from './ContactRow'
import { ContactTableHeader } from './ContactTableHeader'
import { ContactTableToolbar } from './ContactTableToolbar'
import { ContactTablePagination } from './ContactTablePagination'
import { ContactEmptyState } from './ContactEmptyState'
import { formatDate } from '@/lib/utils/date'
import { Checkbox } from '@/components/ui/checkbox'
import { Building2, Mail, Phone, MapPin, Calendar, DollarSign } from 'lucide-react'
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
    setPage,
    setPageSize,
    searchQuery,
    filters,
    sort,
    currentView
  } = useContactsStore()

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  // Columnas de la tabla
  const columns = useMemo<ColumnDef<Contact>[]>(
    () => [
      {
        id: 'select',
        size: 40,
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
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
              {contact.role && (
                <span className="text-sm text-gray-500">{contact.role}</span>
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
          return (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <a
                href={`mailto:${email}`}
                className="text-primary-600 hover:text-primary-700 hover:underline"
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
          const phone = row.getValue('phone') as string | undefined
          if (!phone) return <span className="text-gray-400">—</span>
          
          return (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>{phone}</span>
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
        accessorKey: 'location',
        header: 'Ubicación',
        size: 150,
        cell: ({ row }) => {
          const location = row.getValue('location') as string | undefined
          const country = row.original.country
          
          if (!location && !country) return <span className="text-gray-400">—</span>
          
          return (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="truncate">
                {[location, country].filter(Boolean).join(', ')}
              </span>
            </div>
          )
        },
      },
      {
        id: 'deals',
        header: 'Tratos',
        size: 150,
        cell: ({ row }) => {
          const deals = row.original.deals || []
          const totalValue = deals.reduce((sum, deal) => {
            return sum + (deal.status !== 'lost' ? deal.amount : 0)
          }, 0)
          
          if (deals.length === 0) return <span className="text-gray-400">—</span>
          
          return (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span>
                {deals.length} ({new Intl.NumberFormat('es-MX', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                }).format(totalValue)})
              </span>
            </div>
          )
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Creado',
        size: 120,
        cell: ({ row }) => {
          const date = row.getValue('createdAt') as Date
          return (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">{formatDate(date)}</span>
            </div>
          )
        },
      },
    ],
    [selectedContacts, selectContact, deselectContact, selectAllContacts, clearSelection]
  )

  // Configuración de la tabla
  const table = useReactTable({
    data: contacts,
    columns,
    pageCount: Math.ceil(pagination.total / pagination.pageSize),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: pagination.page - 1,
        pageSize: pagination.pageSize,
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  })

  // Cargar contactos al montar
  useEffect(() => {
    fetchContacts()
  }, [fetchContacts, pagination.page, pagination.pageSize, searchQuery, filters, sort])

  // Aplicar configuración de vista
  useEffect(() => {
    if (currentView) {
      const visibility: VisibilityState = {}
      currentView.columns.forEach(col => {
        visibility[col.id] = col.visible
      })
      setColumnVisibility(visibility)
    }
  }, [currentView])

  if (loading && contacts.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!loading && contacts.length === 0 && !searchQuery && filters.length === 0) {
    return <ContactEmptyState />
  }

  return (
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
  )
}
