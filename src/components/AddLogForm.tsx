import React, { FC, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import { Age, BirdSpecies, LogEntry } from "./types";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";

type Props = {
  onAdd: (entry: LogEntry) => void;
};

const AddLogForm: FC<Props> = ({ onAdd }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [age, setAge] = useState<Age>("chick");
  const ageOptions: Age[] = ["chick", "young", "old"];
  const [species, setSpecies] = useState<BirdSpecies>();
  const [speciesName, setSpeciesName] = useState<string>();
  const [speciesSuggestion, setSpeciesSuggestion] = useState<string[]>();
  const [takenInDate, setTakenInDate] = useState<Date>();
  const [zipFoundAt, setZipFoundAt] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [redirectedTo, setRedirectedTo] = useState<string>();
  const [letFreeDate, setLetFreeDate] = useState<Date>();
  const [diedDate, setDiedDate] = useState<Date>();
  const [euthanasiaDate, setEuthanasiaDate] = useState<Date>();

  const allSpecies: BirdSpecies[] = [
    { id: 0, description: "Amsel" },
    { id: 1, description: "Mauersegler" },
    { id: 2, description: "Spatz" },
    { id: 3, description: "Möwe" },
  ];

  const searchSpecies = (event: AutoCompleteCompleteEvent) => {
    setSpeciesSuggestion(
      speciesNames.filter((species) =>
        species.toLowerCase().includes(event.query.toLowerCase()),
      ),
    );
  };

  const speciesNames = allSpecies.map(species => species.description);

  const addEntry = () => {
    
    if (!species) return;

    const entry: LogEntry = {
      id: 0,
      date: date,
      age: age,
      birdSpecies: species,
      takenInBy: "nutzer",
      takenInDate: takenInDate,
      zipFoundAt: zipFoundAt,
      description: description,
      redirectedTo: redirectedTo,
      letFreeDate: letFreeDate,
      diedDate: diedDate,
      euthanasiaDate: euthanasiaDate,
    };

    onAdd(entry);
  };

  const autoCompleteName = () => {
    if (!speciesName) return;

    var exisitingSpecies = allSpecies.find(species => species.description.toLowerCase().includes(speciesName.toLowerCase()));

    if (exisitingSpecies) {
        setSpecies(exisitingSpecies);
        setSpeciesName(exisitingSpecies.description);
    }
  }

  return (
    <div className="grid grid-flow-row auto-rows-max">
      <div className="flex-auto">
        <label htmlFor="buttondisplay" className="font-bold block mb-2">
          Datum
        </label>

        <Calendar
          value={date}
          onChange={(e) => {
            if (!e.value) return;
            setDate(e.value);
          }}
        />
      </div>
      <div className="flex-auto">
        <label htmlFor="buttondisplay" className="font-bold block mb-2">
          Alter
        </label>

        <Dropdown
          value={age}
          onChange={(e: DropdownChangeEvent) => setAge(e.value)}
          options={ageOptions}
          optionLabel="name"
          placeholder="Alter auswählen"
        />
      </div>
      <div className="flex-auto">
        <label htmlFor="buttondisplay" className="font-bold block mb-2">
          Art
        </label>

        <AutoComplete
          value={speciesName}
          suggestions={speciesSuggestion}
          completeMethod={searchSpecies}
          onChange={(e) => setSpeciesName(e.value)}
          onBlur={autoCompleteName}
          dropdown 
        />
      </div>
      <div className="flex-auto">
        <label htmlFor="buttondisplay" className="font-bold block mb-2">
          Aufgenommen am
        </label>

        <Calendar
          value={takenInDate}
          onChange={(e) => {
            if (!e.value) return;
            setTakenInDate(e.value);
          }}
        />
      </div>
      <div className="flex-auto">
        <label htmlFor="buttondisplay" className="font-bold block mb-2">
          PLZ Fundort
        </label>

        <InputMask
          mask="99999"
          value={zipFoundAt}
          onChange={(e) => {
            if (!e.value) return;
            setZipFoundAt(e.value);
          }}
        />
      </div>
      <div className="flex-auto">
        <label htmlFor="buttondisplay" className="font-bold block mb-2">
          Beschreibung
        </label>

        <InputText
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
      </div>
      <div className="flex-auto">
        <label htmlFor="buttondisplay" className="font-bold block mb-2">
          Weitergeleitet an
        </label>

        <InputText
          value={redirectedTo}
          onChange={(e) => {
            setRedirectedTo(e.target.value);
          }}
        />
      </div>
      <div className="flex-auto">
        <label htmlFor="buttondisplay" className="font-bold block mb-2">
          Freigelassen am
        </label>

        <Calendar
          value={letFreeDate}
          onChange={(e) => {
            if (!e.value) return;
            setLetFreeDate(e.value);
          }}
        />
      </div>
      <div className="flex-auto">
        <label htmlFor="buttondisplay" className="font-bold block mb-2">
          Verstorben am
        </label>

        <Calendar
          value={diedDate}
          onChange={(e) => {
            if (!e.value) return;
            setDiedDate(e.value);
          }}
        />
      </div>
      <div className="flex-auto">
        <label htmlFor="buttondisplay" className="font-bold block mb-2">
          Euthanasie am
        </label>

        <Calendar
          value={euthanasiaDate}
          onChange={(e) => {
            if (!e.value) return;
            setEuthanasiaDate(e.value);
          }}
        />
      </div>
      <div className="flex-auto">
        <Button onClick={() => addEntry()}>Add</Button>
      </div>
    </div>
  );
};

export default AddLogForm;
