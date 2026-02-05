ARG BASE_IMAGE="node:22.17.0-alpine"
FROM ${BASE_IMAGE} AS base
WORKDIR /app

# Install dependencies in a separate layer for caching.
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci && npm cache clean --force

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
ARG N3R_BUILD_COMMIT_HASH=""
ARG N3R_BUILD_COMMIT_REFERENCE=""
ARG N3R_BUILD_NUMBER=""

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1
ENV N3R_BUILD_COMMIT_HASH=$N3R_BUILD_COMMIT_HASH
ENV N3R_BUILD_COMMIT_REFERENCE=$N3R_BUILD_COMMIT_REFERENCE
ENV N3R_BUILD_NUMBER=$N3R_BUILD_NUMBER

# Run as non-root for better security.
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN chown -R nextjs:nodejs /app

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]

