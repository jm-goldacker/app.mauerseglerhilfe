FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh
# CRLF -> LF normalisieren (Builds von Windows-Checkouts), sonst startet das Skript nicht
RUN sed -i 's/\r$//' /docker-entrypoint.sh /etc/nginx/conf.d/default.conf && chmod +x /docker-entrypoint.sh
EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
