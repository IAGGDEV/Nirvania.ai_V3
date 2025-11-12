/**
 * Configuración centralizada para variables de entorno
 * Con valores por defecto para funcionar en modo DEMO
 */

export const config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key',
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || 'demo-key',
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production',
  },
  features: {
    enableAI: !!process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'demo-key',
    enableSupabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://demo.supabase.co',
  }
} as const

// Helper para verificar si estamos en modo demo
export const isDemoMode = () => {
  return !config.features.enableSupabase || !config.features.enableAI
}

// Helper para verificar si tenemos las keys necesarias
export const hasRequiredConfig = () => {
  return config.features.enableSupabase && config.features.enableAI
}




