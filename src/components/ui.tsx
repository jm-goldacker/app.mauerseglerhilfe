import type { ButtonHTMLAttributes } from 'react'
import { colors } from '../theme'

// Primärer Aktions-Button (blau, Hover dunkelblau). Padding/Breite über
// style/className anpassbar.
export function PrimaryButton({ children, className = '', style, disabled, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-60 ${className}`}
      style={{ padding: '12px 20px', background: colors.primary, ...style }}
      onMouseEnter={(e) => { if (!disabled) (e.currentTarget as HTMLElement).style.background = colors.primaryDark }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = colors.primary }}
    >
      {children}
    </button>
  )
}

// Kleiner Icon-Button (grau, färbt sich beim Hover blau bzw. rot bei danger)
export function IconButton({ danger, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { danger?: boolean }) {
  const hoverColor = danger ? colors.danger : colors.primary
  const hoverBg = danger ? colors.dangerBg : colors.hoverBg
  return (
    <button
      {...props}
      className="inline-flex items-center justify-center w-7 h-7 rounded-md transition-colors"
      style={{ color: colors.iconMuted }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = hoverColor; (e.currentTarget as HTMLElement).style.background = hoverBg }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = colors.iconMuted; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
    >
      {children}
    </button>
  )
}
