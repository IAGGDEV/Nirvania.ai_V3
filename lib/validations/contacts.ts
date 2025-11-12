import { z } from 'zod'
import { PHONE_PATTERNS } from '@/lib/types/contacts'

// Función para validar números de teléfono LATAM
const validateLatamPhone = (phone: string, country?: string) => {
  if (!phone) return true
  
  // Si hay país específico, validar con su patrón
  if (country && country in PHONE_PATTERNS) {
    return PHONE_PATTERNS[country as keyof typeof PHONE_PATTERNS].test(phone)
  }
  
  // Si no hay país, validar contra todos los patrones
  return Object.values(PHONE_PATTERNS).some(pattern => pattern.test(phone))
}

// Esquema para crear/editar contacto
export const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
    
  email: z.string()
    .email('El email no es válido')
    .toLowerCase(),
    
  phone: z.string()
    .optional()
    .refine((phone) => !phone || validateLatamPhone(phone), {
      message: 'Número de teléfono inválido. Incluye el código de país (ej: +52 para México)'
    }),
    
  role: z.string()
    .optional()
    .transform(val => val?.trim()),
    
  companyId: z.string().uuid().optional(),
  
  location: z.string()
    .optional()
    .transform(val => val?.trim()),
    
  country: z.enum([
    'MX', 'BR', 'CO', 'AR', 'CL', 'PE', 'VE', 'EC', 
    'BO', 'PY', 'UY', 'CR', 'PA', 'GT', 'HN', 'SV', 'NI'
  ]).optional(),
  
  linkedin: z.string()
    .optional()
    .refine((url) => {
      if (!url) return true
      try {
        const parsed = new URL(url)
        return parsed.hostname === 'linkedin.com' || parsed.hostname === 'www.linkedin.com'
      } catch {
        return false
      }
    }, {
      message: 'URL de LinkedIn inválida'
    }),
    
  whatsapp: z.string()
    .optional()
    .refine((phone) => !phone || validateLatamPhone(phone), {
      message: 'Número de WhatsApp inválido. Incluye el código de país'
    }),
    
  preferredLanguage: z.enum(['es', 'pt', 'en']).optional().default('es')
})

export type ContactFormData = z.infer<typeof contactFormSchema>

// Esquema para filtros
export const contactFilterSchema = z.object({
  field: z.string(),
  operator: z.enum([
    'equals', 'contains', 'startsWith', 'endsWith', 
    'isEmpty', 'isNotEmpty', 'greaterThan', 'lessThan'
  ]),
  value: z.string().optional()
})

export type ContactFilterData = z.infer<typeof contactFilterSchema>

// Esquema para ordenamiento
export const contactSortSchema = z.object({
  field: z.string(),
  direction: z.enum(['asc', 'desc'])
})

export type ContactSortData = z.infer<typeof contactSortSchema>

// Esquema para vistas
export const contactViewSchema = z.object({
  name: z.string()
    .min(1, 'El nombre de la vista es requerido')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
    
  type: z.enum(['table', 'kanban']).default('table'),
  
  columns: z.array(z.object({
    id: z.string(),
    label: z.string(),
    accessor: z.string(),
    visible: z.boolean(),
    sortable: z.boolean(),
    width: z.number().optional()
  })),
  
  filters: z.array(contactFilterSchema).optional(),
  sort: z.array(contactSortSchema).optional(),
  shared: z.boolean().default(false)
})

export type ContactViewData = z.infer<typeof contactViewSchema>

// Esquema para búsqueda
export const contactSearchSchema = z.object({
  query: z.string().optional(),
  filters: z.array(contactFilterSchema).optional(),
  sort: z.array(contactSortSchema).optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(10).max(100).default(25)
})

export type ContactSearchData = z.infer<typeof contactSearchSchema>

// Esquema para importación de CSV
export const contactImportSchema = z.array(
  z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    company: z.string().optional(),
    role: z.string().optional(),
    location: z.string().optional(),
    linkedin: z.string().optional(),
    whatsapp: z.string().optional()
  })
)

export type ContactImportData = z.infer<typeof contactImportSchema>




