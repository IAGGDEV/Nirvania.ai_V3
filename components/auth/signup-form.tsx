'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export function SignupForm() {
  const router = useRouter()
  const supabase = createClient()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const validateForm = (): string | null => {
    if (formData.password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres'
    }
    
    if (formData.password !== formData.confirmPassword) {
      return 'Las contraseñas no coinciden'
    }
    
    if (formData.name.trim().length < 2) {
      return 'El nombre debe tener al menos 2 caracteres'
    }
    
    return null
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    // Validar formulario
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      setLoading(false)
      return
    }

    try {
      // Crear cuenta con Supabase Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            name: formData.name.trim(),
            organization_name: formData.organizationName.trim() || `${formData.name}'s Organization`,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      if (data.user) {
        // Verificar si necesita confirmar email
        if (data.user.identities && data.user.identities.length === 0) {
          setError('Este email ya está registrado. Por favor inicia sesión.')
          setLoading(false)
          return
        }

        // Success!
        setSuccess(true)
        
        // Si el email está confirmado automáticamente, redirigir
        if (data.session) {
          setTimeout(() => {
            router.push('/')
            router.refresh()
          }, 1500)
        }
      }
    } catch (err: any) {
      setError(err.message || 'Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        setError(error.message)
        setLoading(false)
      }
    } catch (err: any) {
      setError(err.message || 'Error al registrarse con Google')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            ¡Cuenta creada exitosamente!
          </h2>
          <p className="text-gray-600 mb-6">
            Revisa tu email para confirmar tu cuenta.
            <br />
            Te hemos enviado un link de verificación.
          </p>
          <Button
            onClick={() => router.push('/auth/login')}
            variant="outline"
            className="w-full"
          >
            Ir al Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg mb-6">
          <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Crea tu cuenta</h1>
        <p className="mt-2 text-sm text-gray-600">
          Comienza gratis, sin tarjeta de crédito
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* OAuth Buttons */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignup}
          disabled={loading}
          size="lg"
        >
          <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continuar con Google
        </Button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-gray-500">O con email</span>
        </div>
      </div>

      {/* Signup Form */}
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Nombre completo
          </Label>
          <div className="mt-2">
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Tu nombre"
              required
              disabled={loading}
              className="w-full"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <div className="mt-2">
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
              disabled={loading}
              className="w-full"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="organizationName" className="text-sm font-medium text-gray-700">
            Nombre de tu organización <span className="text-gray-400 font-normal">(opcional)</span>
          </Label>
          <div className="mt-2">
            <Input
              id="organizationName"
              name="organizationName"
              type="text"
              value={formData.organizationName}
              onChange={handleChange}
              placeholder="Mi Empresa"
              disabled={loading}
              className="w-full"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Contraseña
          </Label>
          <div className="mt-2">
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              required
              disabled={loading}
              className="w-full"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
            Confirmar contraseña
          </Label>
          <div className="mt-2">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              required
              disabled={loading}
              className="w-full"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700" 
          disabled={loading}
          size="lg"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Crear cuenta
        </Button>
      </form>

      {/* Terms */}
      <p className="text-center text-xs text-gray-500">
        Al crear una cuenta, aceptas nuestros{' '}
        <Link href="/legal/terms" className="text-blue-600 hover:underline">
          Términos de Servicio
        </Link>{' '}
        y{' '}
        <Link href="/legal/privacy" className="text-blue-600 hover:underline">
          Política de Privacidad
        </Link>
      </p>

      {/* Login link */}
      <p className="text-center text-sm text-gray-600">
        ¿Ya tienes una cuenta?{' '}
        <Link 
          href="/auth/login" 
          className="font-semibold text-blue-600 hover:text-blue-500"
        >
          Iniciar sesión
        </Link>
      </p>
    </div>
  )
}

