"use client"; // Wichtig: PrimeReact-Komponenten müssen auf der Client-Seite gerendert werden

import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { LogEntry } from "../types";
import AddLogForm from "./AddLogForm";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useSession } from "next-auth/react";
import { useLogs } from "../hooks/useLogs";
import { Message } from "primereact/message";
import { ProgressSpinner } from "primereact/progressspinner";

export default function LogTable() {
  const [editEntry, setEditEntry] = useState<LogEntry>();
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const { data: session } = useSession({ required: true });
  const isAdmin = () => {
    return session?.user?.realmRoles?.includes("manager");
  };

  const { logEntries, addLog, updateLog, deleteLog, loading, error } =
    useLogs();

  const hideDialog = () => {
    if (!dialogVisible) return;
    setDialogVisible(false);
    setEditEntry(undefined);
  };

  const editBodyTemplate = (logEntry: LogEntry) => {
    return (
      <Button
        onClick={() => {
          setEditEntry(logEntry);
          setDialogVisible(true);
        }}
      >
        Bearbeiten
      </Button>
    );
  };

  const deleteBodyTemplate = (logEntry: LogEntry) => {
    return <Button onClick={() => deleteLog(logEntry.id)}>Löschen</Button>;
  };

  return (
    <div>
      {error && <Message severity="error" text={error} className="mb-3" />}
      {loading ? (
        <div className="flex justify-center">
          <ProgressSpinner />
        </div>
      ) : (
        <div>
          <Dialog onHide={hideDialog} visible={dialogVisible}>
            <AddLogForm
              onAdd={(entry) => {
                !editEntry ? addLog(entry) : updateLog(entry);
                hideDialog();
              }}
              editEntry={editEntry}
            />
          </Dialog>
          <DataTable
            value={logEntries}
            tableStyle={{ minWidth: "50rem" }}
            editMode="row"
          >
            <Column field="id" header="ID" sortable />
            <Column
              field="date"
              header="Erfassungsdatum"
              body={(rowData) =>
                new Date(rowData.date).toLocaleDateString("de-DE")
              }
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
            <Column field="age" header="Alter" sortable />
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
            <Column header="Bearbeiten" body={editBodyTemplate} />

            {isAdmin() && <Column header="Löschen" body={deleteBodyTemplate} />}
          </DataTable>

          <div className="m-3">
            <Button
              onClick={() => setDialogVisible(true)}
              visible={!dialogVisible}
            >
              Eintrag hinzufügen
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
