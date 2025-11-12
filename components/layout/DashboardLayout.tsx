'use client'

import { Sidebar } from './Sidebar'
import { ChatBar } from './ChatBar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="pl-[72px] pb-24">
        <main className="min-h-screen">
          {children}
        </main>
      </div>

      {/* Chat Bar */}
      <ChatBar />
    </div>
  )
}




