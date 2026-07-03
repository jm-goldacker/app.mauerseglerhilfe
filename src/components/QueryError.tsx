// Fehleranzeige für fehlgeschlagene Lade-Queries, damit ein Ladefehler
// nicht wie eine leere Liste aussieht.
export default function QueryError({ message, onRetry }: { message?: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <p className="text-sm text-center max-w-md" style={{ color: '#be123c' }}>
        Daten konnten nicht geladen werden{message ? `: ${message}` : ''}
      </p>
      <button
        onClick={onRetry}
        className="rounded-lg text-sm font-medium text-white transition-colors"
        style={{ padding: '10px 20px', background: 'hsl(205, 100%, 35%)' }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'hsl(208, 100%, 20%)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'hsl(205, 100%, 35%)')}
      >
        Erneut versuchen
      </button>
    </div>
  )
}
