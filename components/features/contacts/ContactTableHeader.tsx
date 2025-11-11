'use client'

import { Header, flexRender } from '@tanstack/react-table'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { Contact } from '@/lib/types/contacts'

interface ContactTableHeaderProps {
  header: Header<Contact, unknown>
}

export function ContactTableHeader({ header }: ContactTableHeaderProps) {
  if (header.isPlaceholder) {
    return null
  }

  const canSort = header.column.getCanSort()
  const sorted = header.column.getIsSorted()

  return (
    <th
      key={header.id}
      colSpan={header.colSpan}
      className={cn(
        "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
        header.column.id === 'select' && "w-12"
      )}
      style={{
        width: header.getSize(),
      }}
    >
      {canSort ? (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 h-8 data-[state=open]:bg-accent"
          onClick={() => {
            const currentSort = header.column.getIsSorted()
            if (currentSort === 'asc') {
              header.column.toggleSorting(true)
            } else if (currentSort === 'desc') {
              header.column.clearSorting()
            } else {
              header.column.toggleSorting(false)
            }
          }}
        >
          <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
          {sorted === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : sorted === 'desc' ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />
          )}
        </Button>
      ) : (
        flexRender(header.column.columnDef.header, header.getContext())
      )}
    </th>
  )
}
