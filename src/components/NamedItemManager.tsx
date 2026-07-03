import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { NamedItem } from '../api/types'
import { hasRole } from '../auth/keycloak'
import { PlusIcon, EditIcon, TrashIcon, CheckIcon, XIcon } from './Icons'
import QueryError from './QueryError'

interface Props {
  title: string
  description?: string
  queryKey: string
  fetchAll: () => Promise<NamedItem[]>
  create: (name: string) => Promise<NamedItem>
  update: (id: number, name: string) => Promise<void>
  remove: (id: number) => Promise<void>
}

export default function NamedItemManager({ title, description, queryKey, fetchAll, create, update, remove }: Props) {
  const qc = useQueryClient()
  const isManager = hasRole('manager')

  const { data = [], isLoading, isError, error: loadError, refetch } = useQuery({ queryKey: [queryKey], queryFn: fetchAll })

  const createMut = useMutation({
    mutationFn: create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: [queryKey] }); setNewName(''); setError('') },
    onError: (e: Error) => setError(`Anlegen fehlgeschlagen: ${e.message}`),
  })
  const updateMut = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => update(id, name),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [queryKey] }); setEditId(null); setError('') },
    onError: (e: Error) => setError(`Speichern fehlgeschlagen: ${e.message}`),
  })
  const deleteMut = useMutation({
    mutationFn: remove,
    onSuccess: () => { qc.invalidateQueries({ queryKey: [queryKey] }); setError('') },
    onError: (e: Error) => setError(`Löschen fehlgeschlagen: ${e.message}`),
  })

  const [newName, setNewName] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [error, setError] = useState('')

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border-b border-slate-200" style={{ padding: '24px 48px' }}>
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900">{title}</h1>
          {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
        </div>
        <span className="text-sm text-slate-400">{data.length} Einträge</span>
      </div>

      <div className="flex-1 overflow-auto" style={{ padding: '36px 48px' }}>
        <div className="max-w-lg" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {error && (
            <div className="px-4 py-3 rounded-lg text-sm border" style={{ background: '#fff1f2', color: '#be123c', borderColor: '#fecdd3' }}>
              {error}
            </div>
          )}

          {/* Add form */}
          {isManager && (
            <form
              onSubmit={(e) => { e.preventDefault(); if (newName.trim()) createMut.mutate(newName.trim()) }}
              className="flex gap-2"
            >
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Neuer Eintrag…"
                className="flex-1 px-4 py-3 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 transition-colors placeholder:text-slate-300"
                style={{ '--tw-ring-color': 'hsl(205, 100%, 35%, 0.3)' } as React.CSSProperties}
              />
              <button
                type="submit"
                disabled={!newName.trim() || createMut.isPending}
                className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-colors flex-shrink-0"
                style={{ padding: '12px 20px', background: 'hsl(205, 100%, 35%)' }}
                onMouseEnter={(e) => { if (newName.trim()) (e.currentTarget as HTMLElement).style.background = 'hsl(208, 100%, 20%)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'hsl(205, 100%, 35%)' }}
              >
                <PlusIcon size={14} />
                Hinzufügen
              </button>
            </form>
          )}

          {/* List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="space-y-0.5 p-2">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="h-11 rounded-lg animate-pulse" style={{ background: 'hsl(218, 55%, 91%)' }} />
                ))}
              </div>
            ) : isError ? (
              <QueryError message={loadError?.message} onRetry={() => refetch()} />
            ) : data.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <p className="text-sm">Noch keine Einträge vorhanden</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {data.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 px-5 py-5 group transition-colors hover:bg-slate-50">
                    {editId === item.id ? (
                      <>
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          autoFocus
                          onKeyDown={(e) => { if (e.key === 'Escape') setEditId(null) }}
                          className="flex-1 px-4 py-2.5 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 transition-colors"
                          style={{ borderColor: 'hsl(205, 100%, 60%)', '--tw-ring-color': 'hsl(205, 100%, 35%, 0.3)' } as React.CSSProperties}
                        />
                        <button
                          onClick={() => updateMut.mutate({ id: item.id, name: editName })}
                          title="Speichern" aria-label="Speichern"
                          className="inline-flex items-center justify-center w-7 h-7 rounded-md text-green-600 hover:bg-green-50 transition-colors"
                        >
                          <CheckIcon size={14} />
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          title="Abbrechen" aria-label="Abbrechen"
                          className="inline-flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:bg-slate-100 transition-colors"
                        >
                          <XIcon size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-sm text-slate-800">{item.name}</span>
                        {isManager && (
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => { setEditId(item.id); setEditName(item.name) }}
                              title="Bearbeiten" aria-label="Bearbeiten"
                              className="inline-flex items-center justify-center w-7 h-7 rounded-md transition-colors"
                              style={{ color: '#94a3b8' }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'hsl(205, 100%, 35%)'; (e.currentTarget as HTMLElement).style.background = 'hsl(218, 55%, 91%)' }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#94a3b8'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                            >
                              <EditIcon size={13} />
                            </button>
                            <button
                              onClick={() => { if (confirm(`„${item.name}" löschen?`)) deleteMut.mutate(item.id) }}
                              title="Löschen" aria-label="Löschen"
                              className="inline-flex items-center justify-center w-7 h-7 rounded-md transition-colors"
                              style={{ color: '#94a3b8' }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#e11d48'; (e.currentTarget as HTMLElement).style.background = '#fff1f2' }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#94a3b8'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                            >
                              <TrashIcon size={13} />
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
