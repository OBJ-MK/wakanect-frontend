const BACKEND = 'https://api.wakanect.com';
const API_PREFIX = '/api';

const CRAWLER_RE = /facebookexternalhit|facebot|whatsapp|twitterbot|linkedinbot|slackbot|telegrambot|discordbot|pinterest|redditbot|googlebot|bingbot|applebot|embedly|vkshare|skypeuripreview/i;
const BOUTIQUE_RE = /^\/boutique\/([^/]+)\/?$/;
const PRODUCT_RE  = /^\/boutique\/([^/]+)\/produit\/([^/]+)\/?$/;

function esc(s = '') {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function truncate(s = '', n = 200) {
  s = String(s).trim();
  return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s;
}
function formatFCFA(n) {
  return `${new Intl.NumberFormat('fr-FR').format(n)} FCFA`;
}

class HeadInjector { constructor(h) { this.h = h; } element(el) { el.append(this.h, { html: true }); } }
class TitleRewriter { constructor(t) { this.t = t; } element(el) { el.setInnerContent(this.t); } }
class MetaContentRewriter { constructor(c) { this.c = c; } element(el) { el.setAttribute('content', this.c); } }

async function fetchJson(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 2500);
  try {
    const r = await fetch(url, { signal: ctrl.signal, headers: { Accept: 'application/json' } });
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; } finally { clearTimeout(t); }
}

function fetchBoutiqueMeta(slug) {
  return fetchJson(`${BACKEND}${API_PREFIX}/boutique/${encodeURIComponent(slug)}`);
}

async function fetchProductMeta(slug, id) {
  const data = await fetchJson(`${BACKEND}${API_PREFIX}/boutique/${encodeURIComponent(slug)}/produit/${encodeURIComponent(id)}`);
  return data?.product || null;
}

function buildOgBlock({ url, siteName, title, description, image }) {
  const hasImg = image && image.startsWith('https://');
  const lines = [
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(siteName)}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
  ];
  if (hasImg) lines.push(`<meta property="og:image" content="${esc(image)}" />`);
  lines.push(`<meta name="twitter:card" content="${hasImg ? 'summary_large_image' : 'summary'}" />`);
  lines.push(`<meta name="twitter:title" content="${esc(title)}" />`);
  lines.push(`<meta name="twitter:description" content="${esc(description)}" />`);
  if (hasImg) lines.push(`<meta name="twitter:image" content="${esc(image)}" />`);
  return lines.join('\n');
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

     if (url.pathname === '/edge-country') {
      const country = (request.cf?.country ?? 'SN').toUpperCase();
      return new Response(JSON.stringify({ country }), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      });
    }

    const ua = request.headers.get('user-agent') || '';

    if (CRAWLER_RE.test(ua)) {
      const productMatch  = url.pathname.match(PRODUCT_RE);
      const boutiqueMatch = url.pathname.match(BOUTIQUE_RE);

      // Lien vers un article précis → c'est SA photo qui doit apparaître dans l'aperçu
      // WhatsApp/Facebook, pas le logo de la boutique (avant : la regex boutique
      // matchait aussi les URLs produit et affichait toujours le logo).
      if (productMatch) {
        const [, slug, id] = productMatch;
        const product = await fetchProductMeta(slug, id);
        if (product) {
          const title = `${product.name} — ${formatFCFA(product.price)}`;
          const description = truncate(product.description || `Disponible maintenant, ${formatFCFA(product.price)}`);
          const image = product.image_url;
          const ogBlock = buildOgBlock({
            url: `${url.origin}${url.pathname}`,
            siteName: `${url.host}/boutique/${slug}`,
            title, description, image,
          });

          const assetResp = await env.ASSETS.fetch(request);
          const rewritten = new HTMLRewriter()
            .on('title', new TitleRewriter(title))
            .on('meta[name="description"]', new MetaContentRewriter(description))
            .on('head', new HeadInjector(ogBlock))
            .transform(assetResp);

          const resp = new Response(rewritten.body, rewritten);
          resp.headers.set('Cache-Control', 'public, max-age=600');
          return resp;
        }
      } else if (boutiqueMatch) {
        const meta = await fetchBoutiqueMeta(boutiqueMatch[1]);
        if (meta && meta.shop_name) {
          const title = meta.shop_name;
          const description = truncate(meta.description || `Découvrez la boutique ${meta.shop_name}`);
          const image = meta.banner_url || meta.logo_url || null; // bannière prioritaire, logo en repli
          const ogBlock = buildOgBlock({
            url: `${url.origin}${url.pathname}`,
            siteName: `${url.host}/boutique/${boutiqueMatch[1]}`,
            title, description, image,
          });

          const assetResp = await env.ASSETS.fetch(request);
          const rewritten = new HTMLRewriter()
            .on('title', new TitleRewriter(title))
            .on('meta[name="description"]', new MetaContentRewriter(description))
            .on('head', new HeadInjector(ogBlock))
            .transform(assetResp);

          const resp = new Response(rewritten.body, rewritten);
          resp.headers.set('Cache-Control', 'public, max-age=600');
          return resp;
        }
      }
    }

    return env.ASSETS.fetch(request);
  },
};