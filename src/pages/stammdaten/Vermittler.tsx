import NamedItemManager from '../../components/NamedItemManager'
import { referrersApi } from '../../api/queries'

export default function Vermittler() {
  return (
    <NamedItemManager
      title="Vermittler"
      description="Personen und Stellen, über die Vögel vermittelt werden (z. B. für Aufnahmestopp-Infos)"
      queryKey="referrers"
      fetchAll={referrersApi.getAll}
      create={(name) => referrersApi.create(name)}
      update={(id, name) => referrersApi.update(id, name)}
      remove={(id) => referrersApi.delete(id)}
    />
  )
}
