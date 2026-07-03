import { PrimaryButton } from './ui'

// Fehleranzeige für fehlgeschlagene Lade-Queries, damit ein Ladefehler
// nicht wie eine leere Liste aussieht.
export default function QueryError({ message, onRetry }: { message?: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <p className="text-sm text-center max-w-md" style={{ color: '#be123c' }}>
        Daten konnten nicht geladen werden{message ? `: ${message}` : ''}
      </p>
      <PrimaryButton onClick={onRetry} style={{ padding: '10px 20px' }}>
        Erneut versuchen
      </PrimaryButton>
    </div>
  )
}
