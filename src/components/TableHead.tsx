import type { Column, SortState } from './tableControls'

function SortArrows({ state }: { state: 'asc' | 'desc' | null }) {
  return (
    <span className="inline-flex flex-col leading-none ml-1" style={{ fontSize: 8 }}>
      <span style={{ opacity: state === 'asc' ? 1 : 0.3, marginBottom: -2 }}>▲</span>
      <span style={{ opacity: state === 'desc' ? 1 : 0.3 }}>▼</span>
    </span>
  )
}

/** Erzeugt die Kopfzeile(n) mit klickbaren Sortier-Headern und optionaler Filterzeile. */
export function TableHead<T>({
  columns,
  sort,
  toggleSort,
  filters,
  setFilter,
  showFilters,
  trailing = 0,
}: {
  columns: Column<T>[]
  sort: SortState
  toggleSort: (key: string) => void
  filters: Record<string, string>
  setFilter: (key: string, value: string) => void
  showFilters: boolean
  /** Anzahl zusätzlicher Spalten ohne Sortierung/Filter (z. B. Aktionen) */
  trailing?: number
}) {
  return (
    <thead>
      <tr style={{ background: 'hsl(218, 55%, 95%)', borderBottom: '1px solid hsl(218, 30%, 88%)' }}>
        {columns.map((col) => {
          const sortable = col.sortable ?? !!col.get
          const state = sort.key === col.key ? sort.dir : null
          return (
            <th
              key={col.key}
              onClick={sortable ? () => toggleSort(col.key) : undefined}
              className={`px-4 py-4 text-xs font-medium uppercase tracking-wide whitespace-nowrap ${col.align === 'right' ? 'text-right' : 'text-left'} ${sortable ? 'cursor-pointer select-none' : ''}`}
              style={{ color: 'hsl(208, 100%, 30%)' }}
            >
              <span className={`inline-flex items-center ${col.align === 'right' ? 'flex-row-reverse' : ''}`}>
                {col.label}
                {sortable && <SortArrows state={state} />}
              </span>
            </th>
          )
        })}
        {Array.from({ length: trailing }).map((_, i) => (
          <th key={`trail-${i}`} />
        ))}
      </tr>
      {showFilters && (
        <tr style={{ background: 'hsl(218, 55%, 97%)', borderBottom: '1px solid hsl(218, 30%, 90%)' }}>
          {columns.map((col) => {
            const filterable = col.filterable ?? !!col.get
            return (
              <th key={col.key} className="px-2 py-2">
                {filterable && (
                  <input
                    value={filters[col.key] ?? ''}
                    onChange={(e) => setFilter(col.key, e.target.value)}
                    placeholder="Filtern…"
                    className="w-full px-2 py-1 text-xs font-normal normal-case tracking-normal border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 transition-colors placeholder:text-slate-300"
                    style={{ '--tw-ring-color': 'hsl(205, 100%, 35%, 0.3)' } as React.CSSProperties}
                  />
                )}
              </th>
            )
          })}
          {Array.from({ length: trailing }).map((_, i) => (
            <th key={`trail-${i}`} />
          ))}
        </tr>
      )}
    </thead>
  )
}

/** Kleiner Umschalt-Button für die Filterzeile. */
export function FilterToggle({
  showFilters,
  setShowFilters,
  activeFilters,
  onClear,
}: {
  showFilters: boolean
  setShowFilters: (v: boolean) => void
  activeFilters: number
  onClear: () => void
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setShowFilters(!showFilters)}
        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border transition-colors"
        style={{
          borderColor: showFilters ? 'hsl(205, 100%, 60%)' : 'hsl(218, 30%, 88%)',
          background: showFilters ? 'hsl(218, 55%, 96%)' : 'white',
          color: showFilters ? 'hsl(208, 100%, 30%)' : '#64748b',
        }}
      >
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        Spaltenfilter
        {activeFilters > 0 && (
          <span className="inline-flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-semibold text-white rounded-full" style={{ background: 'hsl(205, 100%, 35%)' }}>
            {activeFilters}
          </span>
        )}
      </button>
      {activeFilters > 0 && (
        <button type="button" onClick={onClear} className="text-sm text-slate-500 hover:text-slate-700 whitespace-nowrap">
          Zurücksetzen
        </button>
      )}
    </div>
  )
}
