# Dockerfile para CapRover — Hell's Burger
#
# Tres etapas para que la imagen final pese lo mínimo: las dependencias de
# desarrollo y el código fuente se quedan en las etapas intermedias y nunca
# llegan al contenedor que corre en producción.
#
# Depende de `output: 'standalone'` en next.config.ts: eso hace que Next arme
# en `.next/standalone` un server con SOLO los node_modules que realmente usa.
# Sin esa opción habría que copiar los node_modules enteros.

# ---------------------------------------------------------------------------
# 1. deps — instala dependencias
# ---------------------------------------------------------------------------
FROM node:22-alpine AS deps
WORKDIR /app

# Solo los manifiestos: mientras no cambien, Docker reusa la capa cacheada y
# no vuelve a instalar en cada deploy.
COPY package.json package-lock.json ./

# `npm ci` y no `npm install`: instala exactamente lo del lockfile, sin
# resolver versiones nuevas. Un deploy tiene que dar siempre lo mismo.
RUN npm ci

# ---------------------------------------------------------------------------
# 2. builder — compila la web
# ---------------------------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Desactiva la telemetría de Next: no hace falta en un build de CI.
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# ---------------------------------------------------------------------------
# 3. runner — la imagen que queda corriendo
# ---------------------------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# CapRover enruta el tráfico al puerto 80 del contenedor por defecto.
ENV PORT=80
# Sin esto el server escucha solo en localhost y CapRover no puede alcanzarlo.
ENV HOSTNAME=0.0.0.0

# Usuario sin privilegios: si alguien logra ejecutar algo dentro del
# contenedor, no lo hace como root.
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# `public/` va aparte: el standalone no la incluye porque son archivos
# estáticos que el server sirve tal cual (logo, fotos, fondos).
COPY --from=builder /app/public ./public

# El server autocontenido y los assets con hash. `--chown` en el COPY y no un
# `chown -R` después: hacerlo después duplicaría todos los archivos en una
# capa nueva y engordaría la imagen.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 80

CMD ["node", "server.js"]
