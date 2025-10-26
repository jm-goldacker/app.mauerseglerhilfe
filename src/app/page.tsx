"use client";

import Circumstances from "@/components/Circumstances";
import LogTable from "@/components/LogTable";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React from "react";
import { useState } from "react";

export default function Home() {
  const [circumstancesDialogVisible, setCircumstancesDialogVisible] =
    useState<boolean>(false);
  return (
    <main>
      <Dialog
        onHide={() => setCircumstancesDialogVisible(false)}
        visible={circumstancesDialogVisible}
      >
        <Circumstances />
      </Dialog>
      <LogTable />

      <div className="m-3">
        <Button
          onClick={() => setCircumstancesDialogVisible(true)}
          visible={!circumstancesDialogVisible}
        >
          Fundumstände bearbeiten
        </Button>
      </div>
    </main>
  );
}
