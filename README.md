# Mauerseglerhilfe – Bestandsbuch (Frontend)

Web-App der Mauerseglerhilfe zur Führung des Bestandsbuchs: Erfassung von
Vogelfunden (inkl. Ringnummer, Fundumständen, Pflegestelle, Verbleib),
Fahrtenbuch, Statistik und Pflege der Stammdaten (Vogelarten, Fundumstände,
Leistungsarten, Verbleib, Pflegestellen, Vermittler).

Das zugehörige Backend liegt im Repository `api.mauerseglerhilfe`
(ASP.NET Core + PostgreSQL); die Anmeldung läuft über Keycloak.

## Technik

- React 19 + TypeScript + Vite, TanStack Query, Tailwind CSS
- Auth: `keycloak-js` (Login-Redirect, Rolle `manager` für Lösch-/Stammdatenrechte)
- Auslieferung als nginx-Container; optional Electron-Desktop-Build

## Entwicklung

```bash
npm ci
npm run dev        # Vite-Dev-Server auf http://localhost:5173
npm run lint       # ESLint
npm run build      # Typecheck + Produktions-Build
```

Für die lokale Entwicklung müssen API und Keycloak laufen (siehe
`docker-compose.dev.yml` bzw. das Compose-Setup im API-Repository).

## Konfiguration

Die App liest ihre Konfiguration **zur Laufzeit** aus `window.__ENV__`
(`/env.js`), das der Docker-Entrypoint beim Containerstart aus folgenden
Umgebungsvariablen erzeugt:

| Variable | Bedeutung |
|---|---|
| `API_URL` | Basis-URL der API, z. B. `https://api.example.org/api` |
| `KEYCLOAK_URL` | Keycloak-Basis-URL, z. B. `https://auth.example.org/auth` |
| `KEYCLOAK_REALM` | Realm (Standard: `master`) |
| `KEYCLOAK_CLIENT_ID` | Client-ID (Standard: `mauerseglerhilfe-app`) |

Die Content-Security-Policy (`connect-src`) wird beim Containerstart aus
`API_URL`/`KEYCLOAK_URL` abgeleitet. Im Vite-Dev-Modus greifen stattdessen
die `VITE_*`-Varianten der Variablen.

## Deployment

Das vollständige Produktions-Setup (Docker Compose mit App, API, Keycloak,
PostgreSQL, Reverse-Proxy und SSL) ist in [INSTALLATION.md](INSTALLATION.md)
beschrieben. Kurzfassung für Updates:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml pull
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d
```

> Wichtig: `--env-file .env.prod` nicht weglassen – Compose lädt nur `.env`
> automatisch; ohne die Datei starten API/Keycloak mit leeren Zugangsdaten.

Datenbank-Migrationen wendet die API beim Start automatisch an.

### Images bauen und veröffentlichen

Der Server läuft auf **amd64**. Beim Bauen auf einem ARM-Rechner (z. B.
Apple Silicon, Windows on ARM) muss die Zielplattform explizit angegeben
werden, sonst entstehen arm64-Images, die auf dem Server mit
`exec format error` abbrechen:

```bash
# API (im Repo api.mauerseglerhilfe)
docker build --platform linux/amd64 -f api.mauerseglerhilfe/Dockerfile \
  -t mgoldacker/api-mauerseglerhilfe:latest -t mgoldacker/api-mauerseglerhilfe:$(date +%F) .

# App (in diesem Repo)
docker build --platform linux/amd64 \
  -t mgoldacker/mauerseglerhilfe-app:latest -t mgoldacker/mauerseglerhilfe-app:$(date +%F) .

docker push --all-tags mgoldacker/api-mauerseglerhilfe
docker push --all-tags mgoldacker/mauerseglerhilfe-app
```

Die Build-Stages laufen dank `--platform=$BUILDPLATFORM` nativ auf dem
Build-Rechner (schnell, ohne Emulation); nur das Laufzeit-Image wird für
amd64 erzeugt.
