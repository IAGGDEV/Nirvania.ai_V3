# 🤖 Motor de Ejecución de Skills - Nirvania CRM

## Arquitectura

El motor de ejecución está construido con:
- **LangChain** - Framework para aplicaciones con LLMs
- **Claude Sonnet 4** - Modelo de IA de Anthropic
- **Tool Calling** - Agents pueden ejecutar acciones en el CRM

## Componentes Principales

### 1. Claude Client (`claude-client.ts`)
Cliente configurado para diferentes tipos de tareas:
- **Analytical** (temp: 0.3) - Decisiones y análisis
- **Creative** (temp: 0.8) - Emails y mensajes personalizados
- **Extraction** (temp: 0.0) - Clasificación de datos
- **Conversational** (temp: 0.7) - Interacciones generales

### 2. Tools Registry (`tools/index.ts`)
Herramientas disponibles para los agents:

#### **Contact Tools:**
- `search_contacts` - Buscar contactos con filtros
- `get_contact_details` - Obtener info completa
- `update_contact` - Actualizar datos

#### **Communication Tools:**
- `send_email` - Enviar emails (con modo test)
- `schedule_meeting` - Agendar reuniones

#### **Deal Tools:**
- `create_deal` - Crear nuevos tratos
- `update_deal_stage` - Mover en pipeline

#### **Activity Tools:**
- `log_activity` - Registrar actividades

### 3. Execution Engine (`execution-engine.ts`)
Motor principal que:
- ✅ Valida skills antes de ejecutar
- ✅ Construye prompts dinámicos
- ✅ Ejecuta con LangChain Agent
- ✅ Maneja timeouts y errores
- ✅ Registra logs detallados
- ✅ Soporta modo test
- ✅ Workflow de aprobación manual

### 4. Slash Commands (`slash-commands.ts`)
Sistema de comandos `/` para instrucciones:
- Auto-sugerencias al escribir
- Validación de parámetros
- Categorización por función
- Ejemplos de uso

## Flujo de Ejecución

```
1. Usuario ingresa input
2. Motor valida el skill
3. Construye prompt con:
   - Rol del agente
   - Objetivo del skill
   - Instrucciones paso a paso
   - Restricciones
   - Memoria/contexto
4. LangChain + Claude procesan
5. Agent ejecuta tools según necesidad
6. Registra logs de cada paso
7. Retorna resultado + métricas
```

## Modo Test vs Producción

### Modo Test (seguro):
- ✅ No envía emails reales
- ✅ No modifica datos
- ✅ Simula todas las acciones
- ✅ Indica "SIMULACIÓN" en resultados

### Modo Producción:
- ⚠️ Ejecuta acciones reales
- ⚠️ Envía emails
- ⚠️ Modifica CRM
- ✅ Registra auditoría completa

## Uso del API

### Ejecutar Skill
```typescript
POST /api/skills/{id}/execute
{
  "input": "Busca leads de México y envía email de seguimiento",
  "testMode": true
}

Response:
{
  "success": true,
  "runId": "run-123",
  "output": "Encontré 5 leads y simulé envío de emails",
  "logs": [...],
  "toolsUsed": ["search_contacts", "send_email"],
  "duration": 2500,
  "status": "succeeded"
}
```

### Obtener Historial
```typescript
GET /api/skills/{id}/execute?page=1&pageSize=20

Response:
{
  "data": [...],
  "pagination": { ... }
}
```

## Ejemplo de Instrucciones

```text
OBJETIVO:
Hacer seguimiento automático a leads que no han respondido

INSTRUCCIONES:
1. /buscar_contactos lastContactedDaysAgo:3 hasDeals:false
2. Para cada contacto:
   - /detalles_contacto contactId:{id}
   - Analizar última interacción
   - Crear mensaje personalizado mencionando puntos previos
3. /enviar_email to:{email} subject:"Seguimiento {nombre}" body:{mensaje}
4. /registrar_actividad type:"email" contactId:{id} description:"Email de seguimiento enviado"

RESTRICCIONES:
- Nunca enviar después de 7pm
- Respetar zona horaria del contacto
- No contactar si pidió no ser contactado

MEMORIA:
- Producto: Nirvania CRM para LATAM
- Precio: desde $99/mes
- Link demo: calendly.com/nirvania
```

## Configuración Requerida

### Variables de Entorno
```env
ANTHROPIC_API_KEY=tu_clave_de_anthropic
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_key
```

### Obtener API Key de Anthropic
1. Ve a https://console.anthropic.com
2. Crea una cuenta
3. Genera una API key en Settings
4. Agrégala a tu `.env.local`

## Seguridad

- ✅ Modo test por defecto
- ✅ Validación de skills antes de ejecutar
- ✅ Timeout para prevenir loops infinitos
- ✅ Rate limiting (configurar en API)
- ✅ Logs auditables de todas las acciones
- ✅ Aprobación manual opcional

## Próximas Mejoras

- [ ] Streaming de respuestas en tiempo real
- [ ] Webhooks para triggers
- [ ] Integración con Google Calendar
- [ ] Soporte para múltiples LLMs
- [ ] Dashboard de monitoring
- [ ] A/B testing de prompts
