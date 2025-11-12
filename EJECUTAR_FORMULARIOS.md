# 🚀 CÓMO VER LOS FORMULARIOS EN LOCALHOST

## ⚡ OPCIÓN 1: Ejecutar el proyecto completo

### **Paso 1: Iniciar el servidor**

```bash
cd nirvania
npm run dev
```

El servidor se iniciará en: **http://localhost:3000**

### **Paso 2: Crear un formulario de prueba**

Primero necesitas crear las tablas en Supabase. Ejecuta este SQL:

```sql
-- Tabla de formularios
CREATE TABLE IF NOT EXISTS forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  fields JSONB NOT NULL,
  status TEXT DEFAULT 'draft',
  
  primary_color TEXT DEFAULT '#0066FF',
  background_color TEXT DEFAULT '#F3F4F6',
  logo_url TEXT,
  
  auto_create_contact BOOLEAN DEFAULT true,
  submit_button_text TEXT DEFAULT 'Enviar',
  success_message TEXT,
  redirect_url TEXT,
  
  send_notification_email BOOLEAN DEFAULT false,
  notification_email TEXT,
  webhook_url TEXT,
  
  view_count INTEGER DEFAULT 0,
  submission_count INTEGER DEFAULT 0,
  last_submission_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de envíos
CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_id UUID REFERENCES forms(id) ON DELETE CASCADE,
  
  responses JSONB NOT NULL,
  
  contact_id UUID,
  contact_created BOOLEAN DEFAULT false,
  
  ip_address TEXT,
  user_agent TEXT,
  referer TEXT,
  
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para rendimiento
CREATE INDEX idx_form_submissions_form_id ON form_submissions(form_id);
CREATE INDEX idx_form_submissions_submitted_at ON form_submissions(submitted_at DESC);
```

### **Paso 3: Insertar un formulario de ejemplo**

```sql
INSERT INTO forms (
  title,
  description,
  status,
  fields,
  primary_color,
  background_color,
  submit_button_text,
  success_message,
  auto_create_contact
) VALUES (
  'Formulario de Contacto',
  'Déjanos tus datos y nos pondremos en contacto contigo',
  'published',
  '[
    {
      "id": "nombre",
      "type": "text",
      "label": "Nombre completo",
      "placeholder": "Juan Pérez",
      "required": true,
      "mappedTo": "contact.name"
    },
    {
      "id": "email",
      "type": "email",
      "label": "Email",
      "placeholder": "juan@ejemplo.com",
      "required": true,
      "mappedTo": "contact.email"
    },
    {
      "id": "telefono",
      "type": "phone",
      "label": "Teléfono (WhatsApp)",
      "placeholder": "+52 1234567890",
      "required": false,
      "mappedTo": "contact.phone"
    },
    {
      "id": "mensaje",
      "type": "textarea",
      "label": "Mensaje",
      "placeholder": "¿En qué podemos ayudarte?",
      "required": true
    }
  ]'::jsonb,
  '#0066FF',
  '#F3F4F6',
  'Enviar',
  '¡Gracias por contactarnos! Te responderemos pronto.',
  true
) RETURNING id;
```

**Guarda el ID que te devuelve** (ej: `abc123-def456-...`)

### **Paso 4: Abrir el formulario**

Abre en tu navegador:

```
http://localhost:3000/f/[EL-ID-QUE-COPIASTE]
```

Ejemplo:
```
http://localhost:3000/f/abc123-def456-789ghi
```

---

## ⚡ OPCIÓN 2: Ver preview HTML (Sin backend)

Abre el archivo: `preview-formulario-publico.html`

Este archivo tiene un formulario estático que puedes ver directamente en el navegador sin necesidad de servidor.

---

## 🎯 URLs DE LOCALHOST

Una vez que tengas el proyecto corriendo:

| URL | Qué hace |
|-----|----------|
| `http://localhost:3000` | Página principal |
| `http://localhost:3000/f/[form-id]` | Formulario público |
| `http://localhost:3000/forms` | Dashboard de formularios (si lo implementas) |

---

## 🔧 TROUBLESHOOTING

### "No se encuentra el formulario"
- Verifica que el ID sea correcto
- Verifica que el status sea 'published'
- Verifica que Supabase esté conectado

### "Error de conexión"
- Verifica que las variables de entorno estén en `.env.local`
- Verifica que Supabase esté corriendo
- Reinicia el servidor (`Ctrl+C` y `npm run dev`)

### "El formulario no se ve bonito"
- Verifica que TailwindCSS esté compilando
- Abre la consola del navegador (F12) para ver errores
- Limpia el caché del navegador

---

## 📱 PROBAR EN MÓVIL

Para ver el formulario en tu móvil en la misma red WiFi:

1. Obtén tu IP local:
   ```bash
   # Windows
   ipconfig
   # Busca "IPv4 Address"
   
   # Mac/Linux
   ifconfig
   ```

2. Abre en el móvil:
   ```
   http://[TU-IP]:3000/f/[form-id]
   ```
   
   Ejemplo:
   ```
   http://192.168.1.100:3000/f/abc123
   ```

---

¡Eso es todo! Ahora deberías poder ver tu formulario funcionando en localhost 🎉




