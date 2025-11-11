# Nirvania - CRM Agéntico para LATAM

Nirvania es un CRM inteligente diseñado específicamente para empresas en América Latina, potenciado por agentes IA que automatizan tareas de ventas y gestión de clientes.

## 🚀 Características

- **Agentes IA**: Automatiza tareas de ventas con Account Manager, Outbound, Inbound y System agents
- **Gestión de contactos**: CRM completo con enriquecimiento automático de datos
- **Pipeline de ventas**: Visualiza y gestiona tus oportunidades de negocio
- **Formularios inteligentes**: Captura y califica leads automáticamente
- **Diseñado para LATAM**: Soporte multi-moneda, multi-idioma y adaptado a la región

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: Radix UI, Lucide Icons
- **Estado**: Zustand
- **Base de datos**: Supabase (PostgreSQL)
- **Validación**: Zod + React Hook Form

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/nirvania.git
cd nirvania
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp env.example .env.local
```

4. Completa las variables en `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

5. Ejecuta el proyecto:
```bash
npm run dev
```

## 📁 Estructura del Proyecto

```
nirvania/
├── app/                    # App Router de Next.js
│   ├── (auth)/            # Rutas de autenticación
│   ├── (dashboard)/       # Rutas del dashboard
│   └── api/               # API routes
├── components/            # Componentes React
│   ├── ui/               # Componentes UI base
│   ├── layout/           # Componentes de layout
│   └── features/         # Componentes de características
├── lib/                   # Utilidades y configuraciones
│   ├── supabase/         # Cliente de Supabase
│   ├── utils/            # Funciones de utilidad
│   └── types/            # Tipos TypeScript
└── public/               # Archivos estáticos
```

## 🎨 Diseño

- **Color primario**: Azul (#0066FF)
- **Color secundario**: Cyan (#00B8D4)
- **Tipografía**: Inter
- **Diseño**: Minimalista y enfocado en productividad

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

