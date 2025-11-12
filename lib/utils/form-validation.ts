/**
 * LATAM-specific form validation utilities
 * Validación de formularios específica para LATAM
 */

/**
 * Validate LATAM phone numbers with country-specific formats
 */
export function validateLATAMPhone(phone: string, country?: string): boolean {
  // Remove formatting
  const cleaned = phone.replace(/[\s-()]/g, '')

  const patterns: Record<string, RegExp> = {
    MX: /^\+52\d{10}$/,     // +52 1234567890 (México)
    BR: /^\+55\d{11}$/,     // +55 11987654321 (Brasil)
    CO: /^\+57\d{10}$/,     // +57 3001234567 (Colombia)
    AR: /^\+54\d{10}$/,     // +54 1123456789 (Argentina)
    CL: /^\+56\d{9}$/,      // +56 912345678 (Chile)
    PE: /^\+51\d{9}$/,      // +51 987654321 (Perú)
    EC: /^\+593\d{9}$/,     // +593 987654321 (Ecuador)
    UY: /^\+598\d{8}$/,     // +598 98765432 (Uruguay)
    PY: /^\+595\d{9}$/,     // +595 987654321 (Paraguay)
    BO: /^\+591\d{8}$/,     // +591 78765432 (Bolivia)
  }

  if (country && patterns[country]) {
    return patterns[country].test(cleaned)
  }

  // Generic validation if country not specified
  // E.164 format: +[country code][number]
  return /^\+?[1-9]\d{1,14}$/.test(cleaned)
}

/**
 * Format LATAM phone number for WhatsApp
 */
export function formatPhoneForWhatsApp(phone: string): string {
  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, '')
  
  // Ensure it starts with +
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned
  }
  
  return cleaned
}

/**
 * Validate Mexican RFC (Registro Federal de Contribuyentes)
 */
export function validateRFC(rfc: string): boolean {
  // RFC can be for individuals (13 chars) or companies (12 chars)
  // Format: AAAA######XXX or AAA######XXX
  const rfcPattern = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/
  return rfcPattern.test(rfc.toUpperCase())
}

/**
 * Validate Brazilian CNPJ (Cadastro Nacional da Pessoa Jurídica)
 */
export function validateCNPJ(cnpj: string): boolean {
  const cleaned = cnpj.replace(/[^\d]/g, '')
  
  if (cleaned.length !== 14) return false
  
  // Check for invalid sequences (all same digits)
  if (/^(\d)\1+$/.test(cleaned)) return false

  // Calculate first check digit
  let sum = 0
  let weight = 5
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleaned[i]) * weight
    weight = weight === 2 ? 9 : weight - 1
  }
  let digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  
  // Calculate second check digit
  sum = 0
  weight = 6
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleaned[i]) * weight
    weight = weight === 2 ? 9 : weight - 1
  }
  let digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11)

  return parseInt(cleaned[12]) === digit1 && parseInt(cleaned[13]) === digit2
}

/**
 * Validate Brazilian CPF (Cadastro de Pessoas Físicas)
 */
export function validateCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/[^\d]/g, '')
  
  if (cleaned.length !== 11) return false
  
  // Check for invalid sequences
  if (/^(\d)\1+$/.test(cleaned)) return false

  // Calculate first check digit
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i]) * (10 - i)
  }
  let digit1 = (sum * 10) % 11
  if (digit1 === 10) digit1 = 0
  
  // Calculate second check digit
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned[i]) * (11 - i)
  }
  let digit2 = (sum * 10) % 11
  if (digit2 === 10) digit2 = 0

  return parseInt(cleaned[9]) === digit1 && parseInt(cleaned[10]) === digit2
}

/**
 * Validate Colombian NIT (Número de Identificación Tributaria)
 */
export function validateNIT(nit: string): boolean {
  const cleaned = nit.replace(/[^\d]/g, '')
  
  if (cleaned.length < 9 || cleaned.length > 10) return false
  
  // Simple validation - NIT should be numeric
  return /^\d+$/.test(cleaned)
}

/**
 * Format LATAM currency
 */
export function formatLATAMCurrency(amount: number, currency: string): string {
  const formats: Record<string, { locale: string; options: Intl.NumberFormatOptions }> = {
    MXN: { 
      locale: 'es-MX', 
      options: { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 }
    },
    BRL: { 
      locale: 'pt-BR', 
      options: { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }
    },
    COP: { 
      locale: 'es-CO', 
      options: { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }
    },
    ARS: { 
      locale: 'es-AR', 
      options: { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 }
    },
    CLP: { 
      locale: 'es-CL', 
      options: { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }
    },
    PEN: { 
      locale: 'es-PE', 
      options: { style: 'currency', currency: 'PEN', minimumFractionDigits: 2 }
    },
    USD: { 
      locale: 'en-US', 
      options: { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }
    },
  }

  const format = formats[currency] || formats.USD
  return new Intl.NumberFormat(format.locale, format.options).format(amount)
}

/**
 * Detect country from phone number
 */
export function detectCountryFromPhone(phone: string): string | null {
  const cleaned = phone.replace(/[^\d+]/g, '')
  
  const countryCodeMap: Record<string, string> = {
    '+52': 'MX',
    '+55': 'BR',
    '+57': 'CO',
    '+54': 'AR',
    '+56': 'CL',
    '+51': 'PE',
    '+593': 'EC',
    '+598': 'UY',
    '+595': 'PY',
    '+591': 'BO',
  }

  for (const [code, country] of Object.entries(countryCodeMap)) {
    if (cleaned.startsWith(code)) {
      return country
    }
  }

  return null
}

/**
 * Validate email with LATAM-specific TLDs
 */
export function validateLATAMEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return false

  // Allow common LATAM TLDs
  const latamTLDs = ['.mx', '.br', '.co', '.ar', '.cl', '.pe', '.ec', '.uy', '.py', '.bo', '.com', '.net', '.org']
  return latamTLDs.some(tld => email.toLowerCase().endsWith(tld))
}

/**
 * Format LATAM date
 */
export function formatLATAMDate(date: Date, country: string): string {
  const locales: Record<string, string> = {
    MX: 'es-MX',
    BR: 'pt-BR',
    CO: 'es-CO',
    AR: 'es-AR',
    CL: 'es-CL',
    PE: 'es-PE',
  }

  const locale = locales[country] || 'es-MX'
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

/**
 * Validate postal code for LATAM countries
 */
export function validateLATAMPostalCode(postalCode: string, country: string): boolean {
  const patterns: Record<string, RegExp> = {
    MX: /^\d{5}$/,                    // 12345
    BR: /^\d{5}-?\d{3}$/,             // 12345-678 or 12345678
    CO: /^\d{6}$/,                    // 123456
    AR: /^[A-Z]?\d{4}[A-Z]{3}$/i,     // 1234ABC or A1234ABC
    CL: /^\d{7}$/,                    // 1234567
    PE: /^\d{5}$/,                    // 12345
  }

  const pattern = patterns[country]
  return pattern ? pattern.test(postalCode) : true // Allow unknown countries
}




