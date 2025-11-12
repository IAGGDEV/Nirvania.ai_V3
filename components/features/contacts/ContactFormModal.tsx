'use client'

import { useState, useEffect } from 'react'
import { X, Loader2, User, Mail, Phone, Briefcase, MapPin, Tag, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import type { Contact, ContactFormData } from '@/lib/types/contacts'

interface ContactFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: ContactFormData) => Promise<void>
  contact?: Contact | null
  mode: 'create' | 'edit'
}

const LIFECYCLE_STAGES = [
  { value: 'lead', label: 'Lead' },
  { value: 'mql', label: 'MQL (Marketing Qualified)' },
  { value: 'sql', label: 'SQL (Sales Qualified)' },
  { value: 'opportunity', label: 'Opportunity' },
  { value: 'customer', label: 'Customer' },
]

const LATAM_COUNTRIES = [
  { value: 'MX', label: '🇲🇽 México' },
  { value: 'BR', label: '🇧🇷 Brasil' },
  { value: 'CO', label: '🇨🇴 Colombia' },
  { value: 'AR', label: '🇦🇷 Argentina' },
  { value: 'CL', label: '🇨🇱 Chile' },
  { value: 'PE', label: '🇵🇪 Perú' },
  { value: 'VE', label: '🇻🇪 Venezuela' },
  { value: 'EC', label: '🇪🇨 Ecuador' },
]

export function ContactFormModal({ isOpen, onClose, onSave, contact, mode }: ContactFormModalProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    mobile: '',
    whatsapp: '',
    job_title: '',
    department: '',
    seniority: '',
    lifecycle_stage: 'lead',
    lead_status: 'new',
    country: 'MX',
    city: '',
    state: '',
    street: '',
    postal_code: '',
    linkedin_url: '',
    twitter_url: '',
    source: 'manual',
    email_opt_in: true,
    whatsapp_opt_in: true,
  })
  
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'basic' | 'professional' | 'location'>('basic')

  useEffect(() => {
    if (contact && mode === 'edit') {
      setFormData({
        name: contact.name,
        email: contact.email || '',
        phone: contact.phone || '',
        mobile: contact.mobile || '',
        whatsapp: contact.whatsapp || '',
        job_title: contact.job_title || '',
        department: contact.department || '',
        seniority: contact.seniority || '',
        lifecycle_stage: contact.lifecycle_stage,
        lead_status: contact.lead_status,
        country: contact.country,
        city: contact.city || '',
        state: contact.state || '',
        street: contact.street || '',
        postal_code: contact.postal_code || '',
        linkedin_url: contact.linkedin_url || '',
        twitter_url: contact.twitter_url || '',
        source: contact.source || 'manual',
        email_opt_in: contact.email_opt_in,
        whatsapp_opt_in: contact.whatsapp_opt_in,
      })
    }
  }, [contact, mode])

  const handleChange = (field: keyof ContactFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Error saving contact:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'create' ? 'Crear Nuevo Contacto' : 'Editar Contacto'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {mode === 'create' ? 'Agrega un nuevo contacto a tu CRM' : 'Actualiza la información del contacto'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === 'basic'
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            Información Básica
          </button>
          <button
            onClick={() => setActiveTab('professional')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === 'professional'
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Briefcase className="w-4 h-4 inline mr-2" />
            Info Profesional
          </button>
          <button
            onClick={() => setActiveTab('location')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === 'location'
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MapPin className="w-4 h-4 inline mr-2" />
            Ubicación
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-220px)]">
            
            {/* Tab: Basic Info */}
            {activeTab === 'basic' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="col-span-2">
                    <Label htmlFor="name">
                      Nombre Completo <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Juan Pérez"
                      required
                      className="mt-2"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="juan@empresa.com"
                      className="mt-2"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="+52 55 1234 5678"
                      className="mt-2"
                    />
                  </div>

                  {/* Mobile */}
                  <div>
                    <Label htmlFor="mobile">Móvil</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => handleChange('mobile', e.target.value)}
                      placeholder="+52 55 8765 4321"
                      className="mt-2"
                    />
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => handleChange('whatsapp', e.target.value)}
                      placeholder="+52 55 1234 5678"
                      className="mt-2"
                    />
                  </div>

                  {/* Lifecycle Stage */}
                  <div>
                    <Label htmlFor="lifecycle_stage">Etapa del Lead</Label>
                    <select
                      id="lifecycle_stage"
                      value={formData.lifecycle_stage}
                      onChange={(e) => handleChange('lifecycle_stage', e.target.value)}
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {LIFECYCLE_STAGES.map(stage => (
                        <option key={stage.value} value={stage.value}>
                          {stage.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Lead Status */}
                  <div>
                    <Label htmlFor="lead_status">Estado</Label>
                    <select
                      id="lead_status"
                      value={formData.lead_status}
                      onChange={(e) => handleChange('lead_status', e.target.value)}
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="new">Nuevo</option>
                      <option value="contacted">Contactado</option>
                      <option value="qualified">Calificado</option>
                      <option value="unqualified">No Calificado</option>
                    </select>
                  </div>
                </div>

                {/* Communication Preferences */}
                <div className="pt-4 border-t border-gray-200">
                  <Label className="text-base font-semibold mb-3 block">Preferencias de Comunicación</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email_opt_in" className="text-sm">Acepta emails</Label>
                      <Switch
                        id="email_opt_in"
                        checked={formData.email_opt_in}
                        onCheckedChange={(checked) => handleChange('email_opt_in', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="whatsapp_opt_in" className="text-sm">Acepta WhatsApp</Label>
                      <Switch
                        id="whatsapp_opt_in"
                        checked={formData.whatsapp_opt_in}
                        onCheckedChange={(checked) => handleChange('whatsapp_opt_in', checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Professional Info */}
            {activeTab === 'professional' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Job Title */}
                  <div>
                    <Label htmlFor="job_title">Cargo/Puesto</Label>
                    <Input
                      id="job_title"
                      value={formData.job_title}
                      onChange={(e) => handleChange('job_title', e.target.value)}
                      placeholder="Director de Marketing"
                      className="mt-2"
                    />
                  </div>

                  {/* Department */}
                  <div>
                    <Label htmlFor="department">Departamento</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => handleChange('department', e.target.value)}
                      placeholder="Marketing"
                      className="mt-2"
                    />
                  </div>

                  {/* Seniority */}
                  <div className="col-span-2">
                    <Label htmlFor="seniority">Nivel de Senioridad</Label>
                    <select
                      id="seniority"
                      value={formData.seniority}
                      onChange={(e) => handleChange('seniority', e.target.value)}
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="junior">Junior</option>
                      <option value="mid">Mid-Level</option>
                      <option value="senior">Senior</option>
                      <option value="lead">Lead</option>
                      <option value="manager">Manager</option>
                      <option value="director">Director</option>
                      <option value="vp">VP</option>
                      <option value="c-level">C-Level</option>
                    </select>
                  </div>

                  {/* LinkedIn */}
                  <div className="col-span-2">
                    <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                    <Input
                      id="linkedin_url"
                      type="url"
                      value={formData.linkedin_url}
                      onChange={(e) => handleChange('linkedin_url', e.target.value)}
                      placeholder="https://linkedin.com/in/usuario"
                      className="mt-2"
                    />
                  </div>

                  {/* Twitter */}
                  <div className="col-span-2">
                    <Label htmlFor="twitter_url">Twitter/X URL</Label>
                    <Input
                      id="twitter_url"
                      type="url"
                      value={formData.twitter_url}
                      onChange={(e) => handleChange('twitter_url', e.target.value)}
                      placeholder="https://twitter.com/usuario"
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Location */}
            {activeTab === 'location' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Country */}
                  <div className="col-span-2">
                    <Label htmlFor="country">País</Label>
                    <select
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleChange('country', e.target.value)}
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {LATAM_COUNTRIES.map(country => (
                        <option key={country.value} value={country.value}>
                          {country.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City */}
                  <div>
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      placeholder="Ciudad de México"
                      className="mt-2"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <Label htmlFor="state">Estado/Provincia</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                      placeholder="CDMX"
                      className="mt-2"
                    />
                  </div>

                  {/* Street */}
                  <div className="col-span-2">
                    <Label htmlFor="street">Dirección</Label>
                    <Input
                      id="street"
                      value={formData.street}
                      onChange={(e) => handleChange('street', e.target.value)}
                      placeholder="Av. Reforma 123"
                      className="mt-2"
                    />
                  </div>

                  {/* Postal Code */}
                  <div>
                    <Label htmlFor="postal_code">Código Postal</Label>
                    <Input
                      id="postal_code"
                      value={formData.postal_code}
                      onChange={(e) => handleChange('postal_code', e.target.value)}
                      placeholder="06600"
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={loading || !formData.name}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {mode === 'create' ? 'Crear Contacto' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

