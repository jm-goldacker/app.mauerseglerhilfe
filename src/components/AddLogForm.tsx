import React, { FC, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import { Age, BirdSpecies, Circumstance, LogEntry } from "./types";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import apiRequest from "@/core/apiClient";
import { useSession } from "next-auth/react";

type Props = {
  onAdd: (entry: LogEntry) => void;
};

const AddLogForm: FC<Props> = ({ onAdd }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [age, setAge] = useState<Age>("chick");
  const ageOptions: Age[] = ["chick", "young", "old"];

  const [allSpecies, setAllSpecies] = useState<string[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<string>();
  const [speciesSuggestion, setSpeciesSuggestion] = useState<string[]>([]);

  const [allCircumstances, setCircumstances] = useState<string[]>([]);
  const [selectedCircumstance, setSelectedCircumstance] = useState<string>();
  const [circumstanceSuggestions, setCircumstanceSuggestions] = useState<
    string[]
  >([]);

  const [takenInDate, setTakenInDate] = useState<Date>();
  const [zipFoundAt, setZipFoundAt] = useState<string>();
  const [redirectedTo, setRedirectedTo] = useState<string>();
  const [letFreeDate, setLetFreeDate] = useState<Date>();
  const [diedDate, setDiedDate] = useState<Date>();
  const [euthanasiaDate, setEuthanasiaDate] = useState<Date>();

  const session = useSession();

  useEffect(() => {
    const getBirdSpecies = async () => {
      const data = await apiRequest<BirdSpecies[]>("/api/BirdSpecies", "GET");
      setAllSpecies(data.map((s) => s.name));
    };

    const getCircumstances = async () => {
      const data = await apiRequest<Circumstance[]>(
        "/api/Circumstances",
        "GET",
      );
      setCircumstances(data.map((c) => c.name));
    };

    getBirdSpecies();
    getCircumstances();
  }, []);

  const searchSpecies = (event: AutoCompleteCompleteEvent) => {
    setSpeciesSuggestion(
      allSpecies.filter((s) =>
        s.toLowerCase().includes(event.query.toLowerCase()),
      ),
    );
  };

  const searchCircumstances = (event: AutoCompleteCompleteEvent) => {
    setCircumstanceSuggestions(
      allCircumstances.filter((c) =>
        c.toLowerCase().includes(event.query.toLowerCase()),
      ),
    );
  };

  const autoCompleteSpecies = () => {
    if (!selectedSpecies) return;

    var exisitingSpecies = allSpecies.find((species) =>
      species.toLowerCase().includes(selectedSpecies.toLowerCase()),
    );

    if (exisitingSpecies) {
      setSelectedSpecies(exisitingSpecies);
    }
  };

  const autoCompleteCircumstance = () => {
    if (!selectedCircumstance) return;

    var existingCircumstance = allCircumstances.find((c) =>
      c.toLowerCase().includes(selectedCircumstance.toLowerCase()),
    );

    if (existingCircumstance) {
      setSelectedCircumstance(existingCircumstance);
    }
  };

  const addEntry = () => {
    if (!selectedSpecies || !selectedCircumstance) return;

    const entry: LogEntry = {
      id: 0,
      date: date,
      age: age,
      birdSpecies: selectedSpecies,
      takenInBy: session.data?.user?.name ?? "anonym",
      takenInDate: takenInDate?.toISOString(),
      zipFoundAt: zipFoundAt,
      circumstance: selectedCircumstance,
      redirectedTo: redirectedTo,
      letFreeDate: letFreeDate?.toISOString(),
      diedDate: diedDate?.toISOString(),
      euthanasiaDate: euthanasiaDate?.toISOString(),
    };

    onAdd(entry);
  };

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
          value={selectedSpecies}
          suggestions={speciesSuggestion}
          completeMethod={searchSpecies}
          onChange={(e) => setSelectedSpecies(e.value)}
          onBlur={autoCompleteSpecies}
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

        <AutoComplete
          value={selectedCircumstance}
          suggestions={circumstanceSuggestions}
          completeMethod={searchCircumstances}
          onChange={(e) => setSelectedCircumstance(e.value)}
          onBlur={autoCompleteCircumstance}
          dropdown
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
