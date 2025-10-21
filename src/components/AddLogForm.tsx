import React, { FC, useEffect, useState } from "react";
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputMask } from 'primereact/inputmask';
import { InputText } from "primereact/inputtext";
import { Age, LogEntry } from "./types";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

type Props = {
    onAdd: (entry: LogEntry) => void
}

const AddLogForm: FC<Props> =({
    onAdd
}) => {
    const [date, setDate] = useState<Date>(new Date());
    const [age, setAge] = useState<Age>("chick");
    const ageOptions: Age[] = ["chick", "young", "old"];
    const [takenInDate, setTakenInDate] = useState<Date | undefined>();
    const [zipFoundAt, setZipFoundAt] = useState<string | undefined>(undefined);
    const [description, setDescription] = useState<string | undefined>();
    const [redirectedTo, setRedirectedTo] = useState<string | undefined>();
    const [letFreeDate, setLetFreeDate] = useState<Date | undefined>();
    const [diedDate, setDiedDate] = useState<Date | undefined>();
    const [euthanasiaDate, setEuthanasiaDate] = useState<Date | undefined>();

    const addEntry = () => {
        const entry: LogEntry = {
            id: 0,
            date: date,
            age: age,
            birdSpecies: {
                id: 0,
                description: "Vogelart"
            },
            takenInBy: "nutzer",
            takenInDate: takenInDate,
            zipFoundAt: zipFoundAt,
            description: description,
            redirectedTo: redirectedTo,
            letFreeDate: letFreeDate,
            diedDate: diedDate,
            euthanasiaDate: euthanasiaDate
        }

        onAdd(entry);
    }

    return (
        <div className="grid grid-flow-row auto-rows-max">  
        <div className="flex-auto">
                <label htmlFor="buttondisplay" className="font-bold block mb-2">
                    Datum
                </label>

                <Calendar value={date} onChange={(e) => { if (!e.value) return; setDate(e.value)}}  />
            </div>
             <div className="flex-auto">
                <label htmlFor="buttondisplay" className="font-bold block mb-2">
                    Alter
                </label>

                <Dropdown value={age} onChange={(e: DropdownChangeEvent) => setAge(e.value)} options={ageOptions} optionLabel="name" 
                placeholder="Alter auswählen"  />
            </div>
            <div className="flex-auto">
                <label htmlFor="buttondisplay" className="font-bold block mb-2">
                    Aufgenommen am
                </label>

                <Calendar value={takenInDate} onChange={(e) => { if (!e.value) return; setTakenInDate(e.value)}}   />
            </div>
            <div className="flex-auto">
                <label htmlFor="buttondisplay" className="font-bold block mb-2">
                    PLZ Fundort
                </label>

                <InputMask mask="99999" value={zipFoundAt} onChange={(e) => { if (!e.value) return; setZipFoundAt(e.value)}}  />
            </div>
            <div className="flex-auto">
                <label htmlFor="buttondisplay" className="font-bold block mb-2">
                    Beschreibung
                </label>

                <InputText value={description} onChange={(e) => { setDescription(e.target.value)}}  />
            </div>
            <div className="flex-auto">
                <label htmlFor="buttondisplay" className="font-bold block mb-2">
                    Weitergeleitet an
                </label>

                <InputText value={redirectedTo} onChange={(e) => { setRedirectedTo(e.target.value)}}  />
            </div>
            <div className="flex-auto">
                <label htmlFor="buttondisplay" className="font-bold block mb-2">
                    Freigelassen am
                </label>

                <Calendar value={letFreeDate} onChange={(e) => { if (!e.value) return; setLetFreeDate(e.value)}}   />
            </div>
            <div className="flex-auto">
                <label htmlFor="buttondisplay" className="font-bold block mb-2">
                    Verstorben am
                </label>

                <Calendar value={diedDate} onChange={(e) => { if (!e.value) return; setDiedDate(e.value)}}   />
            </div>
            <div className="flex-auto">
                <label htmlFor="buttondisplay" className="font-bold block mb-2">
                    Euthanasie am
                </label>

                <Calendar value={euthanasiaDate} onChange={(e) => { if (!e.value) return; setEuthanasiaDate(e.value)}}   />
            </div>
            <div className="flex-auto">
                <Button onClick={() => addEntry()}>Add</Button>
            </div>
        </div>
    )
}

export default AddLogForm;