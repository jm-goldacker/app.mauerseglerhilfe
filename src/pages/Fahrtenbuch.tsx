import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tripLogsApi } from '../api/queries'
import type { TripLog, TripLogPost } from '../api/types'
import { hasRole } from '../auth/keycloak'
import { PlusIcon, EditIcon, TrashIcon, XIcon, CheckIcon } from '../components/Icons'

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const EMPTY: TripLogPost = {
  date: new Date().toISOString().substring(0, 10),
  driver: '', purpose: '', startLocation: '', endLocation: '', distanceKm: 0,
}

const inputCls = "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-colors placeholder:text-slate-300"

export default function Fahrtenbuch() {
  const qc = useQueryClient()
  const isManager = hasRole('manager')
  const { data: trips = [], isLoading } = useQuery({ queryKey: ['tripLogs'], queryFn: tripLogsApi.getAll })

  const [showForm, setShowForm] = useState(false)
  const [editTrip, setEditTrip] = useState<TripLog | null>(null)
  const [form, setForm] = useState<TripLogPost>(EMPTY)

  const createMut = useMutation({
    mutationFn: tripLogsApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tripLogs'] }); setShowForm(false); setForm(EMPTY) },
  })
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TripLogPost }) => tripLogsApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tripLogs'] }); setEditTrip(null) },
  })
  const deleteMut = useMutation({
    mutationFn: tripLogsApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tripLogs'] }),
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
      <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-slate-200">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Fahrtenbuch</h1>
          <p className="text-sm text-slate-500 mt-0.5">{trips.length} Fahrten · {totalKm.toFixed(1)} km gesamt</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditTrip(null); setForm(EMPTY) }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
          style={{ background: '#7C3AED' }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#6D28D9')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#7C3AED')}
        >
          <PlusIcon size={15} />
          Neue Fahrt
        </button>
      </div>

      <div className="flex-1 overflow-auto px-8 py-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Fahrten gesamt', value: trips.length, unit: '', color: '#7C3AED' },
            { label: 'Kilometer gesamt', value: totalKm.toFixed(1), unit: ' km', color: '#2563EB' },
            { label: 'Ø pro Fahrt', value: trips.length ? (totalKm / trips.length).toFixed(1) : '0', unit: ' km', color: '#0891B2' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}<span className="text-base font-normal text-slate-400">{s.unit}</span></div>
              <div className="text-sm text-slate-600">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Form */}
        {(showForm || editTrip) && (
          <div className="bg-white rounded-xl border border-violet-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100" style={{ background: '#FAFAFA' }}>
              <span className="text-sm font-semibold text-slate-700">{editTrip ? 'Fahrt bearbeiten' : 'Neue Fahrt erfassen'}</span>
              <button onClick={() => { setShowForm(false); setEditTrip(null) }} className="text-slate-400 hover:text-slate-600">
                <XIcon size={15} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-3 gap-5">
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
                <input type="number" step="0.1" min="0" required value={form.distanceKm} onChange={(e) => set('distanceKm', parseFloat(e.target.value) || 0)} className={inputCls} />
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
              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Bemerkungen</label>
                <input value={form.notes ?? ''} onChange={(e) => set('notes', e.target.value)} placeholder="Optional…" className={inputCls} />
              </div>
              <div className="flex items-end gap-2">
                <button type="submit" className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-white transition-colors"
                  style={{ background: '#7C3AED' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#6D28D9')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#7C3AED')}
                >
                  <CheckIcon size={14} />
                  {editTrip ? 'Speichern' : 'Erfassen'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="flex justify-center py-16"><div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #E2E8F0' }}>
                  {['#', 'Datum', 'Fahrer', 'Start', 'Ziel', 'Zweck', 'km', 'Bemerkungen', ''].map((h) => (
                    <th key={h} className="px-4 py-3.5 text-left text-xs font-medium uppercase tracking-wide" style={{ color: '#94A3B8' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trips.map((trip) => (
                  <tr key={trip.id} className="border-b transition-colors" style={{ borderColor: '#F1F5F9' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#FAFAFF')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                  >
                    <td className="px-4 py-4 text-xs font-mono" style={{ color: '#CBD5E1' }}>{String(trip.id).padStart(3, '0')}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-slate-600">{formatDate(trip.date)}</td>
                    <td className="px-4 py-4 font-medium text-slate-800">{trip.driver}</td>
                    <td className="px-4 py-4 text-slate-600">{trip.startLocation}</td>
                    <td className="px-4 py-4 text-slate-600">{trip.endLocation}</td>
                    <td className="px-4 py-4 text-slate-600">{trip.purpose}</td>
                    <td className="px-4 py-4 font-semibold text-right" style={{ color: '#7C3AED' }}>{trip.distanceKm} km</td>
                    <td className="px-4 py-4 text-slate-400 text-xs">{trip.notes ?? ''}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => startEdit(trip)}
                          className="inline-flex items-center justify-center w-7 h-7 rounded-md transition-colors"
                          style={{ color: '#94A3B8' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#7C3AED'; (e.currentTarget as HTMLElement).style.background = '#F3E8FF' }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#94A3B8'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                        ><EditIcon size={13} /></button>
                        {isManager && (
                          <button onClick={() => { if (confirm('Fahrt löschen?')) deleteMut.mutate(trip.id) }}
                            className="inline-flex items-center justify-center w-7 h-7 rounded-md transition-colors"
                            style={{ color: '#94A3B8' }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#E11D48'; (e.currentTarget as HTMLElement).style.background = '#FFF1F2' }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#94A3B8'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                          ><TrashIcon size={13} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              {trips.length > 1 && (
                <tfoot>
                  <tr style={{ background: '#F8F5FF', borderTop: '2px solid #DDD6FE' }}>
                    <td colSpan={6} className="px-3 py-3 text-right text-sm font-semibold text-slate-600">Gesamt</td>
                    <td className="px-3 py-3 text-right font-bold" style={{ color: '#7C3AED' }}>{totalKm.toFixed(1)} km</td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              )}
            </table>
          )}
          {!isLoading && trips.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <p className="font-medium">Noch keine Fahrten erfasst</p>
              <p className="text-sm mt-1">Mit „Neue Fahrt" beginnen</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
