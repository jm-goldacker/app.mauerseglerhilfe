import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { NamedItem } from '../api/types'
import { hasRole } from '../auth/keycloak'
import { PlusIcon, EditIcon, TrashIcon, CheckIcon, XIcon } from './Icons'

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

  const { data = [], isLoading } = useQuery({ queryKey: [queryKey], queryFn: fetchAll })

  const createMut = useMutation({
    mutationFn: create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: [queryKey] }); setNewName('') },
  })
  const updateMut = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => update(id, name),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [queryKey] }); setEditId(null) },
  })
  const deleteMut = useMutation({
    mutationFn: remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: [queryKey] }),
  })

  const [newName, setNewName] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-slate-200">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
          {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
        </div>
        <span className="text-sm text-slate-400">{data.length} Einträge</span>
      </div>

      <div className="flex-1 overflow-auto px-8 py-6">
        <div className="max-w-lg space-y-3">
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
                className="flex-1 px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-colors placeholder:text-slate-300"
              />
              <button
                type="submit"
                disabled={!newName.trim() || createMut.isPending}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-colors flex-shrink-0"
                style={{ background: '#7C3AED' }}
                onMouseEnter={(e) => { if (newName.trim()) (e.currentTarget as HTMLElement).style.background = '#6D28D9' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#7C3AED' }}
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
                  <div key={i} className="h-11 rounded-lg animate-pulse" style={{ background: '#F1F5F9' }} />
                ))}
              </div>
            ) : data.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <p className="text-sm">Noch keine Einträge vorhanden</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {data.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 px-5 py-4 group transition-colors hover:bg-slate-50">
                    {editId === item.id ? (
                      <>
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          autoFocus
                          onKeyDown={(e) => { if (e.key === 'Escape') setEditId(null) }}
                          className="flex-1 px-3 py-1.5 text-sm border border-violet-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                        />
                        <button
                          onClick={() => updateMut.mutate({ id: item.id, name: editName })}
                          className="inline-flex items-center justify-center w-7 h-7 rounded-md text-green-600 hover:bg-green-50 transition-colors"
                        >
                          <CheckIcon size={14} />
                        </button>
                        <button
                          onClick={() => setEditId(null)}
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
                              className="inline-flex items-center justify-center w-7 h-7 rounded-md transition-colors"
                              style={{ color: '#94A3B8' }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#7C3AED'; (e.currentTarget as HTMLElement).style.background = '#F3E8FF' }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#94A3B8'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                            >
                              <EditIcon size={13} />
                            </button>
                            <button
                              onClick={() => { if (confirm(`„${item.name}" löschen?`)) deleteMut.mutate(item.id) }}
                              className="inline-flex items-center justify-center w-7 h-7 rounded-md transition-colors"
                              style={{ color: '#94A3B8' }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#E11D48'; (e.currentTarget as HTMLElement).style.background = '#FFF1F2' }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#94A3B8'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
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
