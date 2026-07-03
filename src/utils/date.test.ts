import { describe, expect, it } from 'vitest'
import { formatDate, todayISO, toInputDate } from './date'

describe('formatDate', () => {
  it('formatiert gespeicherte UTC-Mitternacht als deutschen Kalendertag', () => {
    expect(formatDate('2026-07-02T00:00:00Z')).toBe('02.07.2026')
  })

  it('verschiebt den Tag auch am Jahresende nicht (UTC-Formatierung)', () => {
    // In Zeitzonen westlich von UTC würde lokale Formatierung hier den 30.12. liefern
    expect(formatDate('2026-12-31T00:00:00Z')).toBe('31.12.2026')
  })

  it('liefert einen Gedankenstrich für fehlende Werte', () => {
    expect(formatDate(undefined)).toBe('—')
    expect(formatDate('')).toBe('—')
  })
})

describe('todayISO', () => {
  it('liefert das heutige Datum in lokaler Zeit als YYYY-MM-DD', () => {
    const result = todayISO()
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)

    const now = new Date()
    const expected = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    expect(result).toBe(expected)
  })
})

describe('toInputDate', () => {
  it('kürzt gespeicherte Datumswerte auf den YYYY-MM-DD-Teil', () => {
    expect(toInputDate('2026-07-02T00:00:00Z')).toBe('2026-07-02')
  })

  it('liefert einen leeren String für fehlende Werte', () => {
    expect(toInputDate(undefined)).toBe('')
  })
})
