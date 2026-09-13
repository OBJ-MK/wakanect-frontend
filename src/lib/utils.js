import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function buildWhatsAppLink(phone, message = '') {
  const clean = phone.replace(/\D/g, '')
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${clean}${message ? `?text=${encoded}` : ''}`
}

export function buildColorRequestLink(phone, productName, colorName) {
  const message = `Bonjour, la ${productName} est-elle disponible en ${colorName} ?`
  return buildWhatsAppLink(phone, message)
}

export function getInitials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('')
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Partage natif (Web Share API) avec repli sur le presse-papier.
 * Retourne 'shared' | 'copied' | 'cancelled' | 'error' pour que l'appelant
 * puisse donner un retour visuel adapté (icône ✓, toast…).
 */
export async function shareOrCopy(title, url) {
  if (navigator.share) {
    try {
      await navigator.share({ title, url })
      return 'shared'
    } catch (err) {
      if (err?.name === 'AbortError') return 'cancelled'
      // Le partage natif a échoué (pas d'app cible, etc.) → on retombe sur le presse-papier
    }
  }
  try {
    await navigator.clipboard.writeText(url)
    return 'copied'
  } catch {
    return 'error'
  }
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}