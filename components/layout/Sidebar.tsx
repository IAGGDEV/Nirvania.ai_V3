'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home,
  Users,
  Building2,
  Briefcase,
  Bot,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
}

const navItems: NavItem[] = [
  { label: 'Inicio', icon: Home, href: '/' },
  { label: 'Contactos', icon: Users, href: '/contacts' },
  { label: 'Empresas', icon: Building2, href: '/companies' },
  { label: 'Tratos', icon: Briefcase, href: '/deals' },
  { label: 'Agentes', icon: Bot, href: '/agents' },
  { label: 'Formularios', icon: FileText, href: '/forms' },
  { label: 'Configuración', icon: Settings, href: '/settings' },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300",
        isCollapsed ? "w-[70px]" : "w-[280px]"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b">
          <div className={cn("transition-opacity", isCollapsed && "opacity-0")}>
            <h1 className="text-2xl font-bold text-primary-600">Nirvania</h1>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  "hover:bg-gray-100",
                  isActive && "bg-primary-50 text-primary-600 hover:bg-primary-100 border-l-4 border-primary-600 -ml-1 pl-2",
                  !isActive && "text-gray-700",
                  isCollapsed && "justify-center"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="border-t p-4">
          <div className={cn(
            "flex items-center gap-3 px-3 py-2",
            isCollapsed && "justify-center"
          )}>
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-primary-600">U</span>
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <p className="text-sm font-medium text-gray-900">Usuario</p>
                <p className="text-xs text-gray-500">usuario@empresa.com</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}

