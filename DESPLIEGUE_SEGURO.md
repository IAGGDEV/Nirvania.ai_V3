# 🛡️ GUÍA DE DESPLIEGUE SEGURO - NIRVANIA CRM

## ⚠️ IMPORTANTE: Tu dominio nirvaniaai.com NO se tocará hasta que tú lo apruebes

---

## ESTRATEGIA RECOMENDADA: 3 FASES

### FASE 1: Despliegue en Vercel SIN dominio personalizado (SEGURO)

```bash
# 1. Inicializar Git (si no está)
git init
git add .
git commit -m "Initial commit - Nirvania CRM"

# 2. Crear repositorio en GitHub
# Ve a https://github.com/new
# Crea repo "nirvania-crm"

# 3. Conectar y push
git remote add origin https://github.com/TU-USUARIO/nirvania-crm.git
git branch -M main
git push -u origin main

# 4. Desplegar en Vercel
npm i -g vercel
vercel
```

**Resultado:**
- ✅ Tu app estará en: `nirvania-abc123.vercel.app`
- ✅ Tu dominio `nirvaniaai.com` NO se toca
- ✅ Puedes probar todo sin riesgos

---

### FASE 2: Subdominio de desarrollo (OPCIONAL)

Una vez que veas que funciona en Vercel, puedes agregar un subdominio:

```
dev.nirvaniaai.com → Apunta a tu despliegue de Vercel
```

**Configuración DNS (en tu proveedor de dominio):**
```
Type: CNAME
Name: dev
Value: cname.vercel-dns.com
TTL: 3600
```

**Resultado:**
- ✅ Accedes desde `dev.nirvaniaai.com`
- ✅ Tu dominio principal `nirvaniaai.com` sigue intacto
- ✅ Solo el subdominio apunta a Vercel

---

### FASE 3: Producción en dominio principal (CUANDO ESTÉS LISTO)

**Solo cuando digas "OK, todo funciona perfecto"**, hacemos esto:

En Vercel Dashboard:
1. Settings → Domains
2. Add Domain: `nirvaniaai.com`
3. Vercel te dará 2 opciones:

**Opción A: DNS Records** (Más control)
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Opción B: Nameservers** (Más fácil)
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

---

## 🔐 PROTECCIONES DE SEGURIDAD

### 1. **Respaldo del DNS actual**
Antes de cambiar NADA, guarda tu configuración DNS actual:
- Toma screenshots de todos tus records
- Anota los valores actuales
- Guarda en un archivo seguro

### 2. **Ambientes separados en Vercel**
```
main branch     → Production (nirvaniaai.com)
dev branch      → Preview (dev.nirvaniaai.com)
feature/* branch → Preview URLs automáticos
```

### 3. **Rollback instantáneo**
Si algo falla:
```bash
# En Vercel Dashboard
Deployments → Previous Deployment → Promote to Production
```
O simplemente:
```bash
# Revierte DNS a configuración anterior
# Tu dominio vuelve a lo que tenías antes
```

---

## 📋 CHECKLIST ANTES DE TOCAR TU DOMINIO

- [ ] App funciona perfectamente en `nirvania.vercel.app`
- [ ] Todos los módulos probados (Contactos, Agentes, Forms)
- [ ] Variables de entorno configuradas (Supabase, Claude API)
- [ ] SSL certificate activo (Vercel lo hace automático)
- [ ] Respaldo de DNS actual guardado
- [ ] Equipo aprueba el diseño y funcionalidad
- [ ] Tienes acceso al panel de control de tu dominio

---

## 🚀 PLAN RECOMENDADO PARA TI

### Paso 1: Desplegar SIN tocar tu dominio (HOY)
```bash
cd C:\Users\IAGG2\OneDrive\Nirvania.ai\Nirvania.ai_V3\nirvania
vercel
```

Esto te dará: `nirvania-xyz.vercel.app`

### Paso 2: Prueba TODO en ese dominio temporal (1-2 días)
- Revisa cada módulo
- Haz ajustes necesarios
- Invita a tu equipo a revisar
- Asegúrate que TODO funcione

### Paso 3: Usa subdominio primero (OPCIONAL)
```
staging.nirvaniaai.com → Para testing final
```

### Paso 4: Cuando digas "OK perfecto" (TÚ DECIDES CUÁNDO)
Entonces sí conectamos `nirvaniaai.com`

---

## 💡 ALTERNATIVA MUY SEGURA

**Usa un dominio diferente para staging:**
- `nirvania-staging.com` (comprar uno barato)
- `nirvania-dev.com`
- O usar el de Vercel gratis

**Mantén `nirvaniaai.com` sin tocar** hasta el lanzamiento oficial.

---

## ⚡ COMANDOS SEGUROS

```bash
# 1. Crear repo en GitHub (manual en web)

# 2. Push código
git init
git add .
git commit -m "Nirvania CRM initial"
git remote add origin https://github.com/TU-USER/nirvania.git
git push -u origin main

# 3. Desplegar en Vercel (SIN dominio custom)
vercel

# 4. Deploy a producción en Vercel (aún SIN tu dominio)
vercel --prod
```

**Tu dominio NO se toca hasta que TÚ lo configures manualmente.**

---

## ❓ PREGUNTAS FRECUENTES

**P: ¿Si despliego en Vercel, mi dominio se afecta?**
R: NO. Vercel te da su propio dominio (.vercel.app). Tu dominio solo se conecta si TÚ lo agregas manualmente.

**P: ¿Puedo revertir si algo sale mal?**
R: SÍ. Vercel guarda todos los deployments. Rollback en 1 click.

**P: ¿Cuánto tiempo toma cambiar DNS?**
R: Entre 5 minutos y 48 horas (usualmente 1-2 horas).

**P: ¿Puedo tener dev.nirvaniaai.com y nirvaniaai.com separados?**
R: SÍ. Perfectamente posible y recomendado.

---

## 🎯 MI RECOMENDACIÓN FINAL

**HOY:**
1. Despliega en Vercel → obtienes `nirvania.vercel.app`
2. Prueba TODO en ese dominio temporal
3. Tu `nirvaniaai.com` sigue intacto

**CUANDO ESTÉS 100% SEGURO:**
4. Conectas `nirvaniaai.com` (tú decides cuándo)

**¿Te parece bien este plan?** Es completamente seguro y tu dominio no se toca hasta que digas "dale". 🛡️

¿Empezamos con el despliegue en Vercel usando su dominio temporal?

