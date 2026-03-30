import NamedItemManager from '../../components/NamedItemManager'
import { careStationsApi } from '../../api/queries'

export default function Pflegestellen() {
  return (
    <NamedItemManager
      title="Pflegestellen"
      description="Externe Stationen und Einrichtungen für Weiterleitungen"
      queryKey="careStations"
      fetchAll={careStationsApi.getAll}
      create={(name) => careStationsApi.create(name)}
      update={(id, name) => careStationsApi.update(id, name)}
      remove={(id) => careStationsApi.delete(id)}
    />
  )
}
