'use client'

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
  Zap,
  User,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { LogoutButton } from '@/components/auth/logout-button'

interface NavItem {
  label: string
  icon: React.ComponentType<{ className?: string; size?: number }>
  href: string
}

const navItems: NavItem[] = [
  { label: 'Home', icon: Home, href: '/' },
  { label: 'Contacts', icon: Users, href: '/contacts' },
  { label: 'Companies', icon: Building2, href: '/companies' },
  { label: 'Deals', icon: Briefcase, href: '/deals' },
  { label: 'Agents', icon: Bot, href: '/agents' },
]

const bottomNavItems: NavItem[] = [
  { label: 'Forms', icon: FileText, href: '/forms' },
  { label: 'Settings', icon: Settings, href: '/settings' },
]

interface SidebarProps {
  user?: any
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[72px] bg-white border-r border-gray-100">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-[72px] items-center justify-center border-b border-gray-100">
          <Link href="/" className="group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
              <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center justify-center h-12 w-12 rounded-lg transition-all group",
                  isActive 
                    ? "bg-blue-50 text-blue-600" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
                title={item.label}
              >
                <Icon size={20} strokeWidth={2} />
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
                )}

                {/* Tooltip */}
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                  {item.label}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="px-3 py-3 flex flex-col gap-2 border-t border-gray-100">
          {/* User Profile */}
          {user && (
            <div className="relative group mb-2">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gray-100 text-gray-600">
                {user.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt={user.name}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                ) : (
                  <User size={20} strokeWidth={2} />
                )}
              </div>
              
              {/* Tooltip con info de usuario */}
              <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                <div className="font-medium">{user.name}</div>
                <div className="text-gray-400 text-xs">{user.email}</div>
              </div>
            </div>
          )}

          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center justify-center h-12 w-12 rounded-lg transition-all group",
                  isActive 
                    ? "bg-blue-50 text-blue-600" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
                title={item.label}
              >
                <Icon size={20} strokeWidth={2} />
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
                )}

                {/* Tooltip */}
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                  {item.label}
                </div>
              </Link>
            )
          })}

          {/* Logout Button */}
          <LogoutButton className="relative flex items-center justify-center h-12 w-12 rounded-lg transition-all group text-gray-500 hover:bg-gray-50 hover:text-red-600">
            <LogOut size={20} strokeWidth={2} />
            
            {/* Tooltip */}
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              Cerrar Sesión
            </div>
          </LogoutButton>
        </div>
      </div>
    </aside>
  )
}




