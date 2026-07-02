import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import keycloak from '../auth/keycloak'
import {
  BookIcon, ChartIcon, CarIcon, SettingsIcon,
  ChevronDownIcon, ChevronRightIcon, ChevronLeftIcon,
  BirdIcon, LogoutIcon, UserIcon, MenuIcon, XIcon,
} from './Icons'

const SIDEBAR_BG = 'hsl(208, 100%, 20%)'
const SIDEBAR_BORDER = 'hsla(208, 100%, 50%, 0.25)'
const ACTIVE_BG = 'hsla(205, 100%, 55%, 0.2)'
const INACTIVE_TEXT = 'hsla(218, 100%, 88%, 0.7)'
const HOVER_BG = 'hsla(218, 100%, 88%, 0.08)'
const ORANGE = 'hsl(31, 100%, 47%)'

const navItems = [
  { path: '/', label: 'Bestandsbuch', Icon: BookIcon },
  { path: '/statistik', label: 'Statistik', Icon: ChartIcon },
  { path: '/fahrtenbuch', label: 'Fahrtenbuch', Icon: CarIcon },
  {
    label: 'Stammdaten',
    Icon: SettingsIcon,
    children: [
      { path: '/stammdaten/vogelarten', label: 'Vogelarten' },
      { path: '/stammdaten/fundumstaende', label: 'Fundumstände' },
      { path: '/stammdaten/leistungsarten', label: 'Leistungsarten' },
      { path: '/stammdaten/verbleib', label: 'Verbleib' },
      { path: '/stammdaten/pflegestellen', label: 'Pflegestellen' },
      { path: '/stammdaten/vermittler', label: 'Vermittler' },
    ],
  },
]

interface SidebarProps {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  stammdatenOpen: boolean
  setStammdatenOpen: (v: boolean) => void
  location: ReturnType<typeof useLocation>
  isChildActive: boolean
  username: string
  initials: string
  showCollapseBtn: boolean
  showCloseBtn: boolean
  onClose?: () => void
}

function SidebarContent({
  collapsed, setCollapsed,
  stammdatenOpen, setStammdatenOpen,
  location, isChildActive,
  username, initials,
  showCollapseBtn, showCloseBtn, onClose,
}: SidebarProps) {
  const close = onClose ?? (() => {})

  return (
    <>
      {/* Logo */}
      <div className="flex items-center flex-shrink-0" style={{ height: 64, padding: '0 20px', borderBottom: `1px solid ${SIDEBAR_BORDER}` }}>
        <div className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0"
          style={{ background: 'hsl(205, 100%, 35%)', margin: !collapsed ? '0 10px 0 0' : '0' }}
          onClick={() => setCollapsed(!collapsed)}>
          <BirdIcon size={20} className="text-white"  />
        </div>
        {!collapsed && (
          <div className="ml-3 overflow-hidden flex-1 min-w-0">
            <div className="text-white font-semibold text-sm whitespace-nowrap">Mauerseglerhilfe</div>
            <div className="text-xs whitespace-nowrap" style={{ color: INACTIVE_TEXT }}>Bestandsbuch</div>
          </div>
        )}
        {showCollapseBtn && !collapsed &&(
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors flex-shrink-0 ml-auto"
            style={{ color: INACTIVE_TEXT }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = INACTIVE_TEXT)}
          >
            <span style={{ display: 'inline-flex', transition: 'transform 220ms', transform: collapsed ? 'rotate(180deg)' : 'none' }}>
              <ChevronLeftIcon size={15} />
            </span>
          </button>
        )}
        {showCloseBtn && (
          <button
            onClick={close}
            className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors flex-shrink-0 ml-auto"
            style={{ color: INACTIVE_TEXT }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = INACTIVE_TEXT)}
          >
            <XIcon size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto" style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {navItems.map((item) => {
          if (item.children) {
            const active = isChildActive
            return (
              <div key={item.label} style={{ padding: '12px 0'}}>
                <button
                  onClick={() => !collapsed && setStammdatenOpen(!stammdatenOpen)}
                  title={collapsed ? item.label : undefined}
                  className="w-full flex items-center gap-3 rounded-xl text-sm font-medium transition-colors"
                  style={{ color: active ? '#fff' : INACTIVE_TEXT, background: active ? ACTIVE_BG : 'transparent' }}
                  onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = HOVER_BG; e.currentTarget.style.color = '#fff' }}}
                  onMouseLeave={(e) => { e.currentTarget.style.background = active ? ACTIVE_BG : 'transparent'; e.currentTarget.style.color = active ? '#fff' : INACTIVE_TEXT }}
                >
                  <item.Icon size={17} className="flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {stammdatenOpen ? <ChevronDownIcon size={14} /> : <ChevronRightIcon size={14} />}
                    </>
                  )}
                </button>
                {stammdatenOpen && !collapsed && (
                  <div className="mt-1 space-y-0.5 ml-2">
                    {item.children.map((child) => {
                      const childActive = location.pathname === child.path
                      return (
                        <Link
                          key={child.path}
                          to={child.path}
                          onClick={close}
                          className="flex items-center gap-3 pl-9 pr-4 py-2.5 rounded-lg text-sm transition-colors"
                          style={{ color: childActive ? '#fff' : INACTIVE_TEXT, background: childActive ? ACTIVE_BG : 'transparent', fontWeight: childActive ? 500 : 400 }}
                          onMouseEnter={(e) => { if (!childActive) { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.background = HOVER_BG }}}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = childActive ? '#fff' : INACTIVE_TEXT; (e.currentTarget as HTMLElement).style.background = childActive ? ACTIVE_BG : 'transparent' }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: childActive ? ORANGE : 'hsla(218, 60%, 70%, 0.4)' }} />
                          {child.label}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }

          const active = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path!}
              onClick={close}
              title={collapsed ? item.label : undefined}
              className="flex items-center gap-3 rounded-xl text-sm font-medium transition-colors relative"
              style={{ padding: '12px 0', color: active ? '#fff' : INACTIVE_TEXT, background: 'transparent' }}
            >
              <item.Icon size={17} className="flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="flex-shrink-0" style={{ padding: '16px 12px 20px', borderTop: `1px solid ${SIDEBAR_BORDER}` }}>
        <div className={`flex items-center gap-3 px-3 py-3 rounded-xl ${collapsed ? 'justify-center' : ''}`}>
          <div className="flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0 text-xs font-bold text-white"
            style={{ background: 'hsl(205, 100%, 35%)' }}>
            {collapsed ? <UserIcon size={15} /> : initials}
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-medium truncate text-white">{username}</div>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => keycloak.logout()}
              className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors flex-shrink-0"
              title="Abmelden"
              style={{ color: INACTIVE_TEXT }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#EF4444'; (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.15)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = INACTIVE_TEXT; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              <LogoutIcon size={15} />
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [stammdatenOpen, setStammdatenOpen] = useState(
    location.pathname.startsWith('/stammdaten')
  )
  const username = keycloak.tokenParsed?.preferred_username || 'Benutzer'
  const initials = username.slice(0, 2).toUpperCase()
  const isChildActive = navItems
    .find((i) => i.children)
    ?.children?.some((c) => c.path === location.pathname) ?? false

  const sharedProps = {
    collapsed, setCollapsed,
    stammdatenOpen, setStammdatenOpen,
    location, isChildActive,
    username, initials,
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'hsl(218, 55%, 91%)' }}>

      {/* ── Desktop sidebar (in normal document flow) ── */}
      <aside
        className="hidden lg:flex flex-col flex-shrink-0 overflow-hidden"
        style={{ background: SIDEBAR_BG, width: collapsed ? 64 : 224, transition: 'width 220ms ease', alignItems: 'center' }}
      >
        <SidebarContent {...sharedProps} showCollapseBtn showCloseBtn={false} />
      </aside>

      {/* ── Mobile overlay backdrop ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-20" onClick={() => setMobileOpen(false)} />
      )}

      {/* ── Mobile sidebar (fixed overlay) ── */}
      <aside
        className="lg:hidden fixed inset-y-0 left-0 z-30 flex flex-col overflow-hidden"
        style={{
          background: SIDEBAR_BG,
          width: 260,
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 220ms ease',
        }}
      >
        <SidebarContent {...sharedProps} showCollapseBtn={false} showCloseBtn onClose={() => setMobileOpen(false)} />
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="gap-5 flex items-center h-14 px-4 bg-white border-b border-slate-200 lg:hidden flex-shrink-0 shadow-sm">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <MenuIcon size={22} />
          </button>
          <div className="flex items-center gap-2.5 ml-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: 'hsl(205, 100%, 35%)' }}>
              <BirdIcon size={16} className="text-white" />
            </div>
            <span className="font-semibold" style={{ color: 'hsl(208, 100%, 20%)' }}>Mauerseglerhilfe</span>
          </div>
          <div className="ml-auto flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold text-white"
            style={{ background: 'hsl(205, 100%, 35%)' }}>
            {initials}
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
