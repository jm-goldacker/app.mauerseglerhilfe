"use client";

import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import LogTable from "@/features/logs/components/LogTable";
import Circumstances from "@/features/circumstances/components/Circumstances";
import { handleLogout } from "@/lib/logout";

export default function Home() {
  const [circumstancesDialogVisible, setCircumstancesDialogVisible] =
    useState<boolean>(false);

  const session = useSession();

  return (
    <main>
      <div>
        Willkommen {session.data?.user?.name}
        <Button className="m-3" onClick={handleLogout}>
          Logout
        </Button>
      </div>

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
