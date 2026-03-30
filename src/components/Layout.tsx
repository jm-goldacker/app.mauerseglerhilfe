import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import keycloak from '../auth/keycloak'
import {
  BookIcon, ChartIcon, CarIcon, SettingsIcon,
  ChevronDownIcon, ChevronRightIcon, ChevronLeftIcon,
  BirdIcon, LogoutIcon, UserIcon,
} from './Icons'

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
    ],
  },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [stammdatenOpen, setStammdatenOpen] = useState(
    location.pathname.startsWith('/stammdaten')
  )
  const username = keycloak.tokenParsed?.preferred_username || 'Benutzer'
  const initials = username.slice(0, 2).toUpperCase()

  const isChildActive = navItems
    .find((i) => i.children)
    ?.children?.some((c) => c.path === location.pathname) ?? false

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F1F5F9' }}>
      {/* Sidebar */}
      <aside
        style={{ width: collapsed ? 64 : 224, background: '#18181B', transition: 'width 220ms ease' }}
        className="flex flex-col flex-shrink-0 overflow-hidden"
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b" style={{ borderColor: '#27272A' }}>
          <div className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)' }}>
            <BirdIcon size={16} className="text-white" />
          </div>
          {!collapsed && (
            <div className="ml-3 overflow-hidden">
              <div className="text-white font-semibold text-sm whitespace-nowrap">Mauerseglerhilfe</div>
              <div className="text-xs whitespace-nowrap" style={{ color: '#71717A' }}>Bestandsbuch</div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto flex items-center justify-center w-6 h-6 rounded transition-colors flex-shrink-0"
            style={{ color: '#52525B' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#A1A1AA')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#52525B')}
          >
            <span style={{ display: 'inline-flex', transition: 'transform 220ms', transform: collapsed ? 'rotate(180deg)' : 'none' }}>
              <ChevronLeftIcon size={14} />
            </span>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {navItems.map((item) => {
            if (item.children) {
              const active = isChildActive
              return (
                <div key={item.label}>
                  <button
                    onClick={() => !collapsed && setStammdatenOpen(!stammdatenOpen)}
                    title={collapsed ? item.label : undefined}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
                    style={{
                      color: active ? '#A78BFA' : '#A1A1AA',
                      background: active ? 'rgba(124,58,237,0.12)' : 'transparent',
                    }}
                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#E4E4E7' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = active ? 'rgba(124,58,237,0.12)' : 'transparent'; e.currentTarget.style.color = active ? '#A78BFA' : '#A1A1AA' }}
                  >
                    <item.Icon size={16} className="flex-shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {stammdatenOpen
                          ? <ChevronDownIcon size={13} />
                          : <ChevronRightIcon size={13} />
                        }
                      </>
                    )}
                  </button>
                  {stammdatenOpen && !collapsed && (
                    <div className="mt-0.5 space-y-0.5">
                      {item.children.map((child) => {
                        const childActive = location.pathname === child.path
                        return (
                          <Link
                            key={child.path}
                            to={child.path}
                            className="flex items-center gap-3 pl-10 pr-3 py-2.5 rounded-lg text-sm transition-colors"
                            style={{
                              color: childActive ? '#C4B5FD' : '#71717A',
                              background: childActive ? 'rgba(124,58,237,0.15)' : 'transparent',
                              fontWeight: childActive ? 500 : 400,
                            }}
                            onMouseEnter={(e) => { if (!childActive) { (e.currentTarget as HTMLElement).style.color = '#A1A1AA'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = childActive ? '#C4B5FD' : '#71717A'; (e.currentTarget as HTMLElement).style.background = childActive ? 'rgba(124,58,237,0.15)' : 'transparent' }}
                          >
                            <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: childActive ? '#A78BFA' : '#3F3F46' }} />
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
                title={collapsed ? item.label : undefined}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors relative"
                style={{
                  color: active ? '#C4B5FD' : '#A1A1AA',
                  background: active ? 'rgba(124,58,237,0.15)' : 'transparent',
                  fontWeight: active ? 500 : 400,
                }}
                onMouseEnter={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.color = '#E4E4E7' }}}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = active ? 'rgba(124,58,237,0.15)' : 'transparent'; (e.currentTarget as HTMLElement).style.color = active ? '#C4B5FD' : '#A1A1AA' }}
              >
                {active && (
                  <span className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full" style={{ background: '#7C3AED' }} />
                )}
                <item.Icon size={16} className="flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div className="px-2 pb-3 border-t pt-3" style={{ borderColor: '#27272A' }}>
          <div className={`flex items-center gap-3 px-2 py-2 rounded-lg ${collapsed ? 'justify-center' : ''}`}>
            <div className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}>
              {collapsed ? <UserIcon size={14} /> : initials}
            </div>
            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-medium truncate" style={{ color: '#E4E4E7' }}>{username}</div>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={() => keycloak.logout()}
                className="flex items-center justify-center w-7 h-7 rounded-md transition-colors flex-shrink-0"
                title="Abmelden"
                style={{ color: '#52525B' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#EF4444'; (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#52525B'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <LogoutIcon size={14} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
