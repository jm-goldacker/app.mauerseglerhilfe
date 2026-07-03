import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './components/Layout'
import Bestandsbuch from './pages/Bestandsbuch'
import LogEntryForm from './pages/LogEntryForm'
import Statistik from './pages/Statistik'
import Fahrtenbuch from './pages/Fahrtenbuch'
import Vogelarten from './pages/stammdaten/Vogelarten'
import Fundumstaende from './pages/stammdaten/Fundumstaende'
import Leistungsarten from './pages/stammdaten/Leistungsarten'
import Verbleib from './pages/stammdaten/Verbleib'
import Pflegestellen from './pages/stammdaten/Pflegestellen'
import Vermittler from './pages/stammdaten/Vermittler'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Bestandsbuch />} />
            <Route path="/eintrag/:id" element={<LogEntryForm />} />
            <Route path="/statistik" element={<Statistik />} />
            <Route path="/fahrtenbuch" element={<Fahrtenbuch />} />
            <Route path="/stammdaten/vogelarten" element={<Vogelarten />} />
            <Route path="/stammdaten/fundumstaende" element={<Fundumstaende />} />
            <Route path="/stammdaten/leistungsarten" element={<Leistungsarten />} />
            <Route path="/stammdaten/verbleib" element={<Verbleib />} />
            <Route path="/stammdaten/pflegestellen" element={<Pflegestellen />} />
            <Route path="/stammdaten/vermittler" element={<Vermittler />} />
            {/* Unbekannte URLs zeigten bisher nur leeren Inhalt */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
