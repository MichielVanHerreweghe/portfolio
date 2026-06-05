# syntax=docker/dockerfile:1

FROM node:22-alpine AS build

ENV NODE_ENV=production

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --include=dev

COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.30-alpine AS runtime

# nginx.conf is an envsubst template: the image entrypoint renders it to
# /etc/nginx/conf.d/default.conf at start, substituting ${BACKEND_UPSTREAM}.
# Default upstream targets a "portfolio" release; the Helm chart overrides it
# with the actual backend Service via the BACKEND_UPSTREAM env var.
# NOTE: under a read-only root filesystem, mount a writable emptyDir at
# /etc/nginx/conf.d so the entrypoint can write the rendered config (the chart
# does this by default).
ENV BACKEND_UPSTREAM=portfolio-backend:80

# The /api proxy uses ${NGINX_LOCAL_RESOLVERS} in nginx.conf to resolve the
# backend at request time. The image's 15-local-resolvers.envsh only populates
# that var when NGINX_ENTRYPOINT_LOCAL_RESOLVERS is set; without it the var is
# empty and nginx fails to start ("host not found in resolver").
ENV NGINX_ENTRYPOINT_LOCAL_RESOLVERS=1

COPY --chown=nginx:nginx nginx.conf /etc/nginx/templates/default.conf.template

COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html

USER nginx

EXPOSE 8080