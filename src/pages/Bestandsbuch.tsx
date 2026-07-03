import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { logEntriesApi } from '../api/queries'
import type { LogEntry } from '../api/types'
import { PlusIcon, SearchIcon, EditIcon } from '../components/Icons'
import { type Column, useTableControls, useSortedRows, TableHead, FilterToggle } from '../components/tableControls'
import QueryError from '../components/QueryError'
import { PrimaryButton, IconButton } from '../components/ui'
import { formatDate } from '../utils/date'

function getVerbleib(entry: LogEntry) {
  if (entry.dispositionType) return entry.dispositionType
  if (entry.euthanasiaDate) return 'euthanasiert'
  if (entry.diedDate) return 'verstorben'
  if (entry.letFreeDate) return 'ausgewildert'
  return null
}

function getVerbleibDate(entry: LogEntry) {
  return entry.letFreeDate || entry.diedDate || entry.euthanasiaDate
}

const COLUMNS: Column<LogEntry>[] = [
  { key: 'id', label: '#', get: (e) => e.id },
  { key: 'date', label: 'Datum', get: (e) => e.date },
  { key: 'name', label: 'Name', get: (e) => e.name },
  { key: 'ringNumber', label: 'Ringnummer', get: (e) => e.ringNumber },
  { key: 'birdSpecies', label: 'Vogelart', get: (e) => e.birdSpecies },
  { key: 'age', label: 'Alter', get: (e) => e.age },
  { key: 'serviceType', label: 'Leistungsart', get: (e) => e.serviceType },
  { key: 'referrer', label: 'Vermittelt durch', get: (e) => e.referrer },
  { key: 'takenInDate', label: 'Aufnahme', get: (e) => e.takenInDate },
  { key: 'takenInBy', label: 'Von', get: (e) => e.takenInBy },
  { key: 'careStation', label: 'Pflegestelle', get: (e) => e.careStation },
  { key: 'zipFoundAt', label: 'PLZ', get: (e) => e.zipFoundAt },
  { key: 'circumstance', label: 'Fundumstand', get: (e) => e.circumstance },
  { key: 'redirectedTo', label: 'Weiterleitung', get: (e) => e.redirectedTo },
  { key: 'verbleibDate', label: 'Verbleib am', get: (e) => getVerbleibDate(e) },
  { key: 'verbleib', label: 'Verbleib', get: (e) => getVerbleib(e) },
]

const verbleibStyle: Record<string, { bg: string; text: string; dot: string }> = {
  'ausgewildert':  { bg: '#ecfdf5', text: '#065f46', dot: '#10b981' },
  'vermittelt':    { bg: '#eff6ff', text: '#1e40af', dot: '#3b82f6' },
  'weitergeleitet':{ bg: '#eff6ff', text: '#1e40af', dot: '#3b82f6' },
  'verstorben':    { bg: '#fff1f2', text: '#9f1239', dot: '#f43f5e' },
  'euthanasiert':  { bg: 'hsl(31, 100%, 95%)', text: 'hsl(31, 100%, 25%)', dot: 'hsl(31, 100%, 47%)' },
  'unbekannt':     { bg: '#f8fafc', text: '#64748b', dot: '#94a3b8' },
}

const ageStyle: Record<string, { bg: string; text: string }> = {
  'Küken':     { bg: 'hsl(218, 55%, 91%)', text: 'hsl(208, 100%, 20%)' },
  'Jungvogel': { bg: 'hsl(205, 100%, 92%)', text: 'hsl(205, 100%, 25%)' },
  'Altvogel':  { bg: 'hsl(31, 100%, 92%)', text: 'hsl(31, 100%, 30%)' },
}

function VerbleibBadge({ value }: { value: string }) {
  const s = verbleibStyle[value] ?? { bg: '#f8fafc', text: '#64748b', dot: '#94a3b8' }
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
      style={{ background: s.bg, color: s.text }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
      {value}
    </span>
  )
}

function AgeBadge({ value }: { value: string }) {
  const s = ageStyle[value] ?? { bg: '#f1f5f9', text: '#475569' }
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
        <div key={i} className="h-10 rounded-lg animate-pulse" style={{ background: 'hsl(218, 30%, 88%)', opacity: 1 - i * 0.08 }} />
      ))}
    </div>
  )
}

export default function Bestandsbuch() {
  const navigate = useNavigate()
  const { data: entries = [], isLoading, isError, error: loadError, refetch } = useQuery({ queryKey: ['logEntries'], queryFn: logEntriesApi.getAll })
  const [search, setSearch] = useState('')
  const [filterYear, setFilterYear] = useState('')
  const { sort, toggleSort, filters, setFilter, clearFilters, showFilters, setShowFilters, activeFilters } = useTableControls()

  const years = useMemo(
    () => [...new Set(entries.map((e) => new Date(e.date).getFullYear()))].sort((a, b) => b - a),
    [entries],
  )

  // Memoisiert, damit useSortedRows nicht bei jedem Render neu filtert/sortiert
  const searched = useMemo(() => entries
    .filter((e) => {
      const q = search.toLowerCase()
      const matchSearch = !q ||
        (e.name ?? '').toLowerCase().includes(q) ||
        (e.ringNumber ?? '').toLowerCase().includes(q) ||
        e.birdSpecies.toLowerCase().includes(q) ||
        e.circumstance.toLowerCase().includes(q) ||
        (e.zipFoundAt ?? '').includes(q) ||
        (e.takenInBy ?? '').toLowerCase().includes(q) ||
        (e.referrer ?? '').toLowerCase().includes(q)
      return matchSearch && (!filterYear || new Date(e.date).getFullYear() === Number(filterYear))
    })
    .sort((a, b) => a.id - b.id), [entries, search, filterYear])

  const filtered = useSortedRows(searched, COLUMNS, sort, filters)

  return (
    <div className="flex flex-col h-full">
      {/* Topbar */}
      <div className="flex items-center justify-between bg-white border-b border-slate-200" style={{ padding: '24px 48px' }}>
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900">Bestandsbuch</h1>
          <p className="text-sm text-slate-500 mt-0.5">{entries.length} Einträge gesamt</p>
        </div>
        <PrimaryButton onClick={() => navigate('/eintrag/neu')} className="whitespace-nowrap">
          <PlusIcon size={15} />
          Neuer Eintrag
        </PrimaryButton>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 bg-white border-b border-slate-100" style={{ padding: '14px 48px' }}>
        <div className="relative flex-1 max-w-md">
          <SearchIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, Ringnummer, Vogelart, PLZ, Aufgenommen von…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:bg-white transition-colors"
            style={{ '--tw-ring-color': 'hsl(205, 100%, 35%, 0.3)' } as React.CSSProperties}
          />
        </div>
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none text-slate-700"
        >
          <option value="">Alle Jahre</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <FilterToggle showFilters={showFilters} setShowFilters={setShowFilters} activeFilters={activeFilters} onClear={clearFilters} />
        {(search || filterYear || activeFilters > 0 || sort.key) && (
          <span className="text-sm text-slate-500 whitespace-nowrap">{filtered.length} Treffer</span>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto" style={{ padding: '36px 48px' }}>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          {isLoading ? (
            <Skeleton />
          ) : isError ? (
            <QueryError message={loadError?.message} onRetry={() => refetch()} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse min-w-[1460px]">
                <TableHead columns={COLUMNS} sort={sort} toggleSort={toggleSort} filters={filters} setFilter={setFilter} showFilters={showFilters} trailing={1} />
                <tbody>
                  {filtered.map((entry) => {
                    const verbleib = getVerbleib(entry)
                    const verbleibDate = getVerbleibDate(entry)
                    return (
                      <tr
                        key={entry.id}
                        onClick={() => navigate(`/eintrag/${entry.id}`)}
                        className="cursor-pointer border-b transition-colors"
                        style={{ borderBottom: '1px solid #f1f5f9' }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'hsl(218, 55%, 97%)')}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                      >
                        <td className="px-5 py-4 text-xs font-mono text-slate-300">{String(entry.id).padStart(3, '0')}</td>
                        <td className="px-5 py-4 whitespace-nowrap text-slate-600">{formatDate(entry.date)}</td>
                        <td className="px-5 py-4 font-medium text-slate-900">{entry.name ?? <span className="text-slate-300">—</span>}</td>
                        <td className="px-5 py-4 font-mono text-slate-600">{entry.ringNumber ?? <span className="font-sans text-slate-300">—</span>}</td>
                        <td className="px-5 py-4 text-slate-600">{entry.birdSpecies}</td>
                        <td className="px-4 py-4"><AgeBadge value={entry.age} /></td>
                        <td className="px-5 py-4 text-slate-500">{entry.serviceType ?? '—'}</td>
                        <td className="px-5 py-4 text-slate-500">{entry.referrer ?? '—'}</td>
                        <td className="px-5 py-4 whitespace-nowrap text-slate-500">{formatDate(entry.takenInDate)}</td>
                        <td className="px-5 py-4 text-slate-600">{entry.takenInBy ?? '—'}</td>
                        <td className="px-5 py-4 text-slate-500">{entry.careStation ?? '—'}</td>
                        <td className="px-5 py-4 font-mono text-slate-500">{entry.zipFoundAt ?? '—'}</td>
                        <td className="px-5 py-4 text-slate-500 max-w-48 truncate">{entry.circumstance}</td>
                        <td className="px-5 py-4 text-slate-500">{entry.redirectedTo ?? '—'}</td>
                        <td className="px-5 py-4 whitespace-nowrap text-slate-500">{formatDate(verbleibDate)}</td>
                        <td className="px-4 py-4 whitespace-nowrap">{verbleib ? <VerbleibBadge value={verbleib} /> : <span className="text-slate-300 text-xs whitespace-nowrap">in Pflege</span>}</td>
                        <td className="px-4 py-4 w-12" onClick={(e) => e.stopPropagation()}>
                          <IconButton onClick={() => navigate(`/eintrag/${entry.id}`)} title="Eintrag bearbeiten" aria-label="Eintrag bearbeiten">
                            <EditIcon size={13} />
                          </IconButton>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
          {!isLoading && !isError && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20" style={{ color: 'hsl(208, 30%, 60%)' }}>
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
