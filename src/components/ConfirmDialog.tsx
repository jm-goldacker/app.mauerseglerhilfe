import { useEffect, useRef } from 'react'
import { colors } from '../theme'

// Modaler Bestätigungsdialog als Ersatz für window.confirm: einheitliche
// Optik und nicht vom Browser unterdrückbar.
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Löschen',
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  message?: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}) {
  const dialogRef = useRef<HTMLDivElement>(null)

  // Escape schließt den Dialog; Tab bleibt innerhalb des Dialogs (Fokus-Trap)
  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel()
      if (e.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button')
        if (!focusable || focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onCancel])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onCancel}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        {message && <p className="text-sm text-slate-500 mt-1.5">{message}</p>}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            autoFocus
            className="rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            style={{ padding: '10px 18px' }}
          >
            Abbrechen
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg text-sm font-medium text-white transition-colors"
            style={{ padding: '10px 18px', background: colors.danger }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#be123c')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = colors.danger)}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
