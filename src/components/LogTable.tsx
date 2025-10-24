"use client"; // Wichtig: PrimeReact-Komponenten müssen auf der Client-Seite gerendert werden

import React, { FC, useEffect, useState } from "react";
import { DataTable, DataTableRowEditCompleteEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { LogEntry } from "./types";
import AddLogForm from "./AddLogForm";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import apiRequest from "@/core/apiClient";

export default function LogTable() {
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);

  const getLogEntries = async () => {
    const data = await apiRequest<LogEntry[]>("/api/LogEntries", "GET");
    setLogEntries(data);
  };

  useEffect(() => {
    getLogEntries();
  }, []);

  const textEditor = (options: any) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };

  const onRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
    let _products = [...logEntries];
    let { newData, index } = e;

    _products[index] = newData as LogEntry;

    setLogEntries(_products);
  };

  async function addNewEntry(newEntry: LogEntry): Promise<void> {
    await apiRequest("api/LogEntries", "POST", newEntry);

    getLogEntries();
  }

  const hideDialog = () => {
    if (!dialogVisible) return;
    setDialogVisible(false);
  };

  return (
    <div className="card">
      <Dialog onHide={hideDialog} visible={dialogVisible}>
        <AddLogForm onAdd={addNewEntry} />
      </Dialog>

      <DataTable
        value={logEntries}
        tableStyle={{ minWidth: "50rem" }}
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
          body={(rowData) => new Date(rowData.date).toLocaleDateString("de-DE")}
          sortable
        />
        <Column field="birdSpecies" header="Vogelart" sortable />
        <Column
          field="takenInDate"
          header="Aufnahmedatum"
          body={(rowData) =>
            rowData.takenInDate
              ? new Date(rowData.takenInDate).toLocaleDateString("de-DE")
              : "—"
          }
          sortable
        />
        <Column field="takenInBy" header="Aufgenommen von" sortable />
        <Column field="zipFoundAt" header="Fundort (PLZ)" sortable />
        <Column field="description" header="Beschreibung" sortable />
        <Column field="redirectedTo" header="Weitergeleitet an" sortable />
        <Column
          field="letFreeDate"
          header="Freigelassen am"
          body={(rowData) =>
            rowData.letFreeDate
              ? new Date(rowData.letFreeDate).toLocaleDateString("de-DE")
              : "—"
          }
          sortable
        />
        <Column
          field="diedDate"
          header="Verstorben am"
          body={(rowData) =>
            rowData.diedDate
              ? new Date(rowData.diedDate).toLocaleDateString("de-DE")
              : "—"
          }
          sortable
        />
        <Column
          field="euthanasiaDate"
          header="Euthanasie am"
          body={(rowData) =>
            rowData.euthanasiaDate
              ? new Date(rowData.euthanasiaDate).toLocaleDateString("de-DE")
              : "—"
          }
          sortable
        />
        <Column
          rowEditor
          headerStyle={{ width: "10%", minWidth: "8rem" }}
          bodyStyle={{ textAlign: "center" }}
        />
      </DataTable>

      <Button onClick={() => setDialogVisible(true)} visible={!dialogVisible}>
        Eintrag hinzufügen
      </Button>
    </div>
  );
}
