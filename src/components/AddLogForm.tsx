import React, { FC, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import { Age, BirdSpecies, Circumstance, LogEntry } from "./types";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import apiRequest from "@/core/apiClient";
import { useSession } from "next-auth/react";
import SpeciesAutoComplete from "./AutoComplete";

type Props = {
  onAdd: (entry: LogEntry) => void;
  editEntry: LogEntry | undefined;
};

const AddLogForm: FC<Props> = ({ onAdd, editEntry }) => {
  const [date, setDate] = useState<Date>(editEntry?.date ?? new Date());
  const [age, setAge] = useState<Age>(editEntry?.age ?? "Küken");
  const ageOptions: Age[] = ["Küken", "Jungtier", "Ausgewachsen"];

  const [selectedSpecies, setSelectedSpecies] = useState<string | undefined>(
    editEntry?.birdSpecies,
  );
  const [allSpecies, setAllSpecies] = useState<string[]>([]);

  const [selectedCircumstance, setSelectedCircumstance] = useState<
    string | undefined
  >(editEntry?.circumstance);
  const [allCircumstances, setCircumstances] = useState<string[]>([]);

  const [takenInDate, setTakenInDate] = useState<Date | undefined>(
    editEntry?.takenInDate ?? undefined,
  );
  const [zipFoundAt, setZipFoundAt] = useState<string | undefined>(
    editEntry?.zipFoundAt,
  );
  const [redirectedTo, setRedirectedTo] = useState<string | undefined>(
    editEntry?.redirectedTo,
  );
  const [letFreeDate, setLetFreeDate] = useState<Date | undefined>(
    editEntry?.letFreeDate,
  );
  const [diedDate, setDiedDate] = useState<Date | undefined>(
    editEntry?.diedDate,
  );
  const [euthanasiaDate, setEuthanasiaDate] = useState<Date | undefined>(
    editEntry?.euthanasiaDate,
  );

  const session = useSession({ required: true });

  useEffect(() => {
    const getBirdSpecies = async () => {
      const data = await apiRequest<BirdSpecies[]>(
        "/api/BirdSpecies",
        "GET",
        session.data?.token,
      );
      setAllSpecies(data.map((s) => s.name));
    };

    const getCircumstances = async () => {
      const data = await apiRequest<Circumstance[]>(
        "/api/Circumstances",
        "GET",
        session.data?.token,
      );
      setCircumstances(data.map((c) => c.name));
    };

    getBirdSpecies();
    getCircumstances();
  }, [session.data?.token]);

  const addEntry = () => {
    if (!selectedSpecies || !selectedCircumstance) return;

    const entry: LogEntry = {
      id: editEntry?.id ?? 0,
      date: date,
      age: age,
      birdSpecies: selectedSpecies,
      takenInBy: session.data?.user?.name ?? "anonym",
      takenInDate: takenInDate,
      zipFoundAt: zipFoundAt,
      circumstance: selectedCircumstance,
      redirectedTo: redirectedTo,
      letFreeDate: letFreeDate,
      diedDate: diedDate,
      euthanasiaDate: euthanasiaDate,
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

        <SpeciesAutoComplete
          value={selectedSpecies}
          allValues={allSpecies}
          onSelected={(selected) => setSelectedSpecies(selected)}
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

        <SpeciesAutoComplete
          value={selectedCircumstance}
          allValues={allCircumstances}
          onSelected={(selected) => setSelectedCircumstance(selected)}
        />
      </div>
      <div className="flex-auto">
        <label htmlFor="buttondisplay" className="font-bold block mb-2">
          Weitergeleitet an
        </label>

        <InputText
          placeholder={redirectedTo}
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
