const TAILLE_KEYWORDS = /\b(XS|S|M|L|XL|XXL|XXXL|[0-9]{2})\b/gi
const COULEUR_KEYWORDS = /\b(noir|blanc|rouge|bleu|vert|jaune|rose|violet|gris|marron|beige|orange|bordeaux|kaki|turquoise|navy)\b/gi
const PRIX_PATTERN = /(\d[\d\s]*)\s*(?:f?cfa|fr|francs?)?/gi
const QTE_PATTERN = /(?:qté?|quantité|stock|dispo)[:\s]*(\d+)/i

export function parseWhatsAppProduct(text) {
  const lines = text.trim().split(/\n+/)
  const nameLine = lines[0] || ''

  const priceMatches = [...text.matchAll(PRIX_PATTERN)]
    .map(m => parseInt(m[1].replace(/\s/g, ''), 10))
    .filter(n => n >= 100 && n <= 10_000_000)

  const sizeMatches = [...new Set([...text.matchAll(TAILLE_KEYWORDS)].map(m => m[0].toUpperCase()))]
  const colorMatches = [...new Set([...text.matchAll(COULEUR_KEYWORDS)].map(m => capitalize(m[0])))]

  const qteMatch = text.match(QTE_PATTERN)
  const quantity = qteMatch ? parseInt(qteMatch[1], 10) : 1

  const price = priceMatches.length > 0 ? priceMatches[priceMatches.length - 1] : null

  const confidence = computeConfidence({ name: nameLine, price, sizes: sizeMatches, colors: colorMatches })

  return {
    rawText: text,
    name: nameLine,
    price,
    sizes: sizeMatches,
    colors: colorMatches,
    quantity,
    category: '',
    confidence,
  }
}

function computeConfidence({ name, price, sizes, colors }) {
  let score = 0
  if (name?.length > 3) score += 30
  if (price && price > 0) score += 35
  if (sizes.length > 0) score += 20
  if (colors.length > 0) score += 15
  return Math.min(score, 100)
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
