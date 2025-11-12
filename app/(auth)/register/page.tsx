import { SignupForm } from '@/components/auth/signup-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Crear Cuenta | Nirvania.ai',
  description: 'Crea tu cuenta gratuita de Nirvania CRM',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <SignupForm />
    </div>
  )
}

