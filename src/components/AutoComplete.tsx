import {
  AutoComplete,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import { FC, useEffect, useState } from "react";

type Props = {
  value: string | undefined;
  allValues: string[];
  onSelected: (s: string | undefined) => void;
};

const SpeciesAutoComplete: FC<Props> = ({ value, allValues, onSelected }) => {
  const [selectedSpecies, setSelectedSpecies] = useState<string | undefined>(
    value,
  );
  const [speciesSuggestion, setSpeciesSuggestion] = useState<string[]>([]);

  useEffect(() => {
    onSelected(selectedSpecies);
  }, [selectedSpecies]);

  const searchSpecies = (event: AutoCompleteCompleteEvent) => {
    setSpeciesSuggestion(
      allValues.filter((s) =>
        s.toLowerCase().includes(event.query.toLowerCase()),
      ),
    );
  };

  const autoCompleteSpecies = () => {
    if (!selectedSpecies) return;

    var exisitingSpecies = allValues.find((species) =>
      species.toLowerCase().includes(selectedSpecies.toLowerCase()),
    );

    if (exisitingSpecies) {
      setSelectedSpecies(exisitingSpecies);
    } else {
      setSelectedSpecies(undefined);
    }
  };

  return (
    <AutoComplete
      value={selectedSpecies}
      suggestions={speciesSuggestion}
      completeMethod={searchSpecies}
      onChange={(e) => setSelectedSpecies(e.value)}
      onBlur={autoCompleteSpecies}
      dropdown
    />
  );
};

export default SpeciesAutoComplete;
