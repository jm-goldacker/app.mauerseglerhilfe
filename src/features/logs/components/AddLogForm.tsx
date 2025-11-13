import React, { FC, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import { Age, LogEntry } from "../types";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { useSession } from "next-auth/react";
import SpeciesAutoComplete from "@/components/AutoComplete";
import { useCircumstances } from "@/features/circumstances/hooks/useCircumstances";
import { useBirdSpecies } from "@/features/birdSpecies/hooks/useBirdSpecies";
import { Message } from "primereact/message";
import { ProgressSpinner } from "primereact/progressspinner";

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

  const [selectedCircumstance, setSelectedCircumstance] = useState<
    string | undefined
  >(editEntry?.circumstance);

  const [takenInDate, setTakenInDate] = useState<Date | undefined>(
    editEntry?.takenInDate ? new Date(editEntry.takenInDate) : undefined,
  );
  const [zipFoundAt, setZipFoundAt] = useState<string | undefined>(
    editEntry?.zipFoundAt,
  );
  const [redirectedTo, setRedirectedTo] = useState<string | undefined>(
    editEntry?.redirectedTo,
  );
  const [letFreeDate, setLetFreeDate] = useState<Date | undefined>(
    editEntry?.letFreeDate ? new Date(editEntry.letFreeDate) : undefined,
  );
  const [diedDate, setDiedDate] = useState<Date | undefined>(
    editEntry?.diedDate ? new Date(editEntry.diedDate) : undefined,
  );
  const [euthanasiaDate, setEuthanasiaDate] = useState<Date | undefined>(
    editEntry?.euthanasiaDate ? new Date(editEntry.euthanasiaDate) : undefined,
  );

  const session = useSession({ required: true });

  const {
    circumstances,
    loading: loadingCircumstances,
    error: errorCircumstances,
  } = useCircumstances();

  const {
    birdSpecies: allSpecies,
    loading: loadingSpecies,
    error: errorSpecies,
  } = useBirdSpecies();

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
    <div>
      {errorCircumstances && (
        <Message severity="error" text={errorCircumstances} className="mb-3" />
      )}
      {errorSpecies && (
        <Message severity="error" text={errorSpecies} className="mb-3" />
      )}

      {loadingCircumstances || loadingSpecies ? (
        <div className="flex justify-center">
          <ProgressSpinner />
        </div>
      ) : (
        <div className="grid grid-flow-row auto-rows-max">
          <div className="flex-auto">
            <label htmlFor="date" className="font-bold block mb-2">
              Datum
            </label>

            <Calendar
              id="date"
              showButtonBar
              dateFormat="dd.mm.yy"
              value={date}
              onChange={(e) => {
                if (!e.value) return;
                setDate(e.value);
              }}
            />
          </div>
          <div className="flex-auto">
            <label htmlFor="age" className="font-bold block mb-2">
              Alter
            </label>

            <Dropdown
              id="age"
              value={age}
              onChange={(e: DropdownChangeEvent) => setAge(e.value)}
              options={ageOptions}
              optionLabel="name"
              placeholder="Alter auswählen"
            />
          </div>
          <div className="flex-auto">
            <label htmlFor="species" className="font-bold block mb-2">
              Art
            </label>

            <SpeciesAutoComplete
              id="species"
              value={selectedSpecies}
              allValues={allSpecies.map((s) => s.name)}
              onSelected={(selected) => setSelectedSpecies(selected)}
              useOnlyPredefinedValues={false}
            />
          </div>
          <div className="flex-auto">
            <label htmlFor="takenInDate" className="font-bold block mb-2">
              Aufgenommen am
            </label>

            <Calendar
              id="takenInDate"
              showButtonBar
              dateFormat="dd.mm.yy"
              value={takenInDate}
              onChange={(e) => {
                if (!e.value) return;
                setTakenInDate(e.value);
              }}
            />
          </div>
          <div className="flex-auto">
            <label htmlFor="zipCode" className="font-bold block mb-2">
              PLZ Fundort
            </label>

            <InputMask
              id="zipCode"
              mask="99999"
              value={zipFoundAt}
              onChange={(e) => {
                if (!e.value) return;
                setZipFoundAt(e.value);
              }}
            />
          </div>
          <div className="flex-auto">
            <label htmlFor="circumstances" className="font-bold block mb-2">
              Fundumstand
            </label>

            <SpeciesAutoComplete
              id="circumstances"
              value={selectedCircumstance}
              allValues={circumstances.map((c) => c.name)}
              onSelected={(selected) => setSelectedCircumstance(selected)}
              useOnlyPredefinedValues={true}
            />
          </div>
          <div className="flex-auto">
            <label htmlFor="redirectedTo" className="font-bold block mb-2">
              Weitergeleitet an
            </label>

            <InputText
              id="redirectedTo"
              placeholder={redirectedTo}
              onChange={(e) => {
                setRedirectedTo(e.target.value);
              }}
            />
          </div>
          <div className="flex-auto">
            <label htmlFor="letFreeDate" className="font-bold block mb-2">
              Freigelassen am
            </label>

            <Calendar
              id="letFreeDate"
              showButtonBar
              dateFormat="dd.mm.yy"
              value={letFreeDate}
              onChange={(e) => {
                if (!e.value) return;
                setLetFreeDate(e.value);
              }}
            />
          </div>
          <div className="flex-auto">
            <label htmlFor="diedDate" className="font-bold block mb-2">
              Verstorben am
            </label>

            <Calendar
              id="diedDate"
              showButtonBar
              dateFormat="dd.mm.yy"
              value={diedDate}
              onChange={(e) => {
                if (!e.value) return;
                setDiedDate(e.value);
              }}
            />
          </div>
          <div className="flex-auto">
            <label htmlFor="euthanasiaDate" className="font-bold block mb-2">
              Euthanasie am
            </label>

            <Calendar
              id="euthanasiaDate"
              showButtonBar
              dateFormat="dd.mm.yy"
              value={euthanasiaDate}
              onChange={(e) => {
                if (!e.value) return;
                setEuthanasiaDate(e.value);
              }}
            />
          </div>
          <div className="flex-auto mt-3 mb-3">
            <Button onClick={() => addEntry()}>Add</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddLogForm;
