import { create } from 'zustand'

/**
 * Cache transient des listings paginés (catalogue privé, boutique publique, commandes).
 * La clé inclut la surface + slug/filtres + page — une vue filtrée n'écrase donc
 * JAMAIS le cache non filtré (clés distinctes).
 */
export const useListCacheStore = create((set, get) => ({
  cache: {},

  getEntry: (key) => get().cache[key],

  setEntry: (key, data) => set(state => ({
    cache: { ...state.cache, [key]: data },
  })),

  // Invalide toutes les entrées d'une surface (ex: 'orders|' après mutation)
  clearPrefix: (prefix) => set(state => ({
    cache: Object.fromEntries(
      Object.entries(state.cache).filter(([k]) => !k.startsWith(prefix))
    ),
  })),
}))

/** Clé de cache canonique : surface + parties (slug, filtres, page). */
export function buildListKey(surface, parts) {
  return [surface, ...Object.entries(parts).map(([k, v]) => `${k}:${v ?? ''}`)].join('|')
}
