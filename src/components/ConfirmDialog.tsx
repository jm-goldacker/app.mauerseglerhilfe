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
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onCancel}>
      <div
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
