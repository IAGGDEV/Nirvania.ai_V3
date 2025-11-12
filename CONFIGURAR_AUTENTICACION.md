# 🔐 CONFIGURAR AUTENTICACIÓN - PASO A PASO

## ✅ LO QUE ACABAMOS DE CREAR

Has creado:
- ✅ **Componentes de Login y Signup**
- ✅ **Páginas de autenticación** (`/auth/login`, `/auth/register`)
- ✅ **Middleware de protección** (rutas protegidas automáticamente)
- ✅ **Callback handler** para OAuth
- ✅ **Logout button** en el sidebar
- ✅ **Database schema** completo con RLS

---

## 📋 PASO 1: EJECUTAR MIGRACIONES EN SUPABASE (5 min)

### Opción A: Dashboard de Supabase (Más fácil)

1. Ve a: https://supabase.com/dashboard/project/svpgfoxzrsrxqpwnbeue/sql/new

2. Ejecuta el Schema Principal:
   - Abre: `supabase/migrations/001_initial_schema.sql`
   - Copia TODO el contenido (Ctrl+A → Ctrl+C)
   - Pega en el SQL Editor
   - Click **"Run"** (o Ctrl+Enter)
   - Espera 10 segundos
   - ✅ Deberías ver: "Success. No rows returned"

3. Ejecuta el Seed Data:
   - Abre: `supabase/migrations/002_seed_data.sql`
   - Copia TODO
   - Pega en el SQL Editor (reemplaza el anterior)
   - Click **"Run"**
   - ✅ "Success"

4. Verificar que funcionó:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Deberías ver **15 tablas** ✅

---

## 🔧 PASO 2: CONFIGURAR SUPABASE AUTH (10 min)

### A) Configurar URLs de Redirección

1. Ve a: https://supabase.com/dashboard/project/svpgfoxzrsrxqpwnbeue/auth/url-configuration

2. Agrega estas URLs en **"Redirect URLs"**:
```
http://localhost:3000/auth/callback
https://tu-proyecto.vercel.app/auth/callback
```

3. Configurar **Site URL**:
```
http://localhost:3000
```

4. Click **"Save"**

### B) Configurar Email Templates (Opcional pero recomendado)

1. Ve a: https://supabase.com/dashboard/project/svpgfoxzrsrxqpwnbeue/auth/templates

2. Personaliza los templates de:
   - **Confirm Signup** (Email de verificación)
   - **Magic Link** (Login sin contraseña)
   - **Change Email** (Cambio de email)
   - **Reset Password** (Recuperar contraseña)

3. Puedes usar variables como:
   - `{{ .ConfirmationURL }}` - Link de confirmación
   - `{{ .SiteURL }}` - URL de tu app
   - `{{ .Email }}` - Email del usuario

### C) Configurar Google OAuth (Opcional - 5 min extra)

Si quieres habilitar "Continuar con Google":

1. Ve a: https://supabase.com/dashboard/project/svpgfoxzrsrxqpwnbeue/auth/providers

2. Encuentra **"Google"** → Click **"Edit"**

3. Activa **"Enable Sign in with Google"**

4. Necesitarás:
   - **Client ID** de Google Cloud Console
   - **Client Secret** de Google Cloud Console

5. En Google Cloud Console:
   - Ve a: https://console.cloud.google.com/apis/credentials
   - Crea un **"OAuth 2.0 Client ID"**
   - **Authorized redirect URIs:**
     ```
     https://svpgfoxzrsrxqpwnbeue.supabase.co/auth/v1/callback
     ```
   - Copia Client ID y Secret
   - Pégalos en Supabase

6. Click **"Save"**

---

## 🎯 PASO 3: CONFIGURAR POLICIES DE EMAIL (Importante)

Por defecto, Supabase requiere confirmación de email. Para desarrollo puedes desactivarlo:

1. Ve a: https://supabase.com/dashboard/project/svpgfoxzrsrxqpwnbeue/auth/policies

2. Encuentra **"Enable email confirmations"**

3. Para desarrollo: **Desactiva** esta opción (para poder probar sin confirmar emails)

4. Para producción: **Activa** esta opción (seguridad)

---

## 🧪 PASO 4: PROBAR LA AUTENTICACIÓN

### Probar Signup (Registro)

1. Inicia el servidor:
```bash
cd nirvania
npm run dev
```

2. Ve a: http://localhost:3000/auth/register

3. Llena el formulario:
   - Nombre: Tu nombre
   - Email: test@ejemplo.com
   - Organización: Mi Empresa
   - Contraseña: test123

4. Click **"Crear cuenta"**

5. Si todo funciona:
   - ✅ Deberías ver mensaje de éxito
   - ✅ Se crea automáticamente:
     - Una organización
     - Tu perfil de usuario
     - Pipeline stages por defecto
     - Tags por defecto
   - ✅ Redirección al dashboard

### Probar Login

1. Ve a: http://localhost:3000/auth/login

2. Ingresa:
   - Email: test@ejemplo.com
   - Contraseña: test123

3. Click **"Iniciar Sesión"**

4. ✅ Deberías estar en el dashboard

### Probar Protección de Rutas

1. Cierra sesión (botón en el sidebar)

2. Intenta ir a: http://localhost:3000/contacts

3. ✅ Deberías ser redirigido a `/auth/login`

4. Después de login, ✅ vuelves a `/contacts`

### Probar Google OAuth (si lo configuraste)

1. En login o register, click **"Continuar con Google"**

2. Autoriza la app

3. ✅ Deberías estar logueado automáticamente

---

## 🔍 VERIFICAR EN SUPABASE

### Ver usuarios creados

1. Ve a: https://supabase.com/dashboard/project/svpgfoxzrsrxqpwnbeue/auth/users

2. Deberías ver tu usuario de prueba

### Ver datos en las tablas

1. Ve a: https://supabase.com/dashboard/project/svpgfoxzrsrxqpwnbeue/editor

2. Click en la tabla **"users"** → Deberías ver tu perfil

3. Click en **"organizations"** → Deberías ver tu organización

4. Click en **"pipeline_stages"** → Deberías ver 6 stages

5. Click en **"tags"** → Deberías ver 6 tags

✅ **Si ves todo esto, ¡FUNCIONA PERFECTO!**

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "Invalid login credentials"
- Verifica que el email y contraseña sean correctos
- Verifica que el usuario existe en Auth → Users

### Error: "Email not confirmed"
- Si confirmaciones están activas, revisa tu email
- O desactiva confirmaciones en Auth → Policies

### Error: "Organization not found"
- Verifica que el trigger `on_auth_user_created` se ejecutó
- Ve a SQL Editor y ejecuta:
```sql
SELECT * FROM organizations;
SELECT * FROM users;
```

### Error: "User unauthorized"
- Verifica que las RLS policies se crearon:
```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

### OAuth no funciona
- Verifica las Redirect URLs en Supabase
- Verifica que Google OAuth esté configurado correctamente
- Revisa la consola del navegador (F12) para errores

---

## 📊 ESTRUCTURA CREADA

```
app/
├── (auth)/
│   ├── layout.tsx                 ✅ Layout de auth
│   ├── login/
│   │   └── page.tsx               ✅ Página de login
│   └── register/
│       └── page.tsx               ✅ Página de registro
├── auth/
│   ├── callback/
│   │   └── route.ts               ✅ Handler OAuth
│   └── signout/
│       └── route.ts               ✅ Logout endpoint
└── (dashboard)/
    └── layout.tsx                 ✅ Protección con auth check

components/
└── auth/
    ├── login-form.tsx             ✅ Formulario de login
    ├── signup-form.tsx            ✅ Formulario de registro
    └── logout-button.tsx          ✅ Botón de logout

middleware.ts                      ✅ Protección de rutas global
```

---

## 🎉 RESULTADO FINAL

Cuando todo esté configurado:

✅ **Login/Signup funcional**
✅ **OAuth con Google** (opcional)
✅ **Rutas protegidas automáticamente**
✅ **Multi-tenancy** (cada usuario en su organización)
✅ **RLS activo** (seguridad de datos)
✅ **Auto-creación** de organización y datos iniciales
✅ **Sesiones persistentes** con cookies
✅ **Logout funcional**

---

## 📞 COMANDOS RÁPIDOS

```bash
# Iniciar desarrollo
cd nirvania
npm run dev

# Abrir login
start http://localhost:3000/auth/login

# Abrir register
start http://localhost:3000/auth/register

# Ver usuarios en Supabase
start https://supabase.com/dashboard/project/svpgfoxzrsrxqpwnbeue/auth/users
```

---

## ✨ PRÓXIMOS PASOS

Una vez que la autenticación funcione:

1. ✅ **CRUD de Contactos** con datos reales
2. ✅ **Import/Export** de contactos
3. ✅ **Sistema de Agentes** con ejecución real
4. ✅ **Pipeline de Deals** visual

---

**¡Listo para probar!** Ejecuta `npm run dev` y ve a http://localhost:3000/auth/register 🚀

