'use client'

import { Table } from '@tanstack/react-table'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { useContactsStore } from '@/lib/stores/contacts-mock'
import type { Contact } from '@/lib/types/contacts'

interface ContactTablePaginationProps {
  table: Table<Contact>
}

export function ContactTablePagination({ table }: ContactTablePaginationProps) {
  const { pagination, setPage, setPageSize } = useContactsStore()
  
  const pageCount = Math.ceil(pagination.total / pagination.pageSize)
  const canPreviousPage = pagination.page > 1
  const canNextPage = pagination.page < pageCount

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value))
  }

  const goToFirstPage = () => setPage(1)
  const goToPreviousPage = () => setPage(Math.max(1, pagination.page - 1))
  const goToNextPage = () => setPage(Math.min(pageCount, pagination.page + 1))
  const goToLastPage = () => setPage(pageCount)

  // Calculate page range to show
  const getPageNumbers = () => {
    const delta = 2 // Pages to show on each side of current page
    const range = []
    const rangeWithDots = []
    let l

    for (let i = 1; i <= pageCount; i++) {
      if (i === 1 || i === pageCount || (i >= pagination.page - delta && i <= pagination.page + delta)) {
        range.push(i)
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1)
        } else if (i - l !== 1) {
          rangeWithDots.push('...')
        }
      }
      rangeWithDots.push(i)
      l = i
    })

    return rangeWithDots
  }

  return (
    <div className="flex items-center justify-between px-6 py-3 border-t">
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <span>
          Mostrando{' '}
          <span className="font-medium">
            {(pagination.page - 1) * pagination.pageSize + 1}
          </span>{' '}
          a{' '}
          <span className="font-medium">
            {Math.min(pagination.page * pagination.pageSize, pagination.total)}
          </span>{' '}
          de <span className="font-medium">{pagination.total}</span> contactos
        </span>
      </div>

      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-gray-700">Filas por página</p>
          <Select
            value={String(pagination.pageSize)}
            onValueChange={handlePageSizeChange}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={goToFirstPage}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">Ir a primera página</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={goToPreviousPage}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">Ir a página anterior</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            {getPageNumbers().map((pageNumber, i) => (
              pageNumber === '...' ? (
                <span key={`dots-${i}`} className="px-2 text-gray-400">...</span>
              ) : (
                <Button
                  key={pageNumber}
                  variant={pagination.page === pageNumber ? 'default' : 'outline'}
                  className="h-8 w-8 p-0"
                  onClick={() => setPage(pageNumber as number)}
                >
                  {pageNumber}
                </Button>
              )
            ))}
          </div>

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={goToNextPage}
            disabled={!canNextPage}
          >
            <span className="sr-only">Ir a página siguiente</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={goToLastPage}
            disabled={!canNextPage}
          >
            <span className="sr-only">Ir a última página</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
