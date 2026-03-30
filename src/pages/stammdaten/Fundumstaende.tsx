import NamedItemManager from '../../components/NamedItemManager'
import { circumstancesApi } from '../../api/queries'

export default function Fundumstaende() {
  return (
    <NamedItemManager
      title="Fundumstände"
      description="Ursachen und Umstände des Vogelfunds"
      queryKey="circumstances"
      fetchAll={circumstancesApi.getAll}
      create={(name) => circumstancesApi.create(name)}
      update={(id, name) => circumstancesApi.update(id, name)}
      remove={(id) => circumstancesApi.delete(id)}
    />
  )
}
