# ---------- build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json prisma ./
RUN npm install
RUN npx prisma generate

COPY . .
RUN npm run build

# ---------- runtime stage ----------
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma

EXPOSE 3000
CMD ["node", "dist/main"]
