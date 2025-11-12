# ⚡ INICIO RÁPIDO - NIRVANIA.AI

## 🚀 TODO LO QUE NECESITAS PARA EMPEZAR

---

## 📋 CHECKLIST PRE-INICIO

- [ ] ✅ Base de datos configurada en Supabase
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ Dependencias instaladas
- [ ] ✅ Servidor de desarrollo corriendo

---

## 🔥 PASO 1: EJECUTAR MIGRACIONES (5 min)

### Ya tienes 3 ventanas abiertas:

1. **SQL Editor de Supabase** - Para ejecutar migraciones
2. **001_initial_schema.sql** - El schema completo
3. **CONFIGURAR_AUTENTICACION.md** - Guía paso a paso

### Ejecuta esto:

1. Copia TODO el contenido de `001_initial_schema.sql`
2. Pega en el SQL Editor
3. Click **"Run"** (botón verde)
4. ✅ Espera "Success"

5. Abre `002_seed_data.sql` (en la misma carpeta)
6. Copia TODO
7. Pega en el SQL Editor
8. Click **"Run"**
9. ✅ "Success"

---

## 🔧 PASO 2: CONFIGURAR SUPABASE AUTH (3 min)

1. Ve a: https://supabase.com/dashboard/project/svpgfoxzrsrxqpwnbeue/auth/url-configuration

2. En **"Redirect URLs"** agrega:
```
http://localhost:3000/auth/callback
```

3. En **"Site URL"** pon:
```
http://localhost:3000
```

4. Click **"Save"**

---

## 🎯 PASO 3: DESACTIVAR CONFIRMACIÓN DE EMAIL (Para desarrollo)

1. Ve a: https://supabase.com/dashboard/project/svpgfoxzrsrxqpwnbeue/auth/policies

2. Desactiva **"Enable email confirmations"**

3. Click **"Save"**

💡 Esto te permitirá crear cuentas sin confirmar email durante desarrollo

---

## 🚀 PASO 4: INICIAR LA APP

```bash
cd nirvania
npm run dev
```

Espera a que aparezca:
```
✓ Ready in 3.2s
○ Local: http://localhost:3000
```

---

## 🧪 PASO 5: PROBAR LA APP

### 1. Abrir la app

Ve a: http://localhost:3000

✅ Deberías ser redirigido a `/auth/login`

### 2. Crear una cuenta

- Click en **"Crear cuenta gratis"**
- Llena el formulario:
  - Nombre: Tu Nombre
  - Email: test@ejemplo.com
  - Organización: Mi Empresa (opcional)
  - Contraseña: test123
  - Confirmar: test123
- Click **"Crear cuenta"**
- ✅ Mensaje de éxito
- ✅ Redirección al dashboard

### 3. Explorar el dashboard

Ahora deberías ver:
- ✅ Sidebar con navegación
- ✅ Tu nombre en el sidebar (abajo)
- ✅ Dashboard con estadísticas
- ✅ ChatBar en la parte inferior

### 4. Probar navegación

- Click en **Contacts** → Ver tabla de contactos (vacía)
- Click en **Agents** → Ver agentes disponibles
- Click en **Forms** → Ver formularios
- Click en **Settings** → Configuración

### 5. Probar logout

- Click en el botón de **Logout** (abajo del sidebar)
- ✅ Redirigido a login
- Vuelve a iniciar sesión

---

## ✅ SI TODO FUNCIONÓ

¡Felicidades! 🎉 Ya tienes:

✅ **Autenticación completa**
✅ **Base de datos lista**
✅ **Multi-tenancy activo**
✅ **Rutas protegidas**
✅ **Usuario y organización creados automáticamente**

---

## 🔜 PRÓXIMOS PASOS

Ahora podemos desarrollar:

### Opción A: CRUD de Contactos Real
- Crear contactos desde la UI
- Editar y eliminar
- Búsqueda y filtros
- Import CSV
- **Tiempo: 30-45 min**

### Opción B: Sistema de Agentes Funcional
- Crear Skills con instrucciones
- Ejecutar con Claude AI
- Ver resultados en tiempo real
- **Tiempo: 45-60 min**

### Opción C: Pipeline de Deals
- Vista Kanban
- Drag & drop
- Métricas
- **Tiempo: 45 min**

---

## 🐛 PROBLEMAS COMUNES

### "Connection refused localhost:3000"
```bash
# Verifica que el servidor esté corriendo
cd nirvania
npm run dev
```

### "Invalid API credentials"
Verifica tu `.env.local` en la carpeta `nirvania`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://svpgfoxzrsrxqpwnbeue.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
...
```

### "Tables do not exist"
Ejecuta las migraciones en el SQL Editor de Supabase

### "User not found after signup"
Verifica que el trigger `on_auth_user_created` se ejecutó correctamente

---

**¿Listo?** Ejecuta:
```bash
npm run dev
```

Y ve a: http://localhost:3000 🚀

