import { LoginForm } from '@/components/auth/login-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Iniciar Sesión | Nirvania.ai',
  description: 'Inicia sesión en tu cuenta de Nirvania CRM',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  )
}

