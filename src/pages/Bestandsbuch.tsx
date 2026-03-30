import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { logEntriesApi } from '../api/queries'
import type { LogEntry } from '../api/types'
import { PlusIcon, SearchIcon, EditIcon } from '../components/Icons'

function formatDate(d?: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function getVerbleib(entry: LogEntry) {
  if (entry.dispositionType) return entry.dispositionType
  if (entry.euthanasiaDate) return 'euthanasiert'
  if (entry.diedDate) return 'verstorben'
  if (entry.letFreeDate) return 'ausgewildert'
  return null
}

const verbleibStyle: Record<string, { bg: string; text: string; dot: string }> = {
  'ausgewildert': { bg: '#F0FDF4', text: '#15803D', dot: '#22C55E' },
  'vermittelt':   { bg: '#EFF6FF', text: '#1D4ED8', dot: '#3B82F6' },
  'weitergeleitet':{ bg: '#EFF6FF', text: '#1D4ED8', dot: '#3B82F6' },
  'verstorben':   { bg: '#FFF1F2', text: '#BE123C', dot: '#F43F5E' },
  'euthanasiert': { bg: '#FFF7ED', text: '#C2410C', dot: '#F97316' },
  'unbekannt':    { bg: '#F8FAFC', text: '#64748B', dot: '#94A3B8' },
}

const ageStyle: Record<string, { bg: string; text: string }> = {
  'Küken':     { bg: '#FEF9C3', text: '#854D0E' },
  'Jungvogel': { bg: '#DBEAFE', text: '#1E40AF' },
  'Altvogel':  { bg: '#F3E8FF', text: '#6B21A8' },
}

function VerbleibBadge({ value }: { value: string }) {
  const s = verbleibStyle[value] ?? { bg: '#F8FAFC', text: '#64748B', dot: '#94A3B8' }
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
      style={{ background: s.bg, color: s.text }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
      {value}
    </span>
  )
}

function AgeBadge({ value }: { value: string }) {
  const s = ageStyle[value] ?? { bg: '#F1F5F9', text: '#475569' }
  return (
    <span className="inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ background: s.bg, color: s.text }}>
      {value}
    </span>
  )
}

function Skeleton() {
  return (
    <div className="space-y-1 p-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-10 rounded-lg animate-pulse" style={{ background: '#E2E8F0', opacity: 1 - i * 0.08 }} />
      ))}
    </div>
  )
}

export default function Bestandsbuch() {
  const navigate = useNavigate()
  const { data: entries = [], isLoading } = useQuery({ queryKey: ['logEntries'], queryFn: logEntriesApi.getAll })
  const [search, setSearch] = useState('')
  const [filterYear, setFilterYear] = useState('')

  const years = [...new Set(entries.map((e) => new Date(e.date).getFullYear()))].sort((a, b) => b - a)

  const filtered = entries.filter((e) => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      e.birdSpecies.toLowerCase().includes(q) ||
      e.circumstance.toLowerCase().includes(q) ||
      (e.zipFoundAt ?? '').includes(q) ||
      (e.takenInBy ?? '').toLowerCase().includes(q)
    return matchSearch && (!filterYear || new Date(e.date).getFullYear() === Number(filterYear))
  })

  return (
    <div className="flex flex-col h-full">
      {/* Topbar */}
      <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-slate-200">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Bestandsbuch</h1>
          <p className="text-sm text-slate-500 mt-0.5">{entries.length} Einträge gesamt</p>
        </div>
        <button
          onClick={() => navigate('/eintrag/neu')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
          style={{ background: '#7C3AED' }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#6D28D9')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#7C3AED')}
        >
          <PlusIcon size={15} />
          Neuer Eintrag
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 px-8 py-3.5 bg-white border-b border-slate-100">
        <div className="relative flex-1 max-w-md">
          <SearchIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Vogelart, Fundumstand, PLZ, Aufgenommen von…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:bg-white transition-colors"
            style={{ '--tw-ring-color': '#7C3AED40' } as React.CSSProperties}
          />
        </div>
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 text-slate-700"
        >
          <option value="">Alle Jahre</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        {(search || filterYear) && (
          <span className="text-sm text-slate-500">{filtered.length} Treffer</span>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-8 py-6">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          {isLoading ? (
            <Skeleton />
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #E2E8F0' }}>
                  {['#', 'Datum', 'Vogelart', 'Alter', 'Leistungsart', 'Aufnahme', 'Von', 'PLZ', 'Fundumstand', 'Weiterleitung', 'Verbleib am', 'Verbleib', ''].map((h) => (
                    <th key={h} className="px-4 py-3.5 text-left font-medium text-xs uppercase tracking-wide" style={{ color: '#94A3B8' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry) => {
                  const verbleib = getVerbleib(entry)
                  const verbleibDate = entry.letFreeDate || entry.diedDate || entry.euthanasiaDate
                  return (
                    <tr
                      key={entry.id}
                      onClick={() => navigate(`/eintrag/${entry.id}`)}
                      className="cursor-pointer border-b border-slate-100 transition-colors"
                      style={{ borderBottom: '1px solid #F1F5F9' }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#FAFAFF')}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                    >
                      <td className="px-4 py-4text-xs font-mono" style={{ color: '#CBD5E1' }}>{String(entry.id).padStart(3, '0')}</td>
                      <td className="px-4 py-4whitespace-nowrap text-slate-600">{formatDate(entry.date)}</td>
                      <td className="px-4 py-4font-medium text-slate-900">{entry.birdSpecies}</td>
                      <td className="px-3 py-3"><AgeBadge value={entry.age} /></td>
                      <td className="px-4 py-4text-slate-500">{entry.serviceType ?? '—'}</td>
                      <td className="px-4 py-4whitespace-nowrap text-slate-500">{formatDate(entry.takenInDate)}</td>
                      <td className="px-4 py-4text-slate-600">{entry.takenInBy ?? '—'}</td>
                      <td className="px-4 py-4font-mono text-slate-500">{entry.zipFoundAt ?? '—'}</td>
                      <td className="px-4 py-4text-slate-500 max-w-48 truncate">{entry.circumstance}</td>
                      <td className="px-4 py-4text-slate-500">{entry.careStation ?? entry.redirectedTo ?? '—'}</td>
                      <td className="px-4 py-4whitespace-nowrap text-slate-500">{formatDate(verbleibDate)}</td>
                      <td className="px-3 py-3">{verbleib ? <VerbleibBadge value={verbleib} /> : <span className="text-slate-300 text-xs">in Pflege</span>}</td>
                      <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/eintrag/${entry.id}`)}
                          className="inline-flex items-center justify-center w-7 h-7 rounded-md transition-colors"
                          style={{ color: '#94A3B8' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#7C3AED'; (e.currentTarget as HTMLElement).style.background = '#F3E8FF' }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#94A3B8'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                        >
                          <EditIcon size={13} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
          {!isLoading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <SearchIcon size={36} className="mb-3 opacity-30" />
              <p className="font-medium">Keine Einträge gefunden</p>
              <p className="text-sm mt-1">Suchbegriff oder Filter anpassen</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
