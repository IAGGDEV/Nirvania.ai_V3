import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns'
import { es, ptBR } from 'date-fns/locale'

export function formatDate(
  date: Date | string,
  formatStr = 'dd/MM/yyyy',
  locale = 'es'
): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  const dateLocale = locale === 'pt' ? ptBR : es

  if (isToday(parsedDate)) {
    return 'Hoy'
  }

  if (isYesterday(parsedDate)) {
    return 'Ayer'
  }

  return format(parsedDate, formatStr, { locale: dateLocale })
}

export function formatRelativeTime(
  date: Date | string,
  locale = 'es'
): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  const dateLocale = locale === 'pt' ? ptBR : es

  return formatDistanceToNow(parsedDate, {
    addSuffix: true,
    locale: dateLocale,
  })
}

export function formatDateTime(
  date: Date | string,
  locale = 'es'
): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  const dateLocale = locale === 'pt' ? ptBR : es

  return format(parsedDate, "dd/MM/yyyy 'a las' HH:mm", { locale: dateLocale })
}
