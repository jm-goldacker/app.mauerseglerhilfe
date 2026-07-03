// Gemeinsame Datums-Helfer. Datumswerte werden als UTC-Mitternacht gespeichert
// (YYYY-MM-DD -> toISOString), daher wird konsequent in UTC formatiert.

/** Formatiert ein gespeichertes Datum als TT.MM.JJJJ; „—" wenn leer. */
export function formatDate(d?: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' })
}

/**
 * Heutiges Datum in lokaler Zeit als YYYY-MM-DD (toISOString wäre UTC und
 * zeigt nach Mitternacht lokaler Zeit noch den Vortag).
 */
export function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Gespeichertes Datum auf den YYYY-MM-DD-Teil für <input type="date"> kürzen. */
export function toInputDate(d?: string) {
  if (!d) return ''
  return d.substring(0, 10)
}
