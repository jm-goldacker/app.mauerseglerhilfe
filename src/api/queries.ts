import { api } from './apiClient'
import type {
  NamedItem, LogEntry, LogEntryPost, TripLog, TripLogPost,
  SpeciesStatRow, StatsSummary
} from './types'

// LogEntries
export const logEntriesApi = {
  getAll: () => api.get<LogEntry[]>('/LogEntries'),
  getOne: (id: number) => api.get<LogEntry>(`/LogEntries/${id}`),
  create: (data: LogEntryPost) => api.post<LogEntry>('/LogEntries', data),
  update: (id: number, data: LogEntryPost) => api.put(`/LogEntries/${id}`, data),
  delete: (id: number) => api.delete(`/LogEntries/${id}`),
}

// BirdSpecies
export const birdSpeciesApi = {
  getAll: () => api.get<NamedItem[]>('/BirdSpecies'),
  create: (name: string) => api.post<NamedItem>('/BirdSpecies', { name }),
  update: (id: number, name: string) => api.put(`/BirdSpecies/${id}`, { name }),
  delete: (id: number) => api.delete(`/BirdSpecies/${id}`),
}

// Circumstances
export const circumstancesApi = {
  getAll: () => api.get<NamedItem[]>('/Circumstances'),
  create: (name: string) => api.post<NamedItem>('/Circumstances', { name }),
  update: (id: number, name: string) => api.put(`/Circumstances/${id}`, { name }),
  delete: (id: number) => api.delete(`/Circumstances/${id}`),
}

// ServiceTypes
export const serviceTypesApi = {
  getAll: () => api.get<NamedItem[]>('/ServiceTypes'),
  create: (name: string) => api.post<NamedItem>('/ServiceTypes', { name }),
  update: (id: number, name: string) => api.put(`/ServiceTypes/${id}`, { name }),
  delete: (id: number) => api.delete(`/ServiceTypes/${id}`),
}

// DispositionTypes
export const dispositionTypesApi = {
  getAll: () => api.get<NamedItem[]>('/DispositionTypes'),
  create: (name: string) => api.post<NamedItem>('/DispositionTypes', { name }),
  update: (id: number, name: string) => api.put(`/DispositionTypes/${id}`, { name }),
  delete: (id: number) => api.delete(`/DispositionTypes/${id}`),
}

// CareStations
export const careStationsApi = {
  getAll: () => api.get<NamedItem[]>('/CareStations'),
  create: (name: string) => api.post<NamedItem>('/CareStations', { name }),
  update: (id: number, name: string) => api.put(`/CareStations/${id}`, { name }),
  delete: (id: number) => api.delete(`/CareStations/${id}`),
}

// TripLogs
export const tripLogsApi = {
  getAll: () => api.get<TripLog[]>('/TripLogs'),
  getOne: (id: number) => api.get<TripLog>(`/TripLogs/${id}`),
  create: (data: TripLogPost) => api.post<TripLog>('/TripLogs', data),
  update: (id: number, data: TripLogPost) => api.put(`/TripLogs/${id}`, data),
  delete: (id: number) => api.delete(`/TripLogs/${id}`),
}

// Statistics
export const statisticsApi = {
  getSpeciesByAge: (year?: number) =>
    api.get<SpeciesStatRow[]>(`/Statistics/species-by-age${year ? `?year=${year}` : ''}`),
  getSummary: (year?: number) =>
    api.get<StatsSummary>(`/Statistics/summary${year ? `?year=${year}` : ''}`),
  getYears: () => api.get<number[]>('/Statistics/years'),
}
