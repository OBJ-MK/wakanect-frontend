const COLORS = [
  'bleu roi', 'bleu ciel', 'bleu marine', 'bleu', 'rouge', 'vert', 'jaune', 'noir',
  'blanc', 'marron', 'rose', 'orange', 'violet', 'gris', 'beige', 'doré', 'dore',
  'argenté', 'turquoise', 'bordeaux', 'kaki', 'wax',
];

const SIZE_RE = /\b(XXL|XL|XS|S|M|L)\b/gi;

function cleanEmojis(s) {
  return s.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/gu, '').trim();
}

function detectPrice(text) {
  const t = text.toLowerCase();
  let kMatch = t.match(/(\d+(?:[.,]\d+)?)\s*(k|mille)\b/);
  if (kMatch) return Math.round(parseFloat(kMatch[1].replace(',', '.')) * 1000);

  const grouped = t.match(/\d{1,3}(?:[.\s,]\d{3})+/);
  if (grouped) return parseInt(grouped[0].replace(/[.\s,]/g, ''), 10);

  const withCur = t.match(/(\d{3,})\s*(f|fcfa|xof|francs?)/);
  if (withCur) return parseInt(withCur[1], 10);

  const nums = (t.match(/\d{3,}/g) || []).map(Number);
  if (nums.length) return Math.max(...nums);
  return null;
}

function detectSizes(text) {
  const found = [...text.matchAll(SIZE_RE)].map((m) => m[1].toUpperCase());
  const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  return order.filter((s) => found.includes(s));
}

function detectColors(text) {
  const t = text.toLowerCase();
  const found = [];
  for (const c of COLORS) {
    if (t.includes(c) && !found.some((f) => f.includes(c) || c.includes(f))) found.push(c);
  }
  return found.map((c) => c.charAt(0).toUpperCase() + c.slice(1));
}

function detectQty(text) {
  const t = text.toLowerCase();
  const m =
    t.match(/(\d+)\s*(pi[eè]ces?|dispo(?:nibles?)?|en stock|exemplaires?)/) ||
    t.match(/stock\s*[:=]?\s*(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

function detectName(text, colors) {
  let seg = cleanEmojis(text.split(/[,\n;]/)[0] || '');
  seg = seg.replace(SIZE_RE, '').replace(/\s{2,}/g, ' ').trim();
  // Drop a trailing colour word so the name reads cleanly.
  for (const c of colors) {
    seg = seg.replace(new RegExp(`\\s*${c}\\b`, 'i'), '').trim();
  }
  if (!seg) seg = cleanEmojis(text).split(' ').slice(0, 3).join(' ');
  return seg.charAt(0).toUpperCase() + seg.slice(1);
}

const fmt = (n) => n.toLocaleString('fr-FR');

const CONF = { name: 88, price: 96, sizes: 92, colors: 86, quantity: 90 };
const WEIGHTS = { name: 0.3, price: 0.35, sizes: 0.2, colors: 0.15 };

export function parseProduct(text) {
  const colors = detectColors(text);
  const price = detectPrice(text);
  const sizes = detectSizes(text);
  const qty = detectQty(text);
  const name = text.trim() ? detectName(text, colors) : '';

  const fields = [
    { key: 'name', label: 'Nom du produit', value: name || null, conf: name ? CONF.name : 0 },
    { key: 'price', label: 'Prix', value: price ? `${fmt(price)} XOF` : null, conf: price ? CONF.price : 0 },
    { key: 'sizes', label: 'Tailles', value: sizes.length ? sizes : null, conf: sizes.length ? CONF.sizes : 0 },
    { key: 'colors', label: 'Couleurs', value: colors.length ? colors : null, conf: colors.length ? CONF.colors : 0 },
    { key: 'quantity', label: 'Stock', value: qty != null ? `${qty} en stock` : null, conf: qty != null ? CONF.quantity : 0 },
  ];

  const overall = Math.round(
    fields.reduce((sum, f) => sum + (WEIGHTS[f.key] ? (f.conf * WEIGHTS[f.key]) : 0), 0)
  );

  return { fields, overall };
}
