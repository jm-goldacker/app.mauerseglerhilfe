import NamedItemManager from '../../components/NamedItemManager'
import { serviceTypesApi } from '../../api/queries'

export default function Leistungsarten() {
  return (
    <NamedItemManager
      title="Leistungsarten"
      description="Art der erbrachten Leistung (Beratung, Vermittlung, Aufnahme …)"
      queryKey="serviceTypes"
      fetchAll={serviceTypesApi.getAll}
      create={(name) => serviceTypesApi.create(name)}
      update={(id, name) => serviceTypesApi.update(id, name)}
      remove={(id) => serviceTypesApi.delete(id)}
    />
  )
}
