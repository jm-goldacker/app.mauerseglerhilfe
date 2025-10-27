# Stage 1: Build der Next.js App
FROM node:18-alpine AS builder

# Arbeitsverzeichnis setzen
WORKDIR /app

# Abhängigkeiten kopieren und installieren
COPY package.json yarn.lock* package-lock.json* ./
RUN npm install

# Quellcode kopieren
COPY . .

# App bauen
RUN npm run build

# Stage 2: Produktion
FROM node:18-alpine AS runner

WORKDIR /app

# Abhängigkeiten für die Produktion installieren
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
RUN npm install --omit=dev

# Build-Output kopieren
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Umgebungsvariablen setzen (falls benötigt)
# ENV NODE_ENV production

# Port freigeben
EXPOSE 3000

# App starten
CMD ["npm", "start"]