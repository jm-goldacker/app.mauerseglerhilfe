import NamedItemManager from '../../components/NamedItemManager'
import { birdSpeciesApi } from '../../api/queries'

export default function Vogelarten() {
  return (
    <NamedItemManager
      title="Vogelarten"
      description="Bekannte Vogelarten als Vorlage für neue Einträge"
      queryKey="birdSpecies"
      fetchAll={birdSpeciesApi.getAll}
      create={(name) => birdSpeciesApi.create(name)}
      update={(id, name) => birdSpeciesApi.update(id, name)}
      remove={(id) => birdSpeciesApi.delete(id)}
    />
  )
}
