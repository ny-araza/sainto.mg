# Étape 1 : compilation de l'application React + Vite
FROM node:26.12.1-alpine AS builder

WORKDIR /app

# Installation reproductible des dépendances
COPY package.json package-lock.json ./
RUN npm ci

# Copie du code source
COPY . .

# Le script du projet exécute tsc -b puis vite build
RUN npx vite build

# Étape 2 : serveur web Nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]