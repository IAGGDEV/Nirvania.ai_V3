import { ChatAnthropic } from '@langchain/anthropic'

/**
 * Cliente de Claude API configurado para Nirvania
 * Usa Claude Sonnet 4 como modelo principal
 */
export function createClaudeClient(temperature = 0.7) {
  return new ChatAnthropic({
    modelName: 'claude-sonnet-4-20250514',
    temperature,
    apiKey: process.env.ANTHROPIC_API_KEY,
    maxTokens: 4096,
  })
}

/**
 * Cliente específico para skills que requieren más tokens
 */
export function createClaudeClientExtended() {
  return new ChatAnthropic({
    modelName: 'claude-sonnet-4-20250514',
    temperature: 0.5,
    apiKey: process.env.ANTHROPIC_API_KEY,
    maxTokens: 8192,
  })
}

/**
 * Configuración para diferentes tipos de tasks
 */
export const AI_CONFIGS = {
  // Para análisis y decisiones
  analytical: {
    temperature: 0.3,
    maxTokens: 4096,
  },
  // Para creatividad (emails, mensajes)
  creative: {
    temperature: 0.8,
    maxTokens: 2048,
  },
  // Para clasificación y extracción
  extraction: {
    temperature: 0,
    maxTokens: 1024,
  },
  // Para conversación
  conversational: {
    temperature: 0.7,
    maxTokens: 4096,
  },
} as const
