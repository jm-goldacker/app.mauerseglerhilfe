import { useMemo, useState } from 'react'

export type SortDir = 'asc' | 'desc'

export interface SortState {
  key: string | null
  dir: SortDir
}

export interface Column<T> {
  /** Eindeutiger Schlüssel der Spalte (für Sortier- und Filterzustand) */
  key: string
  /** Spaltenüberschrift */
  label: string
  /** Wert der Zelle, der für Sortierung und Filterung herangezogen wird */
  get?: (row: T) => string | number | null | undefined
  /** Sortierbar (Standard: true, sobald get gesetzt ist) */
  sortable?: boolean
  /** Filterbar (Standard: true, sobald get gesetzt ist) */
  filterable?: boolean
  /** Ausrichtung des Zelleninhalts */
  align?: 'left' | 'right'
}

export function useTableControls() {
  const [sort, setSort] = useState<SortState>({ key: null, dir: 'asc' })
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [showFilters, setShowFilters] = useState(false)

  function toggleSort(key: string) {
    setSort((s) =>
      s.key !== key
        ? { key, dir: 'asc' }
        : s.dir === 'asc'
          ? { key, dir: 'desc' }
          : { key: null, dir: 'asc' }, // dritter Klick hebt Sortierung auf
    )
  }

  function setFilter(key: string, value: string) {
    setFilters((f) => ({ ...f, [key]: value }))
  }

  function clearFilters() {
    setFilters({})
  }

  const activeFilters = Object.values(filters).filter((v) => v.trim() !== '').length

  return { sort, toggleSort, filters, setFilter, clearFilters, showFilters, setShowFilters, activeFilters }
}

/** Wendet aktive Filter und Sortierung auf die Zeilen an (pure Funktion, testbar). */
export function filterAndSortRows<T>(
  rows: T[],
  columns: Column<T>[],
  sort: SortState,
  filters: Record<string, string>,
): T[] {
  const byKey = new Map(columns.map((c) => [c.key, c]))

  let result = rows.filter((row) =>
    Object.entries(filters).every(([key, value]) => {
      const q = value.trim().toLowerCase()
      if (!q) return true
      const col = byKey.get(key)
      if (!col?.get) return true
      const cell = col.get(row)
      return String(cell ?? '').toLowerCase().includes(q)
    }),
  )

  if (sort.key) {
    const col = byKey.get(sort.key)
    if (col?.get) {
      const factor = sort.dir === 'asc' ? 1 : -1
      result = [...result].sort((a, b) => {
        const av = col.get!(a)
        const bv = col.get!(b)
        // Leere Werte immer ans Ende sortieren
        const aEmpty = av === null || av === undefined || av === ''
        const bEmpty = bv === null || bv === undefined || bv === ''
        if (aEmpty && bEmpty) return 0
        if (aEmpty) return 1
        if (bEmpty) return -1
        if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * factor
        return String(av).localeCompare(String(bv), 'de', { numeric: true }) * factor
      })
    }
  }

  return result
}

/** Memoisierte Variante von filterAndSortRows für den Einsatz in Komponenten. */
export function useSortedRows<T>(
  rows: T[],
  columns: Column<T>[],
  sort: SortState,
  filters: Record<string, string>,
) {
  return useMemo(() => filterAndSortRows(rows, columns, sort, filters), [rows, columns, sort, filters])
}
