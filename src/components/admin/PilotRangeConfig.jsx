import { useState, useEffect } from 'react'
import { CalendarCog, Loader2 } from 'lucide-react'
import { adminApi } from '@/services/adminApi'
import { BottomSheet } from '@/components/admin/BottomSheet'

function toInputValue(iso) {
  if (!iso) return ''
  return new Date(iso).toISOString().slice(0, 10)
}

/**
 * Bouton à côté du RangeSelector qui laisse configurer les bornes de la
 * plage "Pilot" (voir RangeSelector.jsx + adminStatsService.js#parseDateRange).
 * Sans config, "Pilot" retombe sur l'origine du projet → maintenant.
 */
export function PilotRangeConfig({ onSaved }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ start: '', end: '' })

  // Charge la config actuelle à chaque ouverture (pas au montage — le bouton
  // reste inerte tant qu'on ne clique pas).
  useEffect(() => {
    if (!open) return
    let cancelled = false
    setLoading(true)
    setError('')
    adminApi.pilotConfig()
      .then(d => {
        if (cancelled) return
        setForm({ start: toInputValue(d?.pilot_start_date), end: toInputValue(d?.pilot_end_date) })
      })
      .catch(err => { if (!cancelled) setError(err?.message || 'Échec du chargement') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [open])

  async function handleSave() {
    setError('')
    if (form.start && form.end && form.start > form.end) {
      setError('La date de début doit précéder la date de fin')
      return
    }
    setSaving(true)
    try {
      await adminApi.updatePilotConfig({
        pilot_start_date: form.start || null,
        pilot_end_date: form.end || null,
      })
      setOpen(false)
      onSaved?.()
    } catch (err) {
      setError(err?.message || 'Échec de l\'enregistrement')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Configurer la période du pilote"
        title="Configurer la période du pilote"
        className="flex items-center justify-center w-8 h-8 bg-admin-fill border border-admin-line rounded-lg text-admin-muted hover:text-navy transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange"
      >
        <CalendarCog className="w-4 h-4" />
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)} title="Période du pilote">
        {loading ? (
          <div className="flex items-center justify-center py-8 text-admin-muted">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-label text-admin-muted">
              Utilisées quand "Pilot" est sélectionné dans le filtre de période.
              Laisser la fin vide si le pilote est toujours en cours.
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-label font-semibold text-navy">Début</label>
              <input
                type="date"
                value={form.start}
                onChange={(e) => setForm(f => ({ ...f, start: e.target.value }))}
                className="px-3 py-2.5 rounded-lg bg-white border border-admin-line text-navy text-body focus:outline-none focus:ring-2 focus:ring-orange/40"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-label font-semibold text-navy">Fin (optionnel)</label>
              <input
                type="date"
                value={form.end}
                onChange={(e) => setForm(f => ({ ...f, end: e.target.value }))}
                className="px-3 py-2.5 rounded-lg bg-white border border-admin-line text-navy text-body focus:outline-none focus:ring-2 focus:ring-orange/40"
              />
            </div>

            {error && (
              <p className="text-label text-red-500 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-1 py-3 rounded-xl bg-orange text-white font-semibold text-body disabled:opacity-50 transition-opacity"
            >
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>
        )}
      </BottomSheet>
    </>
  )
}
