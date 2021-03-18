FROM node:14-alpine AS build-frontend-env

RUN echo http://dl-2.alpinelinux.org/alpine/edge/community/ >> /etc/apk/repositories

# ARG BUILD_PACKAGES="build-base curl-dev git"
# ARG DEV_PACKAGES="bash"
# RUN apk add --update \
#     $BUILD_PACKAGES \
#     $DEV_PACKAGES

RUN npm install -g npm@7.6.3

ARG APP_ROOT=/app
RUN mkdir -p $APP_ROOT
WORKDIR $APP_ROOT

COPY ./frontend/package.json $APP_ROOT/
COPY ./frontend/package-lock.json $APP_ROOT/

RUN npm install

COPY ./frontend $APP_ROOT

RUN npm run build

################ Build step done ################

FROM nginx:1.19-alpine AS main-env

# ENV NGINX_PORT 5000
ENV LANG C.UTF-8
ENV TZ=Europe/Berlin
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ARG APP_ROOT=/app
RUN mkdir -p $APP_ROOT
WORKDIR $APP_ROOT

COPY --from=build-frontend-env /app/build/ /usr/share/nginx/html
