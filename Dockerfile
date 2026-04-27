# Base stage con dependencias comunes
FROM node:22-slim AS base
WORKDIR /app
COPY package*.json .npmrc ./

# Stage de Desarrollo
FROM base AS development
ENV NODE_ENV=development
RUN npm install
COPY . .
COPY .env.development .env
EXPOSE 3220
CMD ["npm", "run", "start:dev"]

# Stage de builder para producción
FROM base AS builder
ENV NODE_ENV=production
RUN npm install --omit=optional
COPY tsconfig.json ./
COPY src ./src
COPY .env.production .env
RUN rm -rf build
RUN npm run build

# Stage final de producción
FROM node:22-slim AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env ./.env.production
EXPOSE 8220
CMD ["node", "build/main.js"]