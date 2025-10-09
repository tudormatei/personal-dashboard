# ---------- Base stage ----------
FROM node:22 AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# ---------- Development stage ----------
FROM base AS dev
COPY . .
CMD ["npm", "run", "dev", "--", "--host"]

# ---------- Production build stage ----------
FROM base AS prod
COPY . .
RUN npm run build
VOLUME /app/dist
