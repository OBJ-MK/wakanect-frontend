import { useState, useCallback, useEffect } from 'react'
import { Download, AlertCircle } from 'lucide-react'
import { adminApi } from '@/services/adminApi'
import { useAdminQuery } from '@/hooks/useAdminQuery'
import { DataTable } from '@/components/admin/DataTable'
import { AdminBadge } from '@/components/admin/AdminBadge'
import { LoadingState } from '@/components/admin/LoadingState'
import { ErrorState } from '@/components/admin/ErrorState'
import { EmptyState } from '@/components/admin/EmptyState'
import { RangeSelector } from '@/components/admin/RangeSelector'

const TIER_VARIANT = { regex: 'regex', cloudflare: 'cloudflare', haiku: 'haiku', failed: 'failed' }

const TOP_COLS = [
  { key: 'name',        label: 'Boutique' },
  { key: 'country',     label: 'Pays' },
  { key: 'haikuCalls',  label: 'Appels Haiku', className: 'text-right' },
  { key: 'tokens',      label: 'Tokens',        className: 'text-right' },
  { key: 'escalatePct', label: '% escalade',    className: 'text-right' },
  { key: 'costFcfa',    label: 'Coût (XOF)',     className: 'text-right' },
  { key: 'anomaly',     label: 'Anomalie' },
]

const EVENT_COLS = [
  { key: 'at',                label: 'Horodatage' },
  { key: 'slug',              label: 'Boutique' },
  { key: 'tierResolved',      label: 'Tier' },
  { key: 'tokens',            label: 'Tokens',    className: 'text-right' },
  { key: 'confidence',        label: 'Confiance', className: 'text-right' },
  { key: 'producedValidProduct', label: 'Valide' },
]

function fmtCurrency(n) {
  return n != null
    ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n)
    : '—'
}

export default function ParsingJournalPage() {
  const [range, setRange] = useState('7d')
  const [cursor, setCursor] = useState(null)
  const [allEvents, setAllEvents] = useState([])

  const { data: topData, loading: topLoading, error: topError, refetch: refetchTop } =
    useAdminQuery(() => adminApi.parsingTop(range), [range])

  // Pure fetch — no state side-effects inside fetchFn.
  const { data: eventsPage, loading: eventsLoading, error: eventsError, refetch: refetchEvents } =
    useAdminQuery(() => adminApi.parsingEvents(null, 50), [range])

  // Apply fetched page once available; reset on range change.
  useEffect(() => {
    if (!eventsPage) return
    setAllEvents(eventsPage.rows ?? [])
    setCursor(eventsPage.nextCursor ?? null)
  }, [eventsPage])

  const loadEvents = useCallback(
    () => adminApi.parsingEvents(cursor, 50)
      .then(res => {
        setAllEvents(prev => [...prev, ...res.rows])
        setCursor(res.nextCursor ?? null)
      }),
    [cursor],
  )

  function handleExportCSV() {
    if (allEvents.length === 0) return

    const headers = ['Horodatage', 'Boutique', 'Tier', 'Tokens', 'Confiance', 'Valide']
    const rows = allEvents.map(e => [
      e.at ?? '',
      e.slug ?? '',
      e.tierResolved ?? '',
      e.tokens ?? '',
      e.confidence != null ? (e.confidence * 100).toFixed(1) + '%' : '',
      e.producedValidProduct ? 'Oui' : 'Non',
    ])

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `parsing-events-${range}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (topError) return <ErrorState message={topError} onRetry={refetchTop} />

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-h2 font-display font-bold text-navy">Journal de parsing</h2>
          <p className="text-body text-admin-muted">Consommateurs et flux d'événements</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <RangeSelector value={range} onChange={v => { setRange(v); setAllEvents([]); setCursor(null) }} />
          <button
            onClick={handleExportCSV}
            disabled={allEvents.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 text-label font-medium bg-navy text-white rounded-lg hover:bg-navy-deep transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>
        </div>
      </div>

      {/* Top consommateurs */}
      <div className="bg-white rounded-xl shadow-admin-card overflow-hidden">
        <div className="px-4 py-3.5 border-b border-admin-line">
          <h3 className="text-h3 font-semibold text-navy">Top consommateurs Haiku</h3>
        </div>
        {topLoading ? (
          <div className="p-4"><LoadingState rows={5} /></div>
        ) : (
          <DataTable
            columns={TOP_COLS.map(col => ({
              ...col,
              render: col.key === 'anomaly'
                ? (val) => val ? <AdminBadge variant="error" label="Anomalie" /> : null
                : col.key === 'costFcfa'
                ? (val) => <span className="tabular-nums">{fmtCurrency(val)}</span>
                : col.key === 'escalatePct'
                ? (val) => <span className="tabular-nums">{val}%</span>
                : col.key === 'haikuCalls' || col.key === 'tokens'
                ? (val) => <span className="tabular-nums">{fmtCurrency(val)}</span>
                : undefined,
            }))}
            rows={topData?.rows ?? []}
            emptyNode={<EmptyState icon={AlertCircle} title="Aucune donnée" className="py-8" />}
          />
        )}
      </div>

      {/* Flux ParsingEvent paginé */}
      <div className="bg-white rounded-xl shadow-admin-card overflow-hidden">
        <div className="px-4 py-3.5 border-b border-admin-line">
          <h3 className="text-h3 font-semibold text-navy">Événements de parsing</h3>
        </div>
        {eventsLoading && allEvents.length === 0 ? (
          <div className="p-4"><LoadingState rows={8} /></div>
        ) : eventsError ? (
          <ErrorState message={eventsError} onRetry={refetchEvents} className="py-8" />
        ) : (
          <>
            <DataTable
              columns={EVENT_COLS.map(col => ({
                ...col,
                render: col.key === 'tierResolved'
                  ? (val) => <AdminBadge variant={TIER_VARIANT[val] ?? 'default'} label={val} />
                  : col.key === 'producedValidProduct'
                  ? (val) => (
                      <span className={`text-micro font-medium ${val ? 'text-wa-green' : 'text-danger'}`}>
                        {val ? '✓ Oui' : '✗ Non'}
                      </span>
                    )
                  : col.key === 'confidence'
                  ? (val) => val != null ? <span className="tabular-nums">{(val * 100).toFixed(0)}%</span> : '—'
                  : col.key === 'tokens'
                  ? (val) => val != null ? <span className="tabular-nums">{val}</span> : '—'
                  : undefined,
              }))}
              rows={allEvents}
              emptyNode={<EmptyState icon={AlertCircle} title="Aucun événement" className="py-8" />}
            />
            {cursor && (
              <div className="p-4 border-t border-admin-line text-center">
                <button
                  onClick={loadEvents}
                  className="px-4 py-2 text-label font-medium text-navy border border-admin-line rounded-lg hover:bg-admin-fill transition-colors"
                >
                  Charger plus
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
