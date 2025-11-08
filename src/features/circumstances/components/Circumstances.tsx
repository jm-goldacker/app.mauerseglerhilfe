"use client";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React from "react";
import { useCircumstances } from "../hooks/useCircumstances";
import { Message } from "primereact/message";
import { ProgressSpinner } from "primereact/progressspinner";

export default function Circumstances() {
  const {
    circumstances,
    newCircumstance,
    setNewCircumstance,
    deleteCircumstance,
    addCircumstance,
    loading,
    error,
  } = useCircumstances();

  return (
    <div className="m-3">
      {error && <Message severity="error" text={error} className="mb-3" />}
      {loading ? (
        <div className="flex justify-center">
          <ProgressSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-2 auto-rows-max gap-4 place-items-center">
          {circumstances.map((circumstance) => (
            <React.Fragment key={circumstance.id}>
              <div>{circumstance.name}</div>
              <div>
                <Button
                  onClick={() => deleteCircumstance(circumstance.id)}
                  disabled={loading}
                >
                  Löschen
                </Button>
              </div>
            </React.Fragment>
          ))}
          <div>
            <InputText
              value={newCircumstance}
              onChange={(e) => setNewCircumstance(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <Button onClick={addCircumstance} disabled={loading}>
              Hinzufügen
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
