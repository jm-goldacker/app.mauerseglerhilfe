'use client'; // Wichtig: PrimeReact-Komponenten müssen auf der Client-Seite gerendert werden

import React, { useEffect, useState } from 'react';
import { DataTable, DataTableRowEditCompleteEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';

interface LogEntry {
  id: number,
  date: Date,
  birdSpecies: BirdSpecies,
  takenInDate: Date | undefined,
  takenInBy: string,
  zipFoundAt: string | undefined,
  description: string | undefined,
  redirectedTo: string | undefined,
  letFreeDate: Date | undefined,
  diedDate: Date | undefined,
  euthanasiaDate: Date | undefined
}

interface BirdSpecies {
  id: number,
  description: string,
}

enum Age {
  Chick,
  Young,
  Old,
}

export default function DataTableDemo() {
  const mockEntries: LogEntry[] = [
    {
      id: 1,
      date: new Date("2025-09-15"),
      birdSpecies: {
        id: 101,
        description: "Haussperling (Passer domesticus)"
      },
      takenInDate: new Date("2025-09-15"),
      takenInBy: "Max Goldacker",
      zipFoundAt: "10115",
      description: "Junger Sperling mit gebrochenem Flügel gefunden. Wird in der Station behandelt.",
      redirectedTo: undefined,
      letFreeDate: new Date("2025-10-01"),
      diedDate: undefined,
      euthanasiaDate: undefined
    },
    {
      id: 2,
      date: new Date("2025-09-20"),
      birdSpecies: {
        id: 102,
        description: "Amsel (Turdus merula)"
      },
      takenInDate: new Date("2025-09-20"),
      takenInBy: "Anna Schmidt",
      zipFoundAt: "10405",
      description: "Ältere Amsel mit Verletzung am Bein. Wird zur weiteren Behandlung an die Vogelstation Berlin weitergeleitet.",
      redirectedTo: "Vogelstation Berlin, Kontakt: 030-12345678",
      letFreeDate: undefined,
      diedDate: undefined,
      euthanasiaDate: undefined
    },
    {
      id: 3,
      date: new Date("2025-09-22"),
      birdSpecies: {
        id: 103,
        description: "Kohlmeise (Parus major)"
      },
      takenInDate: new Date("2025-09-22"),
      takenInBy: "Peter Müller",
      zipFoundAt: "12043",
      description: "Küken ohne Elternvögel gefunden. Schwere innere Verletzungen.",
      redirectedTo: undefined,
      letFreeDate: undefined,
      diedDate: new Date("2025-09-25"),
      euthanasiaDate: undefined
    },
    {
      id: 4,
      date: new Date("2025-09-28"),
      birdSpecies: {
        id: 104,
        description: "Ringeltaube (Columba palumbus)"
      },
      takenInDate: new Date("2025-09-28"),
      takenInBy: "Lisa Bauer",
      zipFoundAt: "10969",
      description: "Alte Taube mit schweren Infektionen. Keine Aussicht auf Besserung.",
      redirectedTo: undefined,
      letFreeDate: undefined,
      diedDate: undefined,
      euthanasiaDate: new Date("2025-09-30")
    },
    {
      id: 5,
      date: new Date("2025-10-02"),
      birdSpecies: {
        id: 105,
        description: "Rotkehlchen (Erithacus rubecula)"
      },
      takenInDate: new Date("2025-10-02"),
      takenInBy: "Thomas Weber",
      zipFoundAt: "13353",
      description: "Junges Rotkehlchen mit Parasitenbefall. Wird aktuell medizinisch versorgt.",
      redirectedTo: undefined,
      letFreeDate: undefined,
      diedDate: undefined,
      euthanasiaDate: undefined
    },
    {
      id: 6,
      date: new Date("2025-10-03"),
      birdSpecies: {
        id: 106,
        description: "Star (Sturnus vulgaris)"
      },
      takenInDate: undefined,
      takenInBy: "Unbekannt",
      zipFoundAt: undefined,
      description: "Verletzter Star gemeldet, aber nicht aufgenommen.",
      redirectedTo: undefined,
      letFreeDate: undefined,
      diedDate: undefined,
      euthanasiaDate: undefined
    }
  ];

  const [logEntries, setLogEntries] = useState(mockEntries);

  const textEditor = (options: any) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };

  const onRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
        let _products = [...logEntries];
        let { newData, index } = e;

        _products[index] = newData as LogEntry;

        setLogEntries(_products);
    };

  return (
    <div className="card">
      <DataTable
        value={logEntries} 
        tableStyle={{ minWidth: '50rem' }}
        editMode="row"
        onRowEditComplete={onRowEditComplete}
      >
        <Column 
          field="id" 
          header="ID"
          sortable
          editor={(options) => textEditor(options)}
        />
        <Column
          field="date"
          header="Erfassungsdatum"
          body={(rowData) => rowData.date.toLocaleDateString('de-DE')}
          sortable
        />
        <Column
          field="birdSpecies.description"
          header="Vogelart"
          sortable
        />
        <Column
          field="takenInDate"
          header="Aufnahmedatum"
          body={(rowData) => rowData.takenInDate ? rowData.takenInDate.toLocaleDateString('de-DE') : '—'}
          sortable
        />
        <Column 
          field="takenInBy" 
          header="Aufgenommen von" 
          sortable
        />
        <Column 
          field="zipFoundAt" 
          header="Fundort (PLZ)" 
          sortable
        />
        <Column 
          field="description" 
          header="Beschreibung"
          sortable 
        />
        <Column 
          field="redirectedTo" 
          header="Weitergeleitet an"
          sortable
        />
        <Column
          field="letFreeDate"
          header="Freigelassen am"
          body={(rowData) => rowData.letFreeDate ? rowData.letFreeDate.toLocaleDateString('de-DE') : '—'}
          sortable
        />
        <Column
          field="diedDate"
          header="Verstorben am"
          body={(rowData) => rowData.diedDate ? rowData.diedDate.toLocaleDateString('de-DE') : '—'}
          sortable
        />
        <Column
          field="euthanasiaDate"
          header="Euthanasie am"
          body={(rowData) => rowData.euthanasiaDate ? rowData.euthanasiaDate.toLocaleDateString('de-DE') : '—'}
          sortable
        />
        <Column 
          rowEditor
          headerStyle={{ width: '10%', minWidth: '8rem' }} 
          bodyStyle={{ textAlign: 'center' }}/>
      </DataTable>
    </div>
  );
}
