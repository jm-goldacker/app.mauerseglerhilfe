"use client";
import { useEffect, useState } from "react";
import { Circumstance } from "./types";
import apiRequest from "@/core/apiClient";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React from "react";

export default function Circumstances() {
  const [circumstances, setCircumstances] = useState<Circumstance[]>([]);
  const [newCircumstance, setNewCirumstance] = useState<string>("");

  const getCircumstances = async () => {
    const data = await apiRequest<Circumstance[]>("/api/Circumstances", "GET");
    setCircumstances(data);
  };

  useEffect(() => {
    getCircumstances();
  }, []);

  const deleteCircumstance = async (id: number) => {
    await apiRequest("/api/Circumstances/" + id, "DELETE");
    await getCircumstances();
  };

  const addCircumstance = async () => {
    await apiRequest<{ name: string }>("/api/Circumstances", "POST", {
      name: newCircumstance,
    });
    await getCircumstances();
  };

  return (
    <div className="m-3">
      <div className="grid grid-cols-2 auto-rows-max gap-4 place-items-center">
        {circumstances.map((circumstance) => {
          return (
            <React.Fragment key={circumstance.id}>
              <div>
                <div>{circumstance.name}</div>
              </div>
              <div>
                <Button
                  onClick={async () =>
                    await deleteCircumstance(circumstance.id)
                  }
                >
                  Löschen
                </Button>
              </div>
            </React.Fragment>
          );
        })}
        <div>
          <InputText
            value={newCircumstance}
            onChange={(e) => setNewCirumstance(e.target.value)}
          />
        </div>
        <div>
          <Button
            onClick={() => {
              addCircumstance();
            }}
          >
            Hinzufügen
          </Button>
        </div>
      </div>
    </div>
  );
}
