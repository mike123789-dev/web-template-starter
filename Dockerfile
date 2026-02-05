# syntax=hub.reg.navercorp.com/docker/dockerfile:1.2

ARG NODE_IMAGE="hub.reg.navercorp.com/library/node:slim"
ARG NPM_REGISTRY="https://artifactory.navercorp.com/artifactory/npm-remote/"

## Build
FROM ${NODE_IMAGE} AS builder

WORKDIR /home1/irteam/sample

COPY package.json package-lock.json ./

# uid=500(irteam), gid=500(irteam)
RUN --mount=type=cache,target=/home1/irteam/sample/.npm,id=web-template-npm-cache,uid=500,gid=500 \
    npm set cache /home1/irteam/sample/.npm && \
    npm config set registry ${NPM_REGISTRY} && \
    npm ci

COPY . .
RUN npm run build

## Deploy
FROM ${NODE_IMAGE} AS runner

WORKDIR /

ARG N3R_BUILD_COMMIT_HASH=""
ARG N3R_BUILD_COMMIT_REFERENCE=""
ARG N3R_BUILD_NUMBER=""

ENV NODE_ENV=production
ENV PORT=80
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

ENV N3R_BUILD_COMMIT_HASH=$N3R_BUILD_COMMIT_HASH
ENV N3R_BUILD_COMMIT_REFERENCE=$N3R_BUILD_COMMIT_REFERENCE
ENV N3R_BUILD_NUMBER=$N3R_BUILD_NUMBER

USER root
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y --no-install-recommends ca-certificates libcap2-bin && \
    rm -rf /var/lib/apt/lists/* && \
    groupadd --gid 500 irteam && \
    useradd --uid 500 --gid 500 --create-home --home-dir /home1/irteam irteam && \
    setcap 'cap_net_bind_service=+ep' "$(readlink -f "$(which node)")"

COPY --from=builder /home1/irteam/sample/public ./public
COPY --from=builder /home1/irteam/sample/.next/standalone ./
COPY --from=builder /home1/irteam/sample/.next/static ./.next/static

RUN chown -R irteam:irteam /public /.next /server.js /node_modules /package.json

EXPOSE 80
USER irteam

CMD ["node", "./server.js"]

