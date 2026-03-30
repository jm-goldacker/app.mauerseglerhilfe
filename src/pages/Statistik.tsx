import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { statisticsApi } from '../api/queries'

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
  const { data: rows = [], isLoading } = useQuery({
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
      <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-slate-200">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Statistik</h1>
          <p className="text-sm text-slate-500 mt-0.5">Aufnahmebuch nach Vogelart und Alter</p>
        </div>
        <select
          value={year ?? ''}
          onChange={(e) => setYear(e.target.value ? Number(e.target.value) : undefined)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 text-slate-700"
        >
          <option value="">Alle Jahre</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div className="flex-1 overflow-auto px-8 py-6 space-y-6">
        {/* Summary */}
        {summary && (
          <div className="grid grid-cols-4 gap-4">
            <StatCard label="Aufnahmen gesamt" value={summary.total} color="#7C3AED" />
            <StatCard label="In Pflege" value={summary.inCare} color="#2563EB" sub="aktuell" />
            <StatCard label="Ausgewildert" value={summary.released} color="#16A34A" sub="erfolgreich" />
            <StatCard label="Verstorben" value={summary.died} color="#DC2626" sub="inkl. Euthanasie" />
          </div>
        )}

        {/* Species table */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-auto shadow-sm">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 bg-slate-50 border-b border-slate-200 sticky left-0" rowSpan={2} style={{ minWidth: 140 }}>
                    Vogelart
                  </th>
                  {sortedAges.map((age) => (
                    <th key={age} colSpan={2}
                      className="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide border-b border-slate-200 border-l border-l-slate-100"
                      style={{ background: '#F8F5FF', color: '#7C3AED', minWidth: 80 }}>
                      {age}
                    </th>
                  ))}
                  <th colSpan={3} className="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide border-b border-slate-200 border-l-2 border-l-slate-300"
                    style={{ background: '#F8FAFC', color: '#475569' }}>
                    Gesamt
                  </th>
                </tr>
                <tr>
                  {sortedAges.map((age) => (
                    <React.Fragment key={age}>
                      <th className="px-2 py-2 text-center text-xs font-medium border-b border-slate-200 border-l border-l-slate-100" style={{ background: '#FFF8F8', color: '#DC2626' }}>†</th>
                      <th className="px-2 py-2 text-center text-xs font-medium border-b border-slate-200" style={{ background: '#F0FDF4', color: '#16A34A' }}>✓</th>
                    </React.Fragment>
                  ))}
                  <th className="px-2 py-2 text-center text-xs font-medium border-b border-slate-200 border-l-2 border-l-slate-300" style={{ background: '#FFF8F8', color: '#DC2626' }}>†</th>
                  <th className="px-2 py-2 text-center text-xs font-medium border-b border-slate-200" style={{ background: '#F0FDF4', color: '#16A34A' }}>✓</th>
                  <th className="px-2 py-2 text-center text-xs font-bold border-b border-slate-200" style={{ color: '#7C3AED' }}>=</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const ageMap = Object.fromEntries(row.ageStats.map((a) => [a.age, a]))
                  return (
                    <tr key={row.birdSpecies}
                      className="border-b transition-colors"
                      style={{ borderColor: '#F1F5F9' }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#FAFAFF')}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? 'white' : '#FAFAFA')}
                    >
                      <td className="px-5 py-3.5 font-medium text-slate-800 sticky left-0 bg-inherit">{row.birdSpecies}</td>
                      {sortedAges.map((age) => {
                        const s = ageMap[age]
                        return (
                          <React.Fragment key={age}>
                            <td className="px-3 py-3.5 text-center border-l border-slate-100" style={{ color: s?.died ? '#DC2626' : '#CBD5E1' }}>{s?.died ?? 0}</td>
                            <td className="px-3 py-3.5 text-center" style={{ color: s?.survived ? '#16A34A' : '#CBD5E1' }}>{s?.survived ?? 0}</td>
                          </React.Fragment>
                        )
                      })}
                      <td className="px-3 py-3.5 text-center font-semibold border-l-2 border-slate-200" style={{ color: row.totalDied ? '#DC2626' : '#CBD5E1' }}>{row.totalDied}</td>
                      <td className="px-3 py-3.5 text-center font-semibold" style={{ color: row.totalSurvived ? '#16A34A' : '#CBD5E1' }}>{row.totalSurvived}</td>
                      <td className="px-3 py-3.5 text-center font-bold" style={{ color: '#7C3AED' }}>{row.total}</td>
                    </tr>
                  )
                })}
              </tbody>
              {rows.length > 0 && (() => {
                const td = rows.reduce((s, r) => s + r.totalDied, 0)
                const ts = rows.reduce((s, r) => s + r.totalSurvived, 0)
                const tt = rows.reduce((s, r) => s + r.total, 0)
                return (
                  <tfoot>
                    <tr style={{ background: '#F8F5FF', borderTop: '2px solid #DDD6FE' }}>
                      <td className="px-5 py-4 font-bold text-slate-700 sticky left-0" style={{ background: '#F8F5FF' }}>Gesamt</td>
                      {sortedAges.map((age) => {
                        const d = rows.reduce((s, r) => s + (r.ageStats.find((a) => a.age === age)?.died ?? 0), 0)
                        const v = rows.reduce((s, r) => s + (r.ageStats.find((a) => a.age === age)?.survived ?? 0), 0)
                        return (
                          <React.Fragment key={age}>
                            <td className="px-3 py-4 text-center font-semibold border-l border-purple-200" style={{ color: '#DC2626' }}>{d}</td>
                            <td className="px-3 py-4 text-center font-semibold" style={{ color: '#16A34A' }}>{v}</td>
                          </React.Fragment>
                        )
                      })}
                      <td className="px-3 py-4 text-center font-bold border-l-2 border-purple-300" style={{ color: '#DC2626' }}>{td}</td>
                      <td className="px-3 py-4 text-center font-bold" style={{ color: '#16A34A' }}>{ts}</td>
                      <td className="px-3 py-4 text-center font-bold text-lg" style={{ color: '#7C3AED' }}>{tt}</td>
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
