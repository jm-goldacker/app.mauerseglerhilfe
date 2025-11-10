import { handleLogout } from "@/lib/logout";
import NextAuth, {
  Account,
  AuthOptions,
  Profile,
  Session,
  User,
} from "next-auth";
import { JWT } from "next-auth/jwt";
import KeycloakProvider from "next-auth/providers/keycloak";

interface KeycloakAccount extends Account {
  access_token?: string;
}

interface KeycloakToken extends JWT {
  name?: string | null;
  realmRoles?: string[];
  resourceRoles?: Record<string, { roles: string[] }>;
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
  id_token?: string;
}

interface KeycloakSession extends Session {
  user?: {
    name?: string | null;
    realmRoles?: string[];
    resourceRoles?: Record<string, { roles: string[] }>;
  };
  token?: string;
  id_token?: string;
}

declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null;
      realmRoles?: string[];
      resourceRoles?: Record<string, { roles: string[] }>;
    };
    token?: string;
    id_token?: string;
  }

  interface User {
    name: string;
    realmRoles: string[];
    resourceRoles: Record<string, { roles: string[] }>;
  }

  interface JWT {
    name: string;
    realmRoles: string[];
    resourceRoles: Record<string, { roles: string[] }>;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({
      token,
      account,
    }: {
      token: KeycloakToken;
      user?: User;
      account?: KeycloakAccount | null;
      profile?: Profile;
      isNewUser?: boolean;
    }): Promise<KeycloakToken> {
      // Füge die Rollen aus dem JWT-Token zum token-Objekt hinzu
      if (account?.access_token) {
        const decodedToken = JSON.parse(
          Buffer.from(account.access_token.split(".")[1], "base64").toString(),
        );
        token.realmRoles = decodedToken.realm_access?.roles || [];
        token.resourceRoles = decodedToken.resource_access || {};
        token.access_token = account.access_token;
        token.expires_at = decodedToken.exp;
      }

      if (account?.refresh_token) {
        token.refresh_token = account.refresh_token;
      }

      if (account?.id_token) {
        token.id_token = account.id_token;
      }

      // Token-Refresh-Logik: Prüfe, ob das access_token abgelaufen ist
      const now = Math.floor(Date.now() / 1000);
      if (token.expires_at && now < token.expires_at) {
        // Token ist noch gültig
        return token;
      }

      // Token ist abgelaufen: Versuche, es zu refreshen
      if (token.refresh_token) {
        try {
          const response = await fetch(
            `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({
                client_id: process.env.KEYCLOAK_CLIENT_ID!,
                client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
                grant_type: "refresh_token",
                refresh_token: token.refresh_token,
              }),
            },
          );

          const refreshedTokens = await response.json();

          if (!response.ok) {
            throw refreshedTokens;
          }

          // Aktualisiere das access_token und refresh_token
          token.access_token = refreshedTokens.access_token;
          token.refresh_token =
            refreshedTokens.refresh_token || token.refresh_token;
          const decodedToken = JSON.parse(
            Buffer.from(
              refreshedTokens.access_token.split(".")[1],
              "base64",
            ).toString(),
          );
          token.expires_at = decodedToken.exp;
        } catch (error) {
          console.error("Fehler beim Token-Refresh:", error);
          token.expires_at = 0;
          if (token.id_token) handleLogout(token.id_token);
        }
      } else {
        // Kein refresh_token vorhanden: Token ist ungültig
        token.expires_at = 0;
        if (token.id_token) handleLogout(token.id_token);
      }

      return token;
    },
    async session({
      session,
      token,
    }: {
      session: KeycloakSession;
      token: KeycloakToken;
    }): Promise<KeycloakSession> {
      // Übertrage die Rollen in die Session
      session.user!.realmRoles = token.realmRoles;
      session.user!.resourceRoles = token.resourceRoles;
      session.user!.name = token.name;
      session.token = token.access_token;
      session.id_token = token.id_token;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
