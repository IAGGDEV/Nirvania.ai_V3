'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactFormSchema, type ContactFormData } from '@/lib/validations/contacts'
import { useContactsStore } from '@/lib/stores/contacts-mock'
import { PHONE_PATTERNS } from '@/lib/types/contacts'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle } from 'lucide-react'

interface ContactCreateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contact?: ContactFormData & { id: string } // For edit mode
}

export function ContactCreateModal({ open, onOpenChange, contact }: ContactCreateModalProps) {
  const { createContact, updateContact } = useContactsStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const isEditMode = !!contact

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: contact || {
      name: '',
      email: '',
      phone: '',
      role: '',
      location: '',
      country: undefined,
      linkedin: '',
      whatsapp: '',
      preferredLanguage: 'es',
    },
  })

  const selectedCountry = watch('country')

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      if (isEditMode && contact?.id) {
        await updateContact(contact.id, data)
      } else {
        await createContact(data)
      }
      
      reset()
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar contacto')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getPhoneExample = (country?: string) => {
    const examples: Record<string, string> = {
      MX: '+52 1234567890',
      BR: '+55 11987654321',
      CO: '+57 3001234567',
      AR: '+54 1123456789',
      CL: '+56 912345678',
      PE: '+51 987654321',
    }
    return country && examples[country] ? examples[country] : '+52 1234567890'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Editar contacto' : 'Nuevo contacto'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Actualiza la información del contacto'
              : 'Completa la información para agregar un nuevo contacto'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre completo *</Label>
              <Input
                id="name"
                placeholder="Juan Pérez"
                {...register('name')}
                aria-invalid={errors.name ? 'true' : 'false'}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="juan@empresa.com"
                {...register('email')}
                aria-invalid={errors.email ? 'true' : 'false'}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Role */}
            <div className="grid gap-2">
              <Label htmlFor="role">Cargo</Label>
              <Input
                id="role"
                placeholder="Director de Ventas"
                {...register('role')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Phone */}
              <div className="grid gap-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={getPhoneExample(selectedCountry)}
                  {...register('phone')}
                  aria-invalid={errors.phone ? 'true' : 'false'}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              {/* WhatsApp */}
              <div className="grid gap-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder={getPhoneExample(selectedCountry)}
                  {...register('whatsapp')}
                  aria-invalid={errors.whatsapp ? 'true' : 'false'}
                />
                {errors.whatsapp && (
                  <p className="text-sm text-red-600">{errors.whatsapp.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Location */}
              <div className="grid gap-2">
                <Label htmlFor="location">Ciudad</Label>
                <Input
                  id="location"
                  placeholder="Ciudad de México"
                  {...register('location')}
                />
              </div>

              {/* Country */}
              <div className="grid gap-2">
                <Label htmlFor="country">País</Label>
                <Select 
                  id="country" 
                  {...register('country')}
                  onChange={(e) => setValue('country', e.target.value as any)}
                >
                  <option value="">Seleccionar país</option>
                  <option value="MX">México</option>
                  <option value="BR">Brasil</option>
                  <option value="CO">Colombia</option>
                  <option value="AR">Argentina</option>
                  <option value="CL">Chile</option>
                  <option value="PE">Perú</option>
                  <option value="VE">Venezuela</option>
                  <option value="EC">Ecuador</option>
                  <option value="BO">Bolivia</option>
                  <option value="PY">Paraguay</option>
                  <option value="UY">Uruguay</option>
                  <option value="CR">Costa Rica</option>
                  <option value="PA">Panamá</option>
                  <option value="GT">Guatemala</option>
                  <option value="HN">Honduras</option>
                  <option value="SV">El Salvador</option>
                  <option value="NI">Nicaragua</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* LinkedIn */}
              <div className="grid gap-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  placeholder="https://linkedin.com/in/juanperez"
                  {...register('linkedin')}
                  aria-invalid={errors.linkedin ? 'true' : 'false'}
                />
                {errors.linkedin && (
                  <p className="text-sm text-red-600">{errors.linkedin.message}</p>
                )}
              </div>

              {/* Preferred Language */}
              <div className="grid gap-2">
                <Label htmlFor="preferredLanguage">Idioma preferido</Label>
                <Select 
                  id="preferredLanguage" 
                  {...register('preferredLanguage')}
                  defaultValue="es"
                >
                  <option value="es">Español</option>
                  <option value="pt">Português</option>
                  <option value="en">English</option>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                isEditMode ? 'Actualizar' : 'Crear contacto'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
