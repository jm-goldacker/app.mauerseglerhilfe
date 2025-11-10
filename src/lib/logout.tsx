import { signOut, useSession } from "next-auth/react";

const session = useSession();

export const handleLogout = async () => {
  const keycloakLogoutUrl = `${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/logout`;
  const idTokenHint = session.data?.id_token ?? "";

  const logoutParams = new URLSearchParams({
    id_token_hint: idTokenHint,
    post_logout_redirect_uri: `${window.location.origin}/`, // Zurück zur Startseite
  });

  await signOut({ redirect: false }); // Beende nur die lokale Session
  window.location.href = `${keycloakLogoutUrl}?${logoutParams.toString()}`;
};
