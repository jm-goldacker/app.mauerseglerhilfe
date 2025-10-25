import NextAuth, { AuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
  callbacks: {
    async jwt({ token, account }: any) {
      // Füge die Rollen aus dem JWT-Token zum token-Objekt hinzu
      if (account?.access_token) {
        const decodedToken = JSON.parse(
          Buffer.from(account.access_token.split(".")[1], "base64").toString(),
        );
        token.realmRoles = decodedToken.realm_access?.roles || [];
        token.resourceRoles = decodedToken.resource_access || {};
      }
      return token;
    },
    async session({ session, token }: any) {
      // Übertrage die Rollen in die Session
      session.user.realmRoles = token.realmRoles;
      session.user.resourceRoles = token.resourceRoles;
      session.user.name = token.name;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      realmRoles: string[];
      resourceRoles: Record<string, { roles: string[] }>;
    };
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
