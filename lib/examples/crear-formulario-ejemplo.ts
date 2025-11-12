/**
 * EJEMPLO: Cómo crear un formulario programáticamente
 * 
 * Este archivo muestra cómo crear formularios de ejemplo para testing
 */

import { createClient } from '@/lib/supabase/client'

/**
 * Crea un formulario de contacto básico
 */
export async function crearFormularioContacto(organizationId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('forms')
    .insert({
      organization_id: organizationId,
      title: 'Formulario de Contacto',
      description: 'Déjanos tus datos y nos pondremos en contacto contigo',
      status: 'published',
      
      // Campos del formulario
      fields: [
        {
          id: 'nombre',
          type: 'text',
          label: 'Nombre completo',
          placeholder: 'Juan Pérez',
          required: true,
          mappedTo: 'contact.name',
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email',
          placeholder: 'juan@ejemplo.com',
          required: true,
          mappedTo: 'contact.email',
        },
        {
          id: 'telefono',
          type: 'phone',
          label: 'Teléfono (WhatsApp)',
          placeholder: '+52 1234567890',
          required: false,
          mappedTo: 'contact.phone',
        },
        {
          id: 'empresa',
          type: 'text',
          label: 'Empresa',
          placeholder: 'Mi Empresa S.A.',
          required: false,
          mappedTo: 'contact.company',
        },
        {
          id: 'mensaje',
          type: 'textarea',
          label: 'Mensaje',
          placeholder: 'Cuéntanos en qué podemos ayudarte...',
          required: true,
          validation: {
            min: 10,
            max: 500,
            message: 'El mensaje debe tener entre 10 y 500 caracteres',
          },
        },
      ],
      
      // Estilos
      primary_color: '#0066FF',
      background_color: '#F3F4F6',
      logo_url: null,
      
      // Comportamiento
      auto_create_contact: true,
      submit_button_text: 'Enviar',
      success_message: '¡Gracias por contactarnos! Te responderemos pronto.',
      redirect_url: null,
      
      // Notificaciones
      send_notification_email: false,
      notification_email: null,
      webhook_url: null,
      
      // Métricas iniciales
      view_count: 0,
      submission_count: 0,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creando formulario:', error)
    return null
  }

  console.log('✅ Formulario creado:', data.id)
  console.log('🔗 Link público:', `/f/${data.id}`)
  
  return data
}

/**
 * Crea un formulario de registro a evento
 */
export async function crearFormularioEvento(organizationId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('forms')
    .insert({
      organization_id: organizationId,
      title: 'Registro a Webinar Gratuito',
      description: 'Regístrate para nuestro webinar sobre CRM para LATAM',
      status: 'published',
      
      fields: [
        {
          id: 'nombre',
          type: 'text',
          label: 'Nombre completo',
          required: true,
          mappedTo: 'contact.name',
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email corporativo',
          required: true,
          mappedTo: 'contact.email',
        },
        {
          id: 'telefono',
          type: 'phone',
          label: 'WhatsApp',
          required: true,
          mappedTo: 'contact.phone',
        },
        {
          id: 'cargo',
          type: 'text',
          label: 'Cargo',
          placeholder: 'Ej: Director de Ventas',
          required: true,
          mappedTo: 'contact.role',
        },
        {
          id: 'empresa',
          type: 'text',
          label: 'Empresa',
          required: true,
          mappedTo: 'contact.company',
        },
        {
          id: 'pais',
          type: 'select',
          label: 'País',
          required: true,
          options: [
            'México',
            'Brasil',
            'Colombia',
            'Argentina',
            'Chile',
            'Perú',
            'Ecuador',
            'Otro',
          ],
          mappedTo: 'contact.country',
        },
        {
          id: 'tamano_empresa',
          type: 'radio',
          label: 'Tamaño de tu empresa',
          required: true,
          options: [
            '1-10 empleados',
            '11-50 empleados',
            '51-200 empleados',
            '200+ empleados',
          ],
        },
        {
          id: 'intereses',
          type: 'checkbox',
          label: '¿Qué temas te interesan?',
          required: false,
          options: [
            'Automatización de ventas',
            'Gestión de leads',
            'Email marketing',
            'WhatsApp Business',
            'Analytics y reportes',
          ],
        },
        {
          id: 'acepta_terminos',
          type: 'checkbox',
          label: 'Acepto los términos y condiciones',
          required: true,
          options: ['Acepto recibir comunicaciones de Nirvania'],
        },
      ],
      
      primary_color: '#00B8D4',
      background_color: '#FFFFFF',
      submit_button_text: 'Registrarme Gratis',
      success_message: '¡Registrado! Te enviamos un email con los detalles.',
      
      auto_create_contact: true,
      send_notification_email: true,
      notification_email: 'eventos@tu-empresa.com',
    })
    .select()
    .single()

  if (error) {
    console.error('Error creando formulario:', error)
    return null
  }

  console.log('✅ Formulario de evento creado:', data.id)
  return data
}

/**
 * Crea un formulario de solicitud de demo
 */
export async function crearFormularioDemo(organizationId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('forms')
    .insert({
      organization_id: organizationId,
      title: 'Solicita una Demo Personalizada',
      description: 'Descubre cómo Nirvania puede transformar tu negocio',
      status: 'published',
      
      fields: [
        {
          id: 'nombre',
          type: 'text',
          label: 'Nombre',
          required: true,
          mappedTo: 'contact.name',
        },
        {
          id: 'apellido',
          type: 'text',
          label: 'Apellido',
          required: true,
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email de trabajo',
          required: true,
          mappedTo: 'contact.email',
        },
        {
          id: 'telefono',
          type: 'phone',
          label: 'Teléfono',
          required: true,
          mappedTo: 'contact.phone',
        },
        {
          id: 'empresa',
          type: 'text',
          label: 'Empresa',
          required: true,
          mappedTo: 'contact.company',
        },
        {
          id: 'sitio_web',
          type: 'text',
          label: 'Sitio web de tu empresa',
          placeholder: 'https://www.ejemplo.com',
          required: false,
        },
        {
          id: 'industria',
          type: 'select',
          label: 'Industria',
          required: true,
          options: [
            'Tecnología',
            'Retail',
            'Servicios',
            'Manufactura',
            'Salud',
            'Educación',
            'Otro',
          ],
        },
        {
          id: 'fecha_preferida',
          type: 'date',
          label: 'Fecha preferida para la demo',
          required: false,
        },
        {
          id: 'comentarios',
          type: 'textarea',
          label: 'Comentarios adicionales',
          placeholder: 'Cuéntanos sobre tus necesidades...',
          required: false,
        },
      ],
      
      primary_color: '#0066FF',
      background_color: '#F8FAFC',
      submit_button_text: 'Solicitar Demo',
      success_message: '¡Demo solicitada! Te contactaremos en menos de 24 horas.',
      redirect_url: 'https://tu-sitio.com/gracias',
      
      auto_create_contact: true,
      send_notification_email: true,
      notification_email: 'ventas@tu-empresa.com',
      webhook_url: 'https://hooks.zapier.com/hooks/catch/xxxxx/yyyyy',
    })
    .select()
    .single()

  if (error) {
    console.error('Error creando formulario:', error)
    return null
  }

  console.log('✅ Formulario de demo creado:', data.id)
  return data
}

/**
 * Ejemplo de uso desde una API route o script
 */
export async function crearFormulariosDeEjemplo() {
  // Obtener organization_id del usuario actual
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    console.error('Usuario no autenticado')
    return
  }

  // Obtener organización del usuario
  const { data: profile } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  if (!profile?.organization_id) {
    console.error('Usuario sin organización')
    return
  }

  const organizationId = profile.organization_id

  // Crear formularios de ejemplo
  console.log('📝 Creando formularios de ejemplo...\n')
  
  const contacto = await crearFormularioContacto(organizationId)
  const evento = await crearFormularioEvento(organizationId)
  const demo = await crearFormularioDemo(organizationId)

  console.log('\n✅ Formularios creados exitosamente!')
  console.log('\n📋 Links públicos:')
  if (contacto) console.log(`- Contacto: /f/${contacto.id}`)
  if (evento) console.log(`- Evento: /f/${evento.id}`)
  if (demo) console.log(`- Demo: /f/${demo.id}`)
}




