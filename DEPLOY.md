# 🚀 Guía de Despliegue - Nirvania CRM

## Despliegue en Vercel con dominio personalizado

### Paso 1: Preparar el proyecto

1. **Variables de entorno necesarias:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
   ```

### Paso 2: Desplegar en Vercel

1. **Instala Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Despliega el proyecto:**
   ```bash
   vercel
   ```

3. **Sigue los prompts:**
   - ¿Set up and deploy? → `y`
   - ¿Which scope? → Tu cuenta personal o equipo
   - ¿Link to existing project? → `n` (crear nuevo)
   - ¿What's your project's name? → `nirvania`
   - ¿In which directory is your code located? → `./`
   - ¿Want to modify settings? → `n`

### Paso 3: Configurar dominio personalizado

1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto "nirvania"
3. Ve a Settings → Domains
4. Agrega tu dominio: `nirvaniaai.com`
5. Sigue las instrucciones para configurar DNS:
   - **Opción A (Recomendada)**: Nameservers de Vercel
   - **Opción B**: Records A/CNAME

### Paso 4: Variables de entorno en Vercel

1. En el dashboard de Vercel
2. Settings → Environment Variables
3. Agrega:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Paso 5: Configurar Supabase

1. Ve a tu proyecto en Supabase
2. Settings → API
3. Copia:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon/Public Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### DNS Records para nirvaniaai.com

Si usas registros DNS personalizados:

**Para root domain (nirvaniaai.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Para www:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Comandos útiles

```bash
# Desplegar a producción
vercel --prod

# Ver logs
vercel logs

# Variables de entorno
vercel env add VARIABLE_NAME
```

## 🎉 ¡Listo!

Tu aplicación estará disponible en:
- https://nirvaniaai.com
- https://www.nirvaniaai.com
