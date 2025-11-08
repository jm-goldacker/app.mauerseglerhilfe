"use client";

import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React from "react";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import LogTable from "@/features/logs/components/LogTable";
import Circumstances from "@/features/circumstances/components/Circumstances";

export default function Home() {
  const [circumstancesDialogVisible, setCircumstancesDialogVisible] =
    useState<boolean>(false);

  const session = useSession();

  const handleLogout = async () => {
    const keycloakLogoutUrl = `${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/logout`;
    const idTokenHint = session.data?.id_token ?? "";

    const logoutParams = new URLSearchParams({
      id_token_hint: idTokenHint,
      post_logout_redirect_uri: `${window.location.origin}/`, // Zurück zur Startseite
    });

    console.log(`${keycloakLogoutUrl}?${logoutParams.toString()}`);

    await signOut({ redirect: false }); // Beende nur die lokale Session
    window.location.href = `${keycloakLogoutUrl}?${logoutParams.toString()}`;
  };

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
