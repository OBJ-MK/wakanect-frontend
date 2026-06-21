/**
 * Cloudflare Workers edge script pour wakanect-frontend.
 *
 * - GET /geo  : renvoie le pays Cloudflare du visiteur (SN ou ML).
 *   Utilisé par la landing anonyme pour passer ?country= à /api/plans.
 * - Tout le reste : délégué aux assets statiques (SPA React).
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/geo') {
      // request.cf.country est fourni GRATUITEMENT par Cloudflare à l'edge.
      // Seuls SN et ML sont supportés ; tout autre pays → SN par défaut.
      const raw     = request.cf?.country ?? 'SN';
      const country = raw === 'ML' ? 'ML' : 'SN';
      return new Response(JSON.stringify({ country }), {
        headers: {
          'Content-Type':  'application/json',
          'Cache-Control': 'no-store',
        },
      });
    }

    // Sert les assets React (SPA avec fallback index.html pour les 404)
    return env.ASSETS.fetch(request);
  },
};
