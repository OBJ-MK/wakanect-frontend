import { useState } from 'react'
import { Save, AlertTriangle, Check } from 'lucide-react'
import { adminApi } from '@/services/adminApi'
import { useAdminQuery } from '@/hooks/useAdminQuery'
import { ErrorState } from '@/components/admin/ErrorState'
import { LoadingState } from '@/components/admin/LoadingState'

// Features booléennes — employee_management retiré, remplacé par maxEmployees.
const FEATURES = [
  { key: 'public_storefront', label: 'Boutique publique' },
  { key: 'order_management',  label: 'Gestion des commandes' },
  { key: 'unlimited_catalog', label: 'Catalogue illimité' },
  { key: 'advanced_stats',    label: 'Analytics avancées' },
  { key: 'priority_support',  label: 'Support prioritaire 24h' },
]

const DEFAULT_FEATURES = Object.fromEntries(FEATURES.map(f => [f.key, false]))

function planDraft(entry) {
  return {
    label:         entry?.label         ?? '',
    scansPerMonth: entry?.scansPerMonth ?? 0,
    maxEmployees:  entry?.maxEmployees  ?? 0,
    priceSN:       entry?.priceSN       ?? 0,
    priceML:       entry?.priceML       ?? 0,
    features: { ...DEFAULT_FEATURES, ...(entry?.features ?? {}) },
  }
}

// ── Primitives ────────────────────────────────────────────────────────────────

function FieldRow({ label, hint, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-4">
      <div className="w-52 shrink-0 pt-0.5">
        <span className="text-label text-admin-muted">{label}</span>
        {hint && <p className="text-micro text-admin-muted/70 mt-0.5">{hint}</p>}
      </div>
      {children}
    </div>
  )
}

function NumInput({ value, onChange, min }) {
  return (
    <input
      type="number"
      min={min ?? 0}
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
        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-[18px]' : 'translate-x-0.5'
        }`} />
      </button>
      <span className={`text-body ${checked ? 'text-navy font-medium' : 'text-admin-muted'}`}>
        {label}
      </span>
    </label>
  )
}

function SaveFeedback({ saving, ok, error, onSubmit, label = 'Enregistrer' }) {
  return (
    <div className="px-5 py-4 border-t border-admin-line bg-admin-bg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex-1 min-w-0">
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-label">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
        {ok && (
          <div className="flex items-center gap-2 text-emerald-700 text-label">
            <Check className="w-4 h-4 shrink-0" />
            Modifications enregistrées
          </div>
        )}
      </div>
      <button
        type="submit"
        onClick={onSubmit}
        disabled={saving}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange text-white text-label font-medium hover:bg-orange-hi disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
      >
        <Save className="w-4 h-4" />
        {saving ? 'Enregistrement…' : label}
      </button>
    </div>
  )
}

// ── Plan Card (Pro / Premium) ─────────────────────────────────────────────────

function PlanCard({ planKey, entry, onSaved }) {
  const [draft, setDraft] = useState(() => planDraft(entry))
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState(null)
  const [ok,     setOk]     = useState(false)

  const set = key => value => setDraft(d => ({ ...d, [key]: value }))
  const setFeature = key => value => setDraft(d => ({ ...d, features: { ...d.features, [key]: value } }))

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true); setError(null); setOk(false)
    try {
      await adminApi.updatePlan(planKey, {
        label:         draft.label,
        scansPerMonth: draft.scansPerMonth,
        maxEmployees:  draft.maxEmployees,
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

  return (
    <form onSubmit={handleSave} className="bg-white rounded-xl shadow-admin-card overflow-hidden">
      <div className="px-5 py-4 border-b border-admin-line flex items-center justify-between gap-3">
        <div>
          <h3 className="text-h3 font-semibold text-navy">
            Plan {planKey === 'pro' ? 'Pro' : 'Premium'}
          </h3>
          <p className="text-micro text-admin-muted mt-0.5">
            Les baisses de quota sont différées au 1er du mois.
          </p>
        </div>
        <span className="shrink-0 px-2.5 py-1 rounded-full bg-orange/10 text-orange text-micro font-semibold uppercase tracking-wide">
          {planKey}
        </span>
      </div>

      <div className="px-5 py-5 space-y-4">
        <FieldRow label="Libellé affiché">
          <TextInput value={draft.label} onChange={set('label')} placeholder={planKey === 'pro' ? 'Pro' : 'Premium'} />
        </FieldRow>
        <FieldRow label="Prix mensuel SN (FCFA)">
          <NumInput value={draft.priceSN} onChange={set('priceSN')} />
        </FieldRow>
        <FieldRow label="Prix mensuel ML (FCFA)">
          <NumInput value={draft.priceML} onChange={set('priceML')} />
        </FieldRow>
        <FieldRow label="Scans / mois">
          <NumInput value={draft.scansPerMonth} onChange={set('scansPerMonth')} min={1} />
        </FieldRow>
        <FieldRow
          label="Employés max"
          hint="0 = aucun · -1 = illimité"
        >
          <NumInput value={draft.maxEmployees} onChange={set('maxEmployees')} min={-1} />
        </FieldRow>

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
      </div>

      <SaveFeedback saving={saving} ok={ok} error={error} onSubmit={handleSave} />
    </form>
  )
}

// ── Plan Gratuit (trial) ──────────────────────────────────────────────────────

function TrialCard({ data, onSaved }) {
  const [draft, setDraft] = useState({
    days:  data?.trial?.days  ?? 14,
    scans: data?.trial?.scans ?? 100,
  })
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState(null)
  const [ok,     setOk]     = useState(false)

  const set = key => value => setDraft(d => ({ ...d, [key]: value }))

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true); setError(null); setOk(false)
    try {
      await adminApi.updatePlan('trial', draft)
      setOk(true)
      setTimeout(() => setOk(false), 3000)
      onSaved()
    } catch (err) {
      setError(err.message ?? 'Erreur réseau')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="bg-white rounded-xl shadow-admin-card overflow-hidden">
      <div className="px-5 py-4 border-b border-admin-line flex items-center justify-between gap-3">
        <div>
          <h3 className="text-h3 font-semibold text-navy">Plan Gratuit (essai)</h3>
          <p className="text-micro text-admin-muted mt-0.5">Durée et quota de la période d'essai.</p>
        </div>
        <span className="shrink-0 px-2.5 py-1 rounded-full bg-white/80 border border-admin-line text-admin-muted text-micro font-semibold uppercase tracking-wide">
          free
        </span>
      </div>

      <div className="px-5 py-5 space-y-4">
        <FieldRow label="Durée d'essai (jours)">
          <NumInput value={draft.days} onChange={set('days')} min={1} />
        </FieldRow>
        <FieldRow label="Scans / mois (essai)">
          <NumInput value={draft.scans} onChange={set('scans')} min={1} />
        </FieldRow>
      </div>

      <SaveFeedback saving={saving} ok={ok} error={error} onSubmit={handleSave} />
    </form>
  )
}

// ── Remises par durée ─────────────────────────────────────────────────────────

function DiscountsCard({ data, onSaved }) {
  const [draft, setDraft] = useState({
    quarterlyMultiplier:  data?.discounts?.quarterlyMultiplier  ?? 2.7,
    semiannualMultiplier: data?.discounts?.semiannualMultiplier ?? 5,
    annualMultiplier:     data?.discounts?.annualMultiplier     ?? 10,
  })
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState(null)
  const [ok,     setOk]     = useState(false)

  const set = key => value => setDraft(d => ({ ...d, [key]: value }))

  function setFloat(key) {
    return e => {
      const v = parseFloat(e.target.value)
      if (!isNaN(v)) setDraft(d => ({ ...d, [key]: v }))
    }
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true); setError(null); setOk(false)
    try {
      await adminApi.updatePlan('discounts', draft)
      setOk(true)
      setTimeout(() => setOk(false), 3000)
      onSaved()
    } catch (err) {
      setError(err.message ?? 'Erreur réseau')
    } finally {
      setSaving(false)
    }
  }

  function FloatInput({ value, fieldKey }) {
    return (
      <input
        type="number"
        step="0.1"
        min="1"
        value={value}
        onChange={setFloat(fieldKey)}
        className="w-full sm:w-32 border border-admin-line rounded-lg px-3 py-2 text-body text-navy focus:outline-none focus:ring-2 focus:ring-orange/40 tabular-nums"
      />
    )
  }

  function calcLabel(multiplier, months) {
    const savings = months - multiplier
    if (savings <= 0) return 'aucune remise'
    const savedMonths = Math.round(savings)
    if (Math.abs(savings - savedMonths) < 0.05) {
      return savedMonths === 1 ? '1 mois offert' : `${savedMonths} mois offerts`
    }
    return `-${Math.round((savings / months) * 100)}%`
  }

  return (
    <form onSubmit={handleSave} className="bg-white rounded-xl shadow-admin-card overflow-hidden">
      <div className="px-5 py-4 border-b border-admin-line">
        <h3 className="text-h3 font-semibold text-navy">Remises par durée</h3>
        <p className="text-micro text-admin-muted mt-0.5">
          Multiplicateur du prix mensuel de base. Ex : 2.7 = 3 mois au prix de 2,7.
        </p>
      </div>

      <div className="px-5 py-5 space-y-4">
        <FieldRow label="Trimestre (× mois)" hint={`→ ${calcLabel(draft.quarterlyMultiplier, 3)}`}>
          <FloatInput value={draft.quarterlyMultiplier} fieldKey="quarterlyMultiplier" />
        </FieldRow>
        <FieldRow label="Semestre (× mois)" hint={`→ ${calcLabel(draft.semiannualMultiplier, 6)}`}>
          <FloatInput value={draft.semiannualMultiplier} fieldKey="semiannualMultiplier" />
        </FieldRow>
        <FieldRow label="Annuel (× mois)" hint={`→ ${calcLabel(draft.annualMultiplier, 12)}`}>
          <FloatInput value={draft.annualMultiplier} fieldKey="annualMultiplier" />
        </FieldRow>
      </div>

      <SaveFeedback saving={saving} ok={ok} error={error} onSubmit={handleSave} />
    </form>
  )
}

// ── Page principale ───────────────────────────────────────────────────────────

export default function PlansAdminPage() {
  const { data, loading, error, refetch } = useAdminQuery(() => adminApi.plans(), [])

  if (error) return <ErrorState message={error} onRetry={refetch} />

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-h2 font-display font-bold text-navy">Plans tarifaires</h2>
        <p className="text-body text-admin-muted">
          Tout changement se reflète immédiatement sur la page Formules des marchands.
        </p>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-admin-card p-5">
          <LoadingState rows={6} />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Plans payants */}
          <div className="grid gap-6 xl:grid-cols-2">
            <PlanCard planKey="pro"     entry={data?.pro}     onSaved={refetch} />
            <PlanCard planKey="premium" entry={data?.premium} onSaved={refetch} />
          </div>

          {/* Gratuit + Remises côte à côte sur grand écran */}
          <div className="grid gap-6 xl:grid-cols-2">
            <TrialCard   data={data}  onSaved={refetch} />
            <DiscountsCard data={data} onSaved={refetch} />
          </div>
        </div>
      )}

      {/* Garde-fou informatif */}
      {!loading && (
        <div className="flex items-start gap-2 text-label text-admin-muted bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <span>
            Une <strong>baisse de quota</strong> de scans est différée au 1er du mois suivant pour ne pas
            pénaliser les abonnés en cours. Toute hausse s'applique immédiatement.
          </span>
        </div>
      )}
    </div>
  )
}
