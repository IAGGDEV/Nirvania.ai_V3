# 🚀 CÓMO VER TU PROYECTO NIRVANIA CRM

## OPCIÓN A: Preview Estático (RECOMENDADO)
1. Abre el archivo `preview.html` en tu navegador
2. Verás el diseño completo con datos de ejemplo
3. Ruta: `C:\Users\IAGG2\OneDrive\Nirvania.ai\Nirvania.ai_V3\nirvania\preview.html`

## OPCIÓN B: Servidor de Desarrollo
1. Abre PowerShell o Terminal
2. Navega al proyecto:
   ```
   cd C:\Users\IAGG2\OneDrive\Nirvania.ai\Nirvania.ai_V3\nirvania
   ```
3. Instala dependencias (si no lo has hecho):
   ```
   npm install
   ```
4. Inicia el servidor:
   ```
   npm run dev
   ```
5. Abre tu navegador en: http://localhost:3000

## ARCHIVOS PRINCIPALES PARA REVISAR:

### 📁 Componentes de UI:
- `components/layout/Sidebar.tsx` - Barra lateral
- `components/layout/ChatBar.tsx` - Chat inferior
- `components/features/contacts/ContactsTable.tsx` - Tabla de contactos
- `components/features/contacts/ContactCreateModal.tsx` - Modal crear/editar

### 📁 Páginas:
- `app/(dashboard)/contacts/page.tsx` - Página de contactos
- `app/(dashboard)/companies/page.tsx` - Página de empresas
- `app/(dashboard)/deals/page.tsx` - Página de tratos
- `app/(dashboard)/agents/page.tsx` - Página de agentes

### 📁 Estilos:
- `app/globals.css` - Estilos globales
- `tailwind.config.ts` - Configuración de colores (azul #0066FF)

### 📁 Tipos y Validaciones:
- `lib/types/contacts/index.ts` - Tipos TypeScript
- `lib/validations/contacts.ts` - Validaciones Zod (teléfonos LATAM)
- `lib/stores/contacts-mock.ts` - Store con datos de ejemplo

## CARACTERÍSTICAS IMPLEMENTADAS:

✅ Sidebar con navegación completa
✅ Chat bar inferior omnipresente
✅ Tabla de contactos con:
   - Búsqueda en tiempo real
   - Paginación
   - Selección múltiple
   - Acciones (WhatsApp, email, llamar)
✅ Modal para crear/editar contactos
✅ Validación de teléfonos LATAM (17 países)
✅ Soporte multi-idioma (es/pt/en)
✅ Diseño responsive
✅ Tema azul (#0066FF)

## DATOS DE EJEMPLO:

El proyecto incluye 3 contactos de ejemplo:
1. María García - México 🇲🇽
2. Carlos Rodríguez - Brasil 🇧🇷
3. Ana Martínez - Colombia 🇨🇴

## SI TIENES PROBLEMAS:

### Error al iniciar el servidor:
```bash
# Opción 1: Limpiar e reinstalar
rm -rf node_modules package-lock.json
npm install

# Opción 2: Usar el preview.html
# Es la forma más rápida de ver el diseño
```

### Puerto 3000 ocupado:
```bash
# Usar otro puerto
npm run dev -- -p 3001
```

## PRÓXIMOS PASOS:

1. **Revisar el diseño** en preview.html
2. **Hacer correcciones** que necesites
3. **Configurar Supabase** cuando tengas las credenciales
4. **Desplegar en Vercel** con tu dominio nirvaniaai.com

---

¿Necesitas ayuda con algo específico? ¡Estoy aquí para ayudarte!




