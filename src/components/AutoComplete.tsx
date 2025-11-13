import {
  AutoComplete,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import { FC, useEffect, useState } from "react";

type Props = {
  id: string | undefined;
  value: string | undefined;
  allValues: string[];
  onSelected: (s: string | undefined) => void;
  useOnlyPredefinedValues: boolean;
};

const SpeciesAutoComplete: FC<Props> = ({
  id,
  value,
  allValues,
  onSelected,
  useOnlyPredefinedValues,
}) => {
  const [selectedSpecies, setSelectedSpecies] = useState<string | undefined>(
    value,
  );
  const [speciesSuggestion, setSpeciesSuggestion] = useState<string[]>([]);

  useEffect(() => {
    onSelected(selectedSpecies);
  }, [selectedSpecies, onSelected]);

  const searchSpecies = (event: AutoCompleteCompleteEvent) => {
    setSpeciesSuggestion(
      allValues.filter((s) =>
        s.toLowerCase().includes(event.query.toLowerCase()),
      ),
    );
  };

  const autoCompleteSpecies = (currentText: string) => {
    if (!selectedSpecies) return;

    const exisitingSpecies = allValues.find((species) =>
      species.toLowerCase().includes(selectedSpecies.toLowerCase()),
    );

    if (exisitingSpecies) {
      setSelectedSpecies(exisitingSpecies);
    } else if (useOnlyPredefinedValues) {
      setSelectedSpecies(undefined);
    } else {
      setSelectedSpecies(currentText);
    }
  };

  return (
    <AutoComplete
      id={id}
      value={selectedSpecies}
      suggestions={speciesSuggestion}
      completeMethod={searchSpecies}
      onChange={(e) => setSelectedSpecies(e.value)}
      onBlur={(e) => autoCompleteSpecies(e.target.value)}
      dropdown
    />
  );
};

export default SpeciesAutoComplete;
