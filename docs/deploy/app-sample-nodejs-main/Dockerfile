# syntax=hub.reg.navercorp.com/docker/dockerfile:1.2
## Build
FROM hub.reg.navercorp.com/library/node:slim as builder

WORKDIR /home1/irteam/sample
COPY package.json package-lock.json app.js ./
# uid=500(irteam), gid=500(irteam) 
RUN --mount=type=cache,target=/home1/irteam/sample/.npm,id=nodejs-sample-cache,uid=500,gid=500 \
    npm set cache /home1/irteam/sample/.npm && \
    npm config set registry https://artifactory.navercorp.com/artifactory/npm-remote/ && \
    npm ci

## Deploy
FROM reg.navercorp.com/base/alpine:3.15

WORKDIR /

USER root
RUN apk update && apk upgrade --no-cache && apk add nodejs && apk add ca-certificates libcap && rm -rf /var/cache/apk/*
RUN mkdir /lib64 && ln -s /lib/libc.musl-x86_64.so.1 /lib64/ld-linux-x86-64.so.2
RUN /usr/sbin/setcap 'cap_net_bind_service=+ep' `readlink -f \`which node\``
COPY --from=builder /home1/irteam/sample /
EXPOSE 80

USER irteam
CMD ["node", "./app.js"]
