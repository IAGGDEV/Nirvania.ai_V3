'use client'

import { Sidebar } from './Sidebar'
import { ChatBar } from './ChatBar'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className={cn(
        "transition-all duration-300",
        "pl-[280px]", // Ajustar cuando sidebar esté colapsado
        "pb-32" // Espacio para el chat bar
      )}>
        <main className="min-h-screen">
          {children}
        </main>
      </div>

      {/* Chat Bar */}
      <ChatBar />
    </div>
  )
}

