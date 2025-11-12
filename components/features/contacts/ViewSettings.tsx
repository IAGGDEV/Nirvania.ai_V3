'use client'

import { useState, useEffect } from 'react'
import { X, Eye, EyeOff, ChevronDown, Table2, Kanban, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { AVAILABLE_COLUMNS, SORT_OPTIONS, type ContactView } from '@/lib/types/views'
import { cn } from '@/lib/utils'

interface ViewSettingsProps {
  isOpen: boolean
  onClose: () => void
  currentView: ContactView | null
  onSave: (view: Partial<ContactView>) => Promise<void>
}

export function ViewSettings({ isOpen, onClose, currentView, onSave }: ViewSettingsProps) {
  const [viewName, setViewName] = useState('All Contacts')
  const [viewType, setViewType] = useState<'table' | 'kanban'>('table')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [visibleColumns, setVisibleColumns] = useState<string[]>([])
  const [isShared, setIsShared] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (currentView) {
      setViewName(currentView.name)
      setViewType(currentView.type)
      setSortBy(currentView.sort_by)
      setSortOrder(currentView.sort_order)
      setVisibleColumns(currentView.visible_columns || [])
      setIsShared(currentView.is_shared)
    }
  }, [currentView])

  const toggleColumn = (columnId: string) => {
    setVisibleColumns(prev => 
      prev.includes(columnId)
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave({
        name: viewName,
        type: viewType,
        sort_by: sortBy,
        sort_order: sortOrder,
        visible_columns: visibleColumns,
        is_shared: isShared,
      })
      onClose()
    } catch (error) {
      console.error('Error saving view:', error)
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  // Group columns by category
  const columnsByCategory = AVAILABLE_COLUMNS.reduce((acc, col) => {
    const category = col.category || 'basic'
    if (!acc[category]) acc[category] = []
    acc[category].push(col)
    return acc
  }, {} as Record<string, typeof AVAILABLE_COLUMNS>)

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-[400px] bg-white border-l border-gray-200 shadow-2xl overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
        <h2 className="text-lg font-semibold text-gray-900">View Settings</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="p-6 space-y-8">
        
        {/* View Name */}
        <div>
          <Label htmlFor="view-name" className="text-sm font-medium text-gray-900">
            Name
          </Label>
          <div className="mt-2 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              ⭐
            </span>
            <Input
              id="view-name"
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
              className="pl-10"
              placeholder="All Contacts"
            />
          </div>
        </div>

        {/* Type Selector */}
        <div>
          <Label className="text-sm font-medium text-gray-900 mb-3 block">
            Type
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setViewType('table')}
              className={cn(
                "flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all",
                viewType === 'table'
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <Table2 className={cn(
                "w-6 h-6",
                viewType === 'table' ? "text-blue-600" : "text-gray-400"
              )} />
              <span className={cn(
                "text-sm font-medium",
                viewType === 'table' ? "text-blue-900" : "text-gray-700"
              )}>
                Table View
              </span>
            </button>

            <button
              onClick={() => setViewType('kanban')}
              className={cn(
                "flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all",
                viewType === 'kanban'
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <Kanban className={cn(
                "w-6 h-6",
                viewType === 'kanban' ? "text-blue-600" : "text-gray-400"
              )} />
              <span className={cn(
                "text-sm font-medium",
                viewType === 'kanban' ? "text-blue-900" : "text-gray-700"
              )}>
                Kanban Board
              </span>
            </button>
          </div>
        </div>

        {/* Sort By */}
        <div>
          <Label className="text-sm font-medium text-gray-900 mb-3 block">
            Sort By:
          </Label>
          <div className="space-y-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <div className="flex gap-2">
              <button
                onClick={() => setSortOrder('asc')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors",
                  sortOrder === 'asc'
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                )}
              >
                <ArrowUp className="w-4 h-4" />
                Ascending
              </button>
              <button
                onClick={() => setSortOrder('desc')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors",
                  sortOrder === 'desc'
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                )}
              >
                <ArrowDown className="w-4 h-4" />
                Descending
              </button>
            </div>
          </div>
        </div>

        {/* Table Columns */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium text-gray-900">
              Table Columns
            </Label>
            <button
              onClick={() => setVisibleColumns(AVAILABLE_COLUMNS.map(c => c.id))}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Show All
            </button>
          </div>

          <div className="space-y-1 max-h-96 overflow-y-auto">
            {Object.entries(columnsByCategory).map(([category, columns]) => (
              <div key={category}>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-4 mb-2">
                  {category === 'basic' && '📋 Basic'}
                  {category === 'professional' && '💼 Professional'}
                  {category === 'location' && '📍 Location'}
                  {category === 'system' && '⚙️ System'}
                </div>
                {columns.map(column => {
                  const isVisible = visibleColumns.includes(column.id)
                  return (
                    <div
                      key={column.id}
                      onClick={() => toggleColumn(column.id)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors",
                        isVisible ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{column.icon}</span>
                        <span className={cn(
                          "text-sm font-medium",
                          isVisible ? "text-gray-900" : "text-gray-600"
                        )}>
                          {column.label}
                        </span>
                      </div>
                      <button className="p-1">
                        {isVisible ? (
                          <Eye className="w-4 h-4 text-blue-600" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          <div className="mt-3 text-xs text-gray-500">
            {visibleColumns.length} of {AVAILABLE_COLUMNS.length} columns visible
          </div>
        </div>

        {/* Share View */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <Label className="text-sm font-medium text-gray-900 block mb-1">
                Share view with organization
              </Label>
              <p className="text-xs text-gray-500">
                Allow others in your organization to see and edit this view
              </p>
            </div>
            <Switch
              checked={isShared}
              onCheckedChange={setIsShared}
            />
          </div>
        </div>

      </div>

      {/* Footer - Sticky Save Button */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  )
}

