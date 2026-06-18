import { useState } from 'react'
import { Save, AlertTriangle, Check } from 'lucide-react'
import { adminApi } from '@/services/adminApi'
import { useAdminQuery } from '@/hooks/useAdminQuery'
import { ErrorState } from '@/components/admin/ErrorState'
import { LoadingState } from '@/components/admin/LoadingState'

// Ordre d'affichage et libellés — miroir de FEATURE_KEYS côté backend.
const FEATURES = [
  { key: 'public_storefront',   label: 'Boutique publique' },
  { key: 'order_management',    label: 'Gestion des commandes' },
  { key: 'employee_management', label: 'Gestion des employés' },
  { key: 'unlimited_catalog',   label: 'Catalogue illimité' },
  { key: 'advanced_stats',      label: 'Analytics avancées' },
  { key: 'priority_support',    label: 'Support prioritaire 24h' },
]

const DEFAULT_FEATURES = Object.fromEntries(FEATURES.map(f => [f.key, false]))

function planDraft(entry) {
  return {
    label:         entry?.label         ?? '',
    scansPerMonth: entry?.scansPerMonth ?? 0,
    priceSN:       entry?.priceSN       ?? 0,
    priceML:       entry?.priceML       ?? 0,
    features: { ...DEFAULT_FEATURES, ...(entry?.features ?? {}) },
  }
}

function FieldRow({ label, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
      <span className="text-label text-admin-muted w-44 shrink-0">{label}</span>
      {children}
    </div>
  )
}

function NumInput({ value, onChange, min = 0 }) {
  return (
    <input
      type="number"
      min={min}
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="w-full sm:w-40 border border-admin-line rounded-lg px-3 py-2 text-body text-navy focus:outline-none focus:ring-2 focus:ring-orange/40 tabular-nums"
    />
  )
}

function TextInput({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full sm:w-64 border border-admin-line rounded-lg px-3 py-2 text-body text-navy focus:outline-none focus:ring-2 focus:ring-orange/40"
    />
  )
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
          checked ? 'bg-orange' : 'bg-admin-line'
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-4.5' : 'translate-x-0.5'
          }`}
        />
      </button>
      <span className={`text-body ${checked ? 'text-navy font-medium' : 'text-admin-muted'}`}>
        {label}
      </span>
    </label>
  )
}

function PlanCard({ planKey, entry, onSaved }) {
  const [draft, setDraft] = useState(() => planDraft(entry))
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState(null)
  const [ok,     setOk]     = useState(false)

  function set(key) {
    return (value) => setDraft(d => ({ ...d, [key]: value }))
  }

  function setFeature(key) {
    return (value) => setDraft(d => ({ ...d, features: { ...d.features, [key]: value } }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setOk(false)
    try {
      await adminApi.updatePlan(planKey, {
        label:         draft.label,
        scansPerMonth: draft.scansPerMonth,
        priceSN:       draft.priceSN,
        priceML:       draft.priceML,
        features:      draft.features,
      })
      setOk(true)
      setTimeout(() => setOk(false), 3000)
      onSaved()
    } catch (err) {
      setError(err.message ?? 'Erreur réseau')
    } finally {
      setSaving(false)
    }
  }

  const TITLE = planKey === 'pro' ? 'Pro' : 'Premium'

  return (
    <form
      onSubmit={handleSave}
      className="bg-white rounded-xl shadow-admin-card overflow-hidden"
    >
      {/* En-tête */}
      <div className="px-5 py-4 border-b border-admin-line flex items-center justify-between gap-3">
        <div>
          <h3 className="text-h3 font-semibold text-navy">Plan {TITLE}</h3>
          <p className="text-micro text-admin-muted mt-0.5">
            Modifie prix, quota et fonctionnalités. Les baisses de quota sont différées au 1er du mois.
          </p>
        </div>
        <span className="shrink-0 px-2.5 py-1 rounded-full bg-orange/10 text-orange text-micro font-semibold uppercase tracking-wide">
          {planKey}
        </span>
      </div>

      <div className="px-5 py-5 space-y-4">
        {/* Libellé */}
        <FieldRow label="Libellé affiché">
          <TextInput value={draft.label} onChange={set('label')} placeholder={TITLE} />
        </FieldRow>

        {/* Prix */}
        <FieldRow label="Prix mensuel SN (FCFA)">
          <NumInput value={draft.priceSN} onChange={set('priceSN')} min={0} />
        </FieldRow>
        <FieldRow label="Prix mensuel ML (FCFA)">
          <NumInput value={draft.priceML} onChange={set('priceML')} min={0} />
        </FieldRow>

        {/* Quota */}
        <FieldRow label="Scans / mois">
          <NumInput value={draft.scansPerMonth} onChange={set('scansPerMonth')} min={1} />
        </FieldRow>

        {/* Features */}
        <div className="pt-2 border-t border-admin-line">
          <p className="text-label font-medium text-navy mb-3">Fonctionnalités incluses</p>
          <div className="space-y-3">
            {FEATURES.map(({ key, label }) => (
              <Toggle
                key={key}
                checked={!!draft.features[key]}
                onChange={setFeature(key)}
                label={label}
              />
            ))}
          </div>
        </div>

        {/* Feedback */}
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-label bg-red-50 rounded-lg px-3 py-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
        {ok && (
          <div className="flex items-center gap-2 text-emerald-700 text-label bg-emerald-50 rounded-lg px-3 py-2">
            <Check className="w-4 h-4 shrink-0" />
            Modifications enregistrées
          </div>
        )}
      </div>

      {/* Footer action */}
      <div className="px-5 py-4 border-t border-admin-line bg-admin-bg flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange text-white text-label font-medium hover:bg-orange-hi disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}

export default function PlansAdminPage() {
  const { data, loading, error, refetch } = useAdminQuery(() => adminApi.plans(), [])

  if (error) return <ErrorState message={error} onRetry={refetch} />

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h2 className="text-h2 font-display font-bold text-navy">Plans tarifaires</h2>
        <p className="text-body text-admin-muted">
          Modifiez prix, quotas et fonctionnalités. Tout changement se reflète immédiatement
          sur la page Formules des marchands.
        </p>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-admin-card p-5">
          <LoadingState rows={6} />
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <PlanCard planKey="pro"     entry={data?.pro}     onSaved={refetch} />
          <PlanCard planKey="premium" entry={data?.premium} onSaved={refetch} />
        </div>
      )}

      {/* Info garde-fou */}
      {!loading && (
        <div className="flex items-start gap-2 text-label text-admin-muted bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <span>
            Une <strong>baisse de quota</strong> de scans est différée au 1er du mois suivant
            pour ne pas pénaliser les abonnés en cours. Une hausse s'applique immédiatement.
          </span>
        </div>
      )}
    </div>
  )
}
