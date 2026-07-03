import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  logEntriesApi, birdSpeciesApi, circumstancesApi,
  serviceTypesApi, dispositionTypesApi, careStationsApi, referrersApi
} from '../api/queries'
import type { LogEntryPost } from '../api/types'
import { hasRole } from '../auth/keycloak'
import { ArrowLeftIcon, TrashIcon } from '../components/Icons'
import { todayISO, toInputDate } from '../utils/date'

const DEFAULT: LogEntryPost = {
  date: todayISO(),
  age: '',
  birdSpecies: '',
  circumstance: '',
}

const inputCls = "w-full px-4 py-3 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 transition-colors placeholder:text-slate-300"
const selectCls = inputCls

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-slate-600">
        {label}{required && <span className="ml-0.5" style={{ color: 'hsl(205, 100%, 35%)' }}>*</span>}
      </label>
      {children}
    </div>
  )
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="flex items-center gap-2.5 px-8 py-6 border-b border-slate-100"
        style={{ background: 'hsl(218, 55%, 96%)' }}>
        <span className="text-base">{icon}</span>
        <span className="text-sm font-semibold" style={{ color: 'hsl(208, 100%, 20%)' }}>{title}</span>
      </div>
      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7">{children}</div>
    </div>
  )
}

export default function LogEntryForm() {
  const { id } = useParams<{ id: string }>()
  const isNew = id === 'neu'
  const navigate = useNavigate()
  const qc = useQueryClient()
  const isManager = hasRole('manager')

  const [form, setForm] = useState<LogEntryPost>(DEFAULT)
  const [error, setError] = useState('')

  const { data: entry, isLoading: entryLoading, error: entryError, refetch } = useQuery({
    queryKey: ['logEntry', id],
    queryFn: () => logEntriesApi.getOne(Number(id)),
    enabled: !isNew,
  })

  const { data: birdSpeciesList = [] } = useQuery({ queryKey: ['birdSpecies'], queryFn: birdSpeciesApi.getAll })
  const { data: circumstances = [] } = useQuery({ queryKey: ['circumstances'], queryFn: circumstancesApi.getAll })
  const { data: serviceTypes = [] } = useQuery({ queryKey: ['serviceTypes'], queryFn: serviceTypesApi.getAll })
  const { data: dispositionTypes = [] } = useQuery({ queryKey: ['dispositionTypes'], queryFn: dispositionTypesApi.getAll })
  const { data: careStations = [] } = useQuery({ queryKey: ['careStations'], queryFn: careStationsApi.getAll })
  const { data: referrers = [] } = useQuery({ queryKey: ['referrers'], queryFn: referrersApi.getAll })

  // Formular nur einmal aus dem geladenen Eintrag befüllen: Background-Refetches
  // (z. B. bei Fenster-Fokus) dürfen ungespeicherte Eingaben nicht überschreiben.
  const seededRef = useRef(false)
  useEffect(() => {
    if (entry && !seededRef.current) {
      seededRef.current = true
      setForm({
        date: toInputDate(entry.date),
        name: entry.name,
        ringNumber: entry.ringNumber,
        finderName: entry.finderName,
        age: entry.age,
        birdSpecies: entry.birdSpecies,
        circumstance: entry.circumstance,
        serviceType: entry.serviceType,
        dispositionType: entry.dispositionType,
        careStation: entry.careStation,
        referrer: entry.referrer,
        takenInDate: toInputDate(entry.takenInDate),
        takenInBy: entry.takenInBy,
        zipFoundAt: entry.zipFoundAt,
        redirectedTo: entry.redirectedTo,
        letFreeDate: toInputDate(entry.letFreeDate),
        diedDate: toInputDate(entry.diedDate),
        euthanasiaDate: toInputDate(entry.euthanasiaDate),
      })
    }
  }, [entry])

  const createMut = useMutation({
    mutationFn: (d: LogEntryPost) => logEntriesApi.create(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['logEntries'] }); navigate('/') },
    onError: (e: Error) => setError(e.message),
  })
  const updateMut = useMutation({
    mutationFn: (d: LogEntryPost) => logEntriesApi.update(Number(id), d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['logEntries'] }); navigate('/') },
    onError: (e: Error) => setError(e.message),
  })
  const deleteMut = useMutation({
    mutationFn: () => logEntriesApi.delete(Number(id)),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['logEntries'] }); navigate('/') },
    onError: (e: Error) => setError(`Löschen fehlgeschlagen: ${e.message}`),
  })

  function set(field: keyof LogEntryPost, value: string | undefined) {
    setForm((f) => ({ ...f, [field]: value || undefined }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const iso = (d?: string) => d ? new Date(d).toISOString() : undefined
    const payload: LogEntryPost = {
      ...form,
      date: new Date(form.date).toISOString(),
      takenInDate: iso(form.takenInDate),
      letFreeDate: iso(form.letFreeDate),
      diedDate: iso(form.diedDate),
      euthanasiaDate: iso(form.euthanasiaDate),
    }
    if (isNew) createMut.mutate(payload)
    else updateMut.mutate(payload)
  }

  const isPending = createMut.isPending || updateMut.isPending

  if (!isNew && entryLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: 'hsl(205, 100%, 35%)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  // Eintrag konnte nicht geladen werden → Fehler anzeigen statt leerer Maske,
  // sonst sieht das Bearbeiten wie ein neuer Eintrag aus
  if (!isNew && (entryError || !entry)) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="px-4 py-3 rounded-lg text-sm border max-w-md text-center"
          style={{ background: '#fff1f2', color: '#be123c', borderColor: '#fecdd3' }}>
          Eintrag #{id} konnte nicht geladen werden{entryError ? `: ${entryError.message}` : ''}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => refetch()}
            className="rounded-lg text-sm font-medium text-white transition-colors"
            style={{ padding: '10px 20px', background: 'hsl(205, 100%, 35%)' }}
          >
            Erneut versuchen
          </button>
          <button
            onClick={() => navigate('/')}
            className="rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            style={{ padding: '10px 20px' }}
          >
            Zurück zur Übersicht
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-4 bg-white border-b border-slate-200" style={{ padding: '24px 48px' }}>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-colors"
        >
          <ArrowLeftIcon size={15} />
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
            {isNew ? 'Neuer Eintrag' : `Eintrag #${id}`}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {isNew ? 'Neuen Vogelfund erfassen' : 'Eintrag bearbeiten'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-auto" style={{ padding: '36px 48px' }}>
        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg text-sm border" style={{ background: '#fff1f2', color: '#be123c', borderColor: '#fecdd3' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-3xl" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Section title="Basisdaten" icon="📋">
            <Field label="Fundtag" required>
              <input type="date" required value={form.date} onChange={(e) => set('date', e.target.value)} className={inputCls}
                style={{ '--tw-ring-color': 'hsl(205, 100%, 35%, 0.3)', '--tw-border-color-focus': 'hsl(205, 100%, 35%)' } as React.CSSProperties} />
            </Field>
            <Field label="Vogelart" required>
              <input
                list="birdSpeciesList" required
                value={form.birdSpecies}
                onChange={(e) => set('birdSpecies', e.target.value)}
                placeholder="Vogelart eingeben…"
                className={inputCls}
              />
              <datalist id="birdSpeciesList">
                {birdSpeciesList.map((b) => <option key={b.id} value={b.name} />)}
              </datalist>
            </Field>
            <Field label="Name">
              <input value={form.name ?? ''} onChange={(e) => set('name', e.target.value)} placeholder="z. B. Piepsi…" className={inputCls} />
            </Field>
            <Field label="Ringnummer">
              <input
                value={form.ringNumber ?? ''}
                onChange={(e) => set('ringNumber', e.target.value)}
                maxLength={50}
                placeholder="z. B. DEW 1A234…"
                className={inputCls}
              />
            </Field>
            <Field label="Findername">
              <input value={form.finderName ?? ''} onChange={(e) => set('finderName', e.target.value)} placeholder="Name der Finderin/des Finders…" className={inputCls} />
            </Field>
            <Field label="Alter" required>
              <select required value={form.age} onChange={(e) => set('age', e.target.value)} className={selectCls}>
                <option value="">— Alter wählen —</option>
                <option>Küken</option>
                <option>Jungvogel</option>
                <option>Altvogel</option>
              </select>
            </Field>
            <Field label="Leistungsart">
              <select value={form.serviceType ?? ''} onChange={(e) => set('serviceType', e.target.value || undefined)} className={selectCls}>
                <option value="">— keine —</option>
                {serviceTypes.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </Field>
            <Field label="Vermittelt durch">
              <select value={form.referrer ?? ''} onChange={(e) => set('referrer', e.target.value || undefined)} className={selectCls}>
                <option value="">— keine —</option>
                {referrers.map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
              </select>
            </Field>
          </Section>

          <Section title="Fundumstände" icon="📍">
            <Field label="Fundumstand" required>
              <select required value={form.circumstance} onChange={(e) => set('circumstance', e.target.value)} className={selectCls}>
                <option value="">— Fundumstand wählen —</option>
                {circumstances.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Fundort PLZ">
              <input value={form.zipFoundAt ?? ''} onChange={(e) => set('zipFoundAt', e.target.value)} placeholder="z. B. 06258" className={inputCls} />
            </Field>
          </Section>

          <Section title="Aufnahme" icon="🏥">
            <Field label="Aufnahmedatum">
              <input type="date" value={form.takenInDate ?? ''} onChange={(e) => set('takenInDate', e.target.value)} className={inputCls} />
            </Field>
            <Field label="Aufgenommen von">
              <input value={form.takenInBy ?? ''} onChange={(e) => set('takenInBy', e.target.value)} placeholder="Name…" className={inputCls} />
            </Field>
            <Field label="Pflegestelle">
              <select value={form.careStation ?? ''} onChange={(e) => set('careStation', e.target.value || undefined)} className={selectCls}>
                <option value="">— keine —</option>
                {careStations.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </Field>
          </Section>

          <Section title="Verbleib" icon="🏁">
            <Field label="Verbleib">
              <select value={form.dispositionType ?? ''} onChange={(e) => set('dispositionType', e.target.value || undefined)} className={selectCls}>
                <option value="">— noch in Pflege —</option>
                {dispositionTypes.map((d) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Weiterleitung an">
              <select value={form.redirectedTo ?? ''} onChange={(e) => set('redirectedTo', e.target.value || undefined)} className={selectCls}>
                <option value="">— keine —</option>
                {careStations.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Freilassung am">
              <input type="date" value={form.letFreeDate ?? ''} onChange={(e) => set('letFreeDate', e.target.value)} className={inputCls} />
            </Field>
            <Field label="Verstorben am">
              <input type="date" value={form.diedDate ?? ''} onChange={(e) => set('diedDate', e.target.value)} className={inputCls} />
            </Field>
            <Field label="Euthanasie am">
              <input type="date" value={form.euthanasiaDate ?? ''} onChange={(e) => set('euthanasiaDate', e.target.value)} className={inputCls} />
            </Field>
          </Section>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-4 pb-10">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-white disabled:opacity-60 transition-colors"
              style={{ padding: '12px 24px', background: 'hsl(205, 100%, 35%)' }}
              onMouseEnter={(e) => { if (!isPending) (e.currentTarget as HTMLElement).style.background = 'hsl(208, 100%, 20%)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'hsl(205, 100%, 35%)' }}
            >
              {isPending && (
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {isNew ? 'Eintrag erstellen' : 'Änderungen speichern'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              style={{ padding: '12px 24px' }}
            >
              Abbrechen
            </button>
            {!isNew && isManager && (
              <button
                type="button"
                onClick={() => { if (confirm('Eintrag wirklich löschen?')) deleteMut.mutate() }}
                className="ml-auto inline-flex items-center gap-2 rounded-lg text-sm font-medium border transition-colors"
                style={{ padding: '12px 20px', borderColor: '#fecdd3', color: '#e11d48' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#fff1f2' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <TrashIcon size={14} />
                Löschen
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
