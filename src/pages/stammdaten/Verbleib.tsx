import NamedItemManager from '../../components/NamedItemManager'
import { dispositionTypesApi } from '../../api/queries'

export default function Verbleib() {
  return (
    <NamedItemManager
      title="Verbleib-Arten"
      description="Mögliche Ausgänge (vermittelt, ausgewildert, verstorben …)"
      queryKey="dispositionTypes"
      fetchAll={dispositionTypesApi.getAll}
      create={(name) => dispositionTypesApi.create(name)}
      update={(id, name) => dispositionTypesApi.update(id, name)}
      remove={(id) => dispositionTypesApi.delete(id)}
    />
  )
}
