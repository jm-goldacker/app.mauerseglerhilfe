export interface NamedItem {
  id: number
  name: string
}

export interface LogEntry {
  id: number
  date: string
  name?: string
  ringNumber?: string
  finderName?: string
  age: string
  birdSpecies: string
  circumstance: string
  serviceType?: string
  dispositionType?: string
  careStation?: string
  referrer?: string
  takenInDate?: string
  takenInBy?: string
  zipFoundAt?: string
  redirectedTo?: string
  letFreeDate?: string
  diedDate?: string
  euthanasiaDate?: string
}

export interface LogEntryPost {
  date: string
  name?: string
  ringNumber?: string
  finderName?: string
  age: string
  birdSpecies: string
  circumstance: string
  serviceType?: string
  dispositionType?: string
  careStation?: string
  referrer?: string
  takenInDate?: string
  takenInBy?: string
  zipFoundAt?: string
  redirectedTo?: string
  letFreeDate?: string
  diedDate?: string
  euthanasiaDate?: string
}

export interface TripLog {
  id: number
  date: string
  driver: string
  purpose: string
  startLocation: string
  endLocation: string
  distanceKm: number
  notes?: string
}

export interface TripLogPost {
  date: string
  driver: string
  purpose: string
  startLocation: string
  endLocation: string
  distanceKm: number
  notes?: string
}

export interface AgeStatRow {
  age: string
  survived: number
  died: number
  inCare: number
}

export interface SpeciesStatRow {
  birdSpecies: string
  ageStats: AgeStatRow[]
  totalSurvived: number
  totalDied: number
  totalInCare: number
  total: number
}

export interface StatsSummary {
  total: number
  died: number
  released: number
  inCare: number
}
