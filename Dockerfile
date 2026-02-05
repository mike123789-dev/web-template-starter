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
# `public/` 폴더는 Next.js에서 선택 사항이라 레포에 없을 수 있습니다.
# n3r 빌드에서 `COPY --from=builder ... /public` 단계가 실패하지 않도록 항상 디렉토리를 만들어 둡니다.
RUN mkdir -p public && npm run build

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
ENV TINI_SUBREAPER=1

ENV N3R_BUILD_COMMIT_HASH=$N3R_BUILD_COMMIT_HASH
ENV N3R_BUILD_COMMIT_REFERENCE=$N3R_BUILD_COMMIT_REFERENCE
ENV N3R_BUILD_NUMBER=$N3R_BUILD_NUMBER

USER root
RUN apt-get update && \
    apt-get install -y --no-install-recommends ca-certificates libcap2-bin tini && \
    rm -rf /var/lib/apt/lists/* && \
    (getent group 500 >/dev/null || groupadd --gid 500 irteam) && \
    (getent passwd 500 >/dev/null || useradd --uid 500 --gid 500 --create-home --home-dir /home1/irteam irteam) && \
    setcap 'cap_net_bind_service=+ep' "$(readlink -f "$(which node)")"

COPY --from=builder --chown=500:500 /home1/irteam/sample/public ./public
COPY --from=builder --chown=500:500 /home1/irteam/sample/.next/standalone ./
COPY --from=builder --chown=500:500 /home1/irteam/sample/.next/static ./.next/static

EXPOSE 80
USER irteam

ENTRYPOINT ["tini", "-s", "--"]
CMD ["node", "./server.js"]

