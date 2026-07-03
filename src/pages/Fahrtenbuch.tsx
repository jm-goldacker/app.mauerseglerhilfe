import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tripLogsApi } from '../api/queries'
import type { TripLog, TripLogPost } from '../api/types'
import { hasRole } from '../auth/keycloak'
import { PlusIcon, EditIcon, TrashIcon, XIcon, CheckIcon } from '../components/Icons'
import { type Column, useTableControls, useSortedRows, TableHead, FilterToggle } from '../components/tableControls'
import QueryError from '../components/QueryError'
import { PrimaryButton, IconButton } from '../components/ui'
import { formatDate, todayISO } from '../utils/date'

const COLUMNS: Column<TripLog>[] = [
  { key: 'id', label: '#', get: (t) => t.id },
  { key: 'date', label: 'Datum', get: (t) => t.date },
  { key: 'driver', label: 'Fahrer', get: (t) => t.driver },
  { key: 'startLocation', label: 'Start', get: (t) => t.startLocation },
  { key: 'endLocation', label: 'Ziel', get: (t) => t.endLocation },
  { key: 'purpose', label: 'Zweck', get: (t) => t.purpose },
  { key: 'distanceKm', label: 'km', get: (t) => t.distanceKm, align: 'right' },
  { key: 'notes', label: 'Bemerkungen', get: (t) => t.notes },
]

const EMPTY: TripLogPost = {
  date: todayISO(),
  driver: '', purpose: '', startLocation: '', endLocation: '', distanceKm: 0,
}

const inputCls = "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 transition-colors placeholder:text-slate-300"

export default function Fahrtenbuch() {
  const qc = useQueryClient()
  const isManager = hasRole('manager')
  const { data: trips = [], isLoading, isError, error: loadError, refetch } = useQuery({ queryKey: ['tripLogs'], queryFn: tripLogsApi.getAll })

  const [showForm, setShowForm] = useState(false)
  const [editTrip, setEditTrip] = useState<TripLog | null>(null)
  const [form, setForm] = useState<TripLogPost>(EMPTY)

  const { sort, toggleSort, filters, setFilter, clearFilters, showFilters, setShowFilters, activeFilters } = useTableControls()
  const sorted = useSortedRows(trips, COLUMNS, sort, filters)

  const [error, setError] = useState('')

  const createMut = useMutation({
    mutationFn: tripLogsApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tripLogs'] }); setShowForm(false); setForm(EMPTY); setError('') },
    onError: (e: Error) => setError(`Erfassen fehlgeschlagen: ${e.message}`),
  })
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TripLogPost }) => tripLogsApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tripLogs'] }); setEditTrip(null); setError('') },
    onError: (e: Error) => setError(`Speichern fehlgeschlagen: ${e.message}`),
  })
  const deleteMut = useMutation({
    mutationFn: tripLogsApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tripLogs'] }); setError('') },
    onError: (e: Error) => setError(`Löschen fehlgeschlagen: ${e.message}`),
  })

  const totalKm = trips.reduce((s, t) => s + t.distanceKm, 0)

  function set(field: keyof TripLogPost, value: string | number) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = { ...form, date: new Date(form.date).toISOString() }
    if (editTrip) updateMut.mutate({ id: editTrip.id, data: payload })
    else createMut.mutate(payload)
  }

  function startEdit(trip: TripLog) {
    setEditTrip(trip)
    setShowForm(false)
    setForm({ date: trip.date.substring(0, 10), driver: trip.driver, purpose: trip.purpose, startLocation: trip.startLocation, endLocation: trip.endLocation, distanceKm: trip.distanceKm, notes: trip.notes })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border-b border-slate-200" style={{ padding: '24px 48px' }}>
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900">Fahrtenbuch</h1>
          <p className="text-sm text-slate-500 mt-0.5">{trips.length} Fahrten · {totalKm.toFixed(1)} km gesamt</p>
        </div>
        <PrimaryButton onClick={() => { setShowForm(true); setEditTrip(null); setForm(EMPTY) }} className="whitespace-nowrap">
          <PlusIcon size={15} />
          Neue Fahrt
        </PrimaryButton>
      </div>

      <div className="flex-1 overflow-auto" style={{ padding: '36px 48px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        {error && (
          <div className="px-4 py-3 rounded-lg text-sm border -mb-4" style={{ background: '#fff1f2', color: '#be123c', borderColor: '#fecdd3' }}>
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {[
            { label: 'Fahrten gesamt', value: trips.length, unit: '', color: 'hsl(205, 100%, 35%)' },
            { label: 'Kilometer gesamt', value: totalKm.toFixed(1), unit: ' km', color: 'hsl(31, 100%, 47%)' },
            { label: 'Ø pro Fahrt', value: trips.length ? (totalKm / trips.length).toFixed(1) : '0', unit: ' km', color: 'hsl(31, 100%, 36%)' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-5 sm:p-7 shadow-sm">
              <div className="text-xl sm:text-2xl font-bold mb-1" style={{ color: s.color }}>
                {s.value}<span className="text-sm sm:text-base font-normal text-slate-400">{s.unit}</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-600">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Form */}
        {(showForm || editTrip) && (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden"
            style={{ borderColor: 'hsl(205, 100%, 80%)' }}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100"
              style={{ background: 'hsl(218, 55%, 96%)' }}>
              <span className="text-sm font-semibold" style={{ color: 'hsl(208, 100%, 20%)' }}>
                {editTrip ? 'Fahrt bearbeiten' : 'Neue Fahrt erfassen'}
              </span>
              <button onClick={() => { setShowForm(false); setEditTrip(null) }} title="Schließen" aria-label="Schließen" className="text-slate-400 hover:text-slate-600">
                <XIcon size={15} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Datum *</label>
                <input type="date" required value={form.date} onChange={(e) => set('date', e.target.value)} className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Fahrer *</label>
                <input required value={form.driver} onChange={(e) => set('driver', e.target.value)} placeholder="Name…" className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Kilometer *</label>
                <input type="number" step="0.1" min="0" required value={form.distanceKm}
                  onChange={(e) => set('distanceKm', parseFloat(e.target.value) || 0)} className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Startort *</label>
                <input required value={form.startLocation} onChange={(e) => set('startLocation', e.target.value)} placeholder="Start…" className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Zielort *</label>
                <input required value={form.endLocation} onChange={(e) => set('endLocation', e.target.value)} placeholder="Ziel…" className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Zweck *</label>
                <input required value={form.purpose} onChange={(e) => set('purpose', e.target.value)} placeholder="z. B. Tiertransport…" className={inputCls} />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Bemerkungen</label>
                <input value={form.notes ?? ''} onChange={(e) => set('notes', e.target.value)} placeholder="Optional…" className={inputCls} />
              </div>
              <div className="flex items-end">
                <PrimaryButton type="submit" className="w-full">
                  <CheckIcon size={14} />
                  {editTrip ? 'Speichern' : 'Erfassen'}
                </PrimaryButton>
              </div>
            </form>
          </div>
        )}

        {/* Toolbar */}
        {!isLoading && trips.length > 0 && (
          <div className="flex items-center gap-3 -mb-4">
            <FilterToggle showFilters={showFilters} setShowFilters={setShowFilters} activeFilters={activeFilters} onClear={clearFilters} />
            {(activeFilters > 0 || sort.key) && (
              <span className="text-sm text-slate-500 whitespace-nowrap">{sorted.length} von {trips.length}</span>
            )}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: 'hsl(205, 100%, 35%)', borderTopColor: 'transparent' }} />
            </div>
          ) : isError ? (
            <QueryError message={loadError?.message} onRetry={() => refetch()} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse min-w-[700px]">
                <TableHead columns={COLUMNS} sort={sort} toggleSort={toggleSort} filters={filters} setFilter={setFilter} showFilters={showFilters} trailing={1} />
                <tbody>
                  {sorted.map((trip) => (
                    <tr key={trip.id} className="border-b transition-colors" style={{ borderColor: '#f1f5f9' }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'hsl(218, 55%, 97%)')}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                    >
                      <td className="px-4 py-4 text-xs font-mono text-slate-300">{String(trip.id).padStart(3, '0')}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-slate-600">{formatDate(trip.date)}</td>
                      <td className="px-4 py-4 font-medium text-slate-800">{trip.driver}</td>
                      <td className="px-4 py-4 text-slate-600">{trip.startLocation}</td>
                      <td className="px-4 py-4 text-slate-600">{trip.endLocation}</td>
                      <td className="px-4 py-4 text-slate-600">{trip.purpose}</td>
                      <td className="px-4 py-4 font-semibold text-right whitespace-nowrap" style={{ color: 'hsl(31, 100%, 47%)' }}>
                        {trip.distanceKm} km
                      </td>
                      <td className="px-4 py-4 text-slate-400 text-xs">{trip.notes ?? ''}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <IconButton onClick={() => startEdit(trip)} title="Bearbeiten" aria-label="Bearbeiten">
                            <EditIcon size={13} />
                          </IconButton>
                          {isManager && (
                            <IconButton danger onClick={() => { if (confirm('Fahrt löschen?')) deleteMut.mutate(trip.id) }} title="Löschen" aria-label="Löschen">
                              <TrashIcon size={13} />
                            </IconButton>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {sorted.length > 1 && (
                  <tfoot>
                    <tr style={{ background: 'hsl(218, 55%, 95%)', borderTop: '2px solid hsl(218, 30%, 85%)' }}>
                      <td colSpan={6} className="px-4 py-3 text-right text-sm font-semibold text-slate-600">Gesamt</td>
                      <td className="px-4 py-3 text-right font-bold whitespace-nowrap" style={{ color: 'hsl(31, 100%, 47%)' }}>
                        {sorted.reduce((s, t) => s + t.distanceKm, 0).toFixed(1)} km
                      </td>
                      <td colSpan={2} />
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          )}
          {!isLoading && !isError && trips.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <p className="font-medium">Noch keine Fahrten erfasst</p>
              <p className="text-sm mt-1">Mit „Neue Fahrt" beginnen</p>
            </div>
          )}
          {!isLoading && trips.length > 0 && sorted.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <p className="font-medium">Keine Fahrten gefunden</p>
              <p className="text-sm mt-1">Filter anpassen</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
