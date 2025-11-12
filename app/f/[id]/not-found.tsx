import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function FormNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Formulario No Encontrado
        </h1>
        <p className="text-gray-600 mb-6">
          Este formulario no existe o ya no está disponible.
        </p>
        <Button asChild>
          <Link href="/">Ir al Inicio</Link>
        </Button>
      </div>
    </div>
  )
}




