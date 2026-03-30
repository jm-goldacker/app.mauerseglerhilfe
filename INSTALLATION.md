# Installationsanleitung – Mauerseglerhilfe auf dem Server

## Voraussetzungen

- Linux-Server (Ubuntu 22.04 empfohlen)
- Docker und Docker Compose installiert
- Nginx installiert (als Reverse Proxy auf dem Host)
- Certbot installiert (für Let's Encrypt SSL-Zertifikate)
- DNS-Einträge für alle drei Subdomains zeigen auf die Server-IP:
  - `mauersegler.goldacker-it-solutions.de`
  - `api.mauersegler.goldacker-it-solutions.de`
  - `auth.mauersegler.goldacker-it-solutions.de`

---

## Schritt 1: SSL-Zertifikate ausstellen

```bash
sudo certbot certonly --nginx \
  -d mauersegler.goldacker-it-solutions.de \
  -d api.mauersegler.goldacker-it-solutions.de \
  -d auth.mauersegler.goldacker-it-solutions.de
```

> Falls noch kein Nginx-Vhost existiert: `--standalone` statt `--nginx` verwenden und Port 80 muss frei sein.

---

## Schritt 2: Nginx-Reverse-Proxy konfigurieren

Configs aus dem Repo-Ordner `nginx-proxy/` in den Nginx-Konfigurationsordner kopieren:

```bash
sudo cp nginx-proxy/*.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/mauersegler.goldacker-it-solutions.de.conf /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/api.mauersegler.goldacker-it-solutions.de.conf /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/auth.mauersegler.goldacker-it-solutions.de.conf /etc/nginx/sites-enabled/

sudo nginx -t && sudo systemctl reload nginx
```

---

## Schritt 3: Projektdateien auf den Server laden

```bash
# Repository klonen oder nur die nötige Datei herunterladen
git clone https://github.com/jm-goldacker/app.mauerseglerhilfe.git
cd app.mauerseglerhilfe
```

---

## Schritt 4: Umgebungsvariablen konfigurieren

`.env`-Datei aus dem Beispiel erstellen und Passwörter setzen:

```bash
cp .env.prod.example .env.prod
nano .env.prod
```

Inhalt von `.env.prod` befüllen:

```env
DB_USER=mauerseglerhilfe
DB_PASSWORD=<sicheres_passwort>

KEYCLOAK_DB_PASSWORD=<sicheres_passwort>
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=<sicheres_passwort>
```

> Passwörter können z. B. mit `openssl rand -base64 32` generiert werden.

---

## Schritt 5: Docker-Container starten

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

Beim ersten Start:
- Die Datenbank-Container starten zuerst
- Die API führt automatisch alle Datenbankmigrationen aus
- Danach starten Keycloak, API und App

Status prüfen:

```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f
```

---

## Schritt 6: Keycloak einrichten

1. Keycloak-Admin-Oberfläche öffnen: `https://auth.mauersegler.goldacker-it-solutions.de/auth`
2. Mit den Admin-Zugangsdaten aus `.env.prod` einloggen
3. **Realm** prüfen: Standard ist `master`
4. **Client** anlegen:
   - Client-ID: `mauerseglerhilfe-app`
   - Client-Typ: `OpenID Connect`
   - Valid Redirect URIs: `https://mauersegler.goldacker-it-solutions.de/*`
   - Web Origins: `https://mauersegler.goldacker-it-solutions.de`
5. **Realm Role** anlegen: `manager`
6. Benutzer anlegen und die Rolle `manager` zuweisen

---

## Schritt 7: Funktionstest

| URL | Erwartetes Ergebnis |
|-----|---------------------|
| `https://mauersegler.goldacker-it-solutions.de` | App lädt, Weiterleitung zum Keycloak-Login |
| `https://api.mauersegler.goldacker-it-solutions.de/swagger` | Swagger UI der API |
| `https://auth.mauersegler.goldacker-it-solutions.de/auth` | Keycloak-Adminoberfläche |

---

## Updates einspielen

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod pull
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

Die API führt Datenbankmigrationen automatisch beim Start aus.

---

## Dienste stoppen

```bash
docker compose -f docker-compose.prod.yml down
```

> Daten bleiben in den Docker-Volumes `postgres_data` und `postgres_keycloak_data` erhalten.

---

## Datensicherung

```bash
# App-Datenbank sichern
docker exec $(docker compose -f docker-compose.prod.yml ps -q postgres) \
  pg_dump -U mauerseglerhilfe mauerseglerhilfe > backup_$(date +%Y%m%d).sql

# Keycloak-Datenbank sichern
docker exec $(docker compose -f docker-compose.prod.yml ps -q postgres-keycloak) \
  pg_dump -U keycloak keycloak > backup_keycloak_$(date +%Y%m%d).sql
```
