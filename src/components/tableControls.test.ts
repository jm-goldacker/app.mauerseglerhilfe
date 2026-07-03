import { describe, expect, it } from 'vitest'
import { filterAndSortRows, type Column, type SortState } from './tableControls'

interface Row {
  id: number
  name?: string
  km: number
}

const COLUMNS: Column<Row>[] = [
  { key: 'id', label: '#', get: (r) => r.id },
  { key: 'name', label: 'Name', get: (r) => r.name },
  { key: 'km', label: 'km', get: (r) => r.km },
  { key: 'actions', label: '' }, // Spalte ohne get: weder sortier- noch filterbar
]

const ROWS: Row[] = [
  { id: 1, name: 'Mauersegler', km: 10 },
  { id: 2, name: 'amsel', km: 2 },
  { id: 3, name: undefined, km: 7 },
  { id: 4, name: 'Zaunkönig', km: 2.5 },
]

const noSort: SortState = { key: null, dir: 'asc' }

describe('filterAndSortRows – Filterung', () => {
  it('filtert unabhängig von Groß-/Kleinschreibung als Teilstring', () => {
    const result = filterAndSortRows(ROWS, COLUMNS, noSort, { name: 'MAUER' })
    expect(result.map((r) => r.id)).toEqual([1])
  })

  it('kombiniert mehrere Spaltenfilter mit UND', () => {
    const result = filterAndSortRows(ROWS, COLUMNS, noSort, { name: 'a', km: '2' })
    expect(result.map((r) => r.id)).toEqual([2, 4]) // amsel (2), Zaunkönig (2.5)
  })

  it('ignoriert leere Filter und Filter auf Spalten ohne get', () => {
    const result = filterAndSortRows(ROWS, COLUMNS, noSort, { name: '  ', actions: 'x' })
    expect(result).toHaveLength(4)
  })

  it('behandelt fehlende Werte als leeren String', () => {
    const result = filterAndSortRows(ROWS, COLUMNS, noSort, { name: 'segler' })
    expect(result.map((r) => r.id)).toEqual([1])
  })
})

describe('filterAndSortRows – Sortierung', () => {
  it('sortiert Zahlen numerisch, nicht lexikografisch', () => {
    const result = filterAndSortRows(ROWS, COLUMNS, { key: 'km', dir: 'asc' }, {})
    expect(result.map((r) => r.km)).toEqual([2, 2.5, 7, 10])
  })

  it('sortiert absteigend mit demselben Vergleich', () => {
    const result = filterAndSortRows(ROWS, COLUMNS, { key: 'km', dir: 'desc' }, {})
    expect(result.map((r) => r.km)).toEqual([10, 7, 2.5, 2])
  })

  it('sortiert Strings sprachbewusst und stellt leere Werte ans Ende', () => {
    const asc = filterAndSortRows(ROWS, COLUMNS, { key: 'name', dir: 'asc' }, {})
    expect(asc.map((r) => r.name)).toEqual(['amsel', 'Mauersegler', 'Zaunkönig', undefined])

    // Leere Werte bleiben auch absteigend am Ende
    const desc = filterAndSortRows(ROWS, COLUMNS, { key: 'name', dir: 'desc' }, {})
    expect(desc.map((r) => r.name)).toEqual(['Zaunkönig', 'Mauersegler', 'amsel', undefined])
  })

  it('sortiert eingebettete Zahlen in Strings numerisch (numeric collation)', () => {
    const rows: Row[] = [
      { id: 1, name: 'Ring-10', km: 0 },
      { id: 2, name: 'Ring-2', km: 0 },
    ]
    const result = filterAndSortRows(rows, COLUMNS, { key: 'name', dir: 'asc' }, {})
    expect(result.map((r) => r.name)).toEqual(['Ring-2', 'Ring-10'])
  })

  it('behält die Ausgangsreihenfolge ohne Sortierschlüssel bei', () => {
    const result = filterAndSortRows(ROWS, COLUMNS, noSort, {})
    expect(result.map((r) => r.id)).toEqual([1, 2, 3, 4])
  })

  it('verändert das Eingabe-Array nicht', () => {
    const copy = [...ROWS]
    filterAndSortRows(ROWS, COLUMNS, { key: 'km', dir: 'desc' }, {})
    expect(ROWS).toEqual(copy)
  })
})
