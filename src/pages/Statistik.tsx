import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { statisticsApi } from '../api/queries'
import QueryError from '../components/QueryError'

const AGE_ORDER = ['Küken', 'Jungvogel', 'Altvogel']

function StatCard({ label, value, color, sub }: { label: string; value: number; color: string; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="text-3xl font-bold mb-1" style={{ color }}>{value}</div>
      <div className="text-sm font-medium text-slate-700">{label}</div>
      {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
    </div>
  )
}

export default function Statistik() {
  const [year, setYear] = useState<number | undefined>()

  const { data: years = [] } = useQuery({ queryKey: ['statYears'], queryFn: statisticsApi.getYears })
  const { data: rows = [], isLoading, isError, error: loadError, refetch } = useQuery({
    queryKey: ['statSpecies', year],
    queryFn: () => statisticsApi.getSpeciesByAge(year),
  })
  const { data: summary } = useQuery({
    queryKey: ['statSummary', year],
    queryFn: () => statisticsApi.getSummary(year),
  })

  const allAges = [...new Set(rows.flatMap((r) => r.ageStats.map((a) => a.age)))]
  const sortedAges = [...allAges].sort((a, b) => {
    const ia = AGE_ORDER.indexOf(a), ib = AGE_ORDER.indexOf(b)
    if (ia === -1 && ib === -1) return a.localeCompare(b)
    if (ia === -1) return 1
    if (ib === -1) return -1
    return ia - ib
  })

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border-b border-slate-200" style={{ padding: '24px 48px' }}>
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900">Statistik</h1>
          <p className="text-sm text-slate-500 mt-0.5">Aufnahmebuch nach Vogelart und Alter</p>
        </div>
        <select
          value={year ?? ''}
          onChange={(e) => setYear(e.target.value ? Number(e.target.value) : undefined)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none text-slate-700"
        >
          <option value="">Alle Jahre</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div className="flex-1 overflow-auto" style={{ padding: '36px 48px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Summary cards */}
        {summary && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <StatCard label="Aufnahmen gesamt" value={summary.total} color="hsl(31, 100%, 47%)" />
            <StatCard label="In Pflege" value={summary.inCare} color="hsl(205, 100%, 35%)" sub="aktuell" />
            <StatCard label="Ausgewildert" value={summary.released} color="#16a34a" sub="erfolgreich" />
            <StatCard label="Verstorben" value={summary.died} color="#dc2626" sub="inkl. Euthanasie" />
          </div>
        )}

        {/* Legende */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-500 -mt-4">
          <span><span className="font-semibold" style={{ color: '#dc2626' }}>†</span> verstorben</span>
          <span><span className="font-semibold" style={{ color: '#16a34a' }}>✓</span> ausgewildert / vermittelt</span>
          <span><span className="font-semibold" style={{ color: 'hsl(205, 100%, 35%)' }}>⏳</span> in Pflege</span>
          <span><span className="font-semibold" style={{ color: 'hsl(31, 100%, 47%)' }}>=</span> gesamt aufgenommen (inkl. Pflege)</span>
        </div>

        {/* Species table */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: 'hsl(205, 100%, 35%)', borderTopColor: 'transparent' }} />
          </div>
        ) : isError ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <QueryError message={loadError?.message} onRetry={() => refetch()} />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-auto shadow-sm">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide border-b border-slate-200 sticky left-0 bg-white"
                    style={{ color: 'hsl(208, 100%, 20%)', minWidth: 140 }} rowSpan={2}>
                    Vogelart
                  </th>
                  {sortedAges.map((age) => (
                    <th key={age} colSpan={3}
                      className="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide border-b border-slate-200 border-l border-l-slate-100"
                      style={{ background: 'hsl(218, 55%, 95%)', color: 'hsl(205, 100%, 35%)', minWidth: 80 }}>
                      {age}
                    </th>
                  ))}
                  <th colSpan={4} className="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide border-b border-slate-200 border-l-2 border-l-slate-200"
                    style={{ background: '#f8fafc', color: '#475569' }}>
                    Gesamt
                  </th>
                </tr>
                <tr>
                  {sortedAges.map((age) => (
                    <React.Fragment key={age}>
                      <th title="verstorben" className="px-2 py-2 text-center text-xs font-medium border-b border-slate-200 border-l border-l-slate-100" style={{ background: '#fff8f8', color: '#dc2626' }}>†</th>
                      <th title="ausgewildert / vermittelt" className="px-2 py-2 text-center text-xs font-medium border-b border-slate-200" style={{ background: '#f0fdf4', color: '#16a34a' }}>✓</th>
                      <th title="in Pflege" className="px-2 py-2 text-center text-xs font-medium border-b border-slate-200" style={{ background: '#eff6ff', color: 'hsl(205, 100%, 35%)' }}>⏳</th>
                    </React.Fragment>
                  ))}
                  <th title="verstorben" className="px-2 py-2 text-center text-xs font-medium border-b border-slate-200 border-l-2 border-l-slate-200" style={{ background: '#fff8f8', color: '#dc2626' }}>†</th>
                  <th title="ausgewildert / vermittelt" className="px-2 py-2 text-center text-xs font-medium border-b border-slate-200" style={{ background: '#f0fdf4', color: '#16a34a' }}>✓</th>
                  <th title="in Pflege" className="px-2 py-2 text-center text-xs font-medium border-b border-slate-200" style={{ background: '#eff6ff', color: 'hsl(205, 100%, 35%)' }}>⏳</th>
                  <th title="gesamt aufgenommen" className="px-2 py-2 text-center text-xs font-bold border-b border-slate-200" style={{ color: 'hsl(31, 100%, 47%)' }}>=</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const ageMap = Object.fromEntries(row.ageStats.map((a) => [a.age, a]))
                  return (
                    <tr key={row.birdSpecies}
                      className="border-b transition-colors"
                      style={{ borderColor: '#f1f5f9', background: i % 2 === 0 ? 'white' : '#fafafa' }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'hsl(218, 55%, 97%)')}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? 'white' : '#fafafa')}
                    >
                      <td className="px-5 py-3.5 font-medium text-slate-800 sticky left-0 bg-inherit">{row.birdSpecies}</td>
                      {sortedAges.map((age) => {
                        const s = ageMap[age]
                        return (
                          <React.Fragment key={age}>
                            <td className="px-3 py-3.5 text-center border-l border-slate-100" style={{ color: s?.died ? '#dc2626' : '#cbd5e1' }}>{s?.died ?? 0}</td>
                            <td className="px-3 py-3.5 text-center" style={{ color: s?.survived ? '#16a34a' : '#cbd5e1' }}>{s?.survived ?? 0}</td>
                            <td className="px-3 py-3.5 text-center" style={{ color: s?.inCare ? 'hsl(205, 100%, 35%)' : '#cbd5e1' }}>{s?.inCare ?? 0}</td>
                          </React.Fragment>
                        )
                      })}
                      <td className="px-3 py-3.5 text-center font-semibold border-l-2 border-slate-200" style={{ color: row.totalDied ? '#dc2626' : '#cbd5e1' }}>{row.totalDied}</td>
                      <td className="px-3 py-3.5 text-center font-semibold" style={{ color: row.totalSurvived ? '#16a34a' : '#cbd5e1' }}>{row.totalSurvived}</td>
                      <td className="px-3 py-3.5 text-center font-semibold" style={{ color: row.totalInCare ? 'hsl(205, 100%, 35%)' : '#cbd5e1' }}>{row.totalInCare}</td>
                      <td className="px-3 py-3.5 text-center font-bold" style={{ color: 'hsl(31, 100%, 47%)' }}>{row.total}</td>
                    </tr>
                  )
                })}
              </tbody>
              {rows.length > 0 && (() => {
                const td = rows.reduce((s, r) => s + r.totalDied, 0)
                const ts = rows.reduce((s, r) => s + r.totalSurvived, 0)
                const tc = rows.reduce((s, r) => s + r.totalInCare, 0)
                const tt = rows.reduce((s, r) => s + r.total, 0)
                return (
                  <tfoot>
                    <tr style={{ background: 'hsl(218, 55%, 95%)', borderTop: '2px solid hsl(218, 30%, 85%)' }}>
                      <td className="px-5 py-4 font-bold sticky left-0" style={{ color: 'hsl(208, 100%, 20%)', background: 'hsl(218, 55%, 95%)' }}>Gesamt</td>
                      {sortedAges.map((age) => {
                        const d = rows.reduce((s, r) => s + (r.ageStats.find((a) => a.age === age)?.died ?? 0), 0)
                        const v = rows.reduce((s, r) => s + (r.ageStats.find((a) => a.age === age)?.survived ?? 0), 0)
                        const c = rows.reduce((s, r) => s + (r.ageStats.find((a) => a.age === age)?.inCare ?? 0), 0)
                        return (
                          <React.Fragment key={age}>
                            <td className="px-3 py-4 text-center font-semibold border-l border-slate-200" style={{ color: '#dc2626' }}>{d}</td>
                            <td className="px-3 py-4 text-center font-semibold" style={{ color: '#16a34a' }}>{v}</td>
                            <td className="px-3 py-4 text-center font-semibold" style={{ color: 'hsl(205, 100%, 35%)' }}>{c}</td>
                          </React.Fragment>
                        )
                      })}
                      <td className="px-3 py-4 text-center font-bold border-l-2 border-slate-300" style={{ color: '#dc2626' }}>{td}</td>
                      <td className="px-3 py-4 text-center font-bold" style={{ color: '#16a34a' }}>{ts}</td>
                      <td className="px-3 py-4 text-center font-bold" style={{ color: 'hsl(205, 100%, 35%)' }}>{tc}</td>
                      <td className="px-3 py-4 text-center font-bold text-lg" style={{ color: 'hsl(31, 100%, 47%)' }}>{tt}</td>
                    </tr>
                  </tfoot>
                )
              })()}
            </table>
            {rows.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <p className="font-medium">Keine Daten vorhanden</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
