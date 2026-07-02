import { X, Plus } from 'lucide-react'

/**
 * Normalise les lignes de l'éditeur en variantes valides :
 * couleur non vide ET quantité renseignée. Une ligne avec couleur seule
 * (quantité vide) est ignorée — comportement legacy "liste de couleurs".
 */
export function toCleanVariants(rows) {
  return (rows || [])
    .map(v => ({ color: String(v.color ?? '').trim(), quantity: v.quantity }))
    .filter(v => v.color && v.quantity !== '' && v.quantity !== null && v.quantity !== undefined)
    .map(v => ({ color: v.color, quantity: Math.max(0, parseInt(v.quantity, 10) || 0) }))
}

/** Somme des quantités des variantes valides. */
export function variantsSum(rows) {
  return toCleanVariants(rows).reduce((sum, v) => sum + v.quantity, 0)
}

/**
 * Éditeur de variantes couleur : lignes [couleur | quantité] avec ajouter/supprimer.
 * `variants` : [{ color: string, quantity: string|number }]
 */
export function VariantEditor({ variants, onChange, label = 'Couleurs (quantité par couleur)' }) {
  function update(idx, key, value) {
    onChange(variants.map((v, i) => (i === idx ? { ...v, [key]: value } : v)))
  }

  function remove(idx) {
    onChange(variants.filter((_, i) => i !== idx))
  }

  function add() {
    onChange([...variants, { color: '', quantity: '' }])
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-label font-semibold text-white/60">{label}</label>
      {variants.map((v, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <input
            value={v.color}
            onChange={e => update(idx, 'color', e.target.value)}
            placeholder="Ex: Rouge"
            className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-label focus:outline-none focus:border-orange/50 dark:bg-navy/60 dark:border-white/10"
          />
          <input
            type="number"
            min="0"
            value={v.quantity}
            onChange={e => update(idx, 'quantity', e.target.value)}
            placeholder="Qté"
            className="w-20 px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-label focus:outline-none focus:border-orange/50 dark:bg-navy/60 dark:border-white/10"
          />
          <button
            type="button"
            onClick={() => remove(idx)}
            aria-label="Supprimer la couleur"
            className="p-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1.5 self-start px-3 py-2 rounded-xl bg-amber/15 text-amber text-label hover:bg-amber/25 transition-colors"
      >
        <Plus size={14} />
        Ajouter une couleur
      </button>
    </div>
  )
}
