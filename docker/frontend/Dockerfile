FROM node:14-alpine

ENV LANG C.UTF-8
ENV TZ=Asia/Ho_Chi_Minh
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN echo http://dl-2.alpinelinux.org/alpine/edge/community/ >> /etc/apk/repositories

ARG BUILD_PACKAGES="build-base curl-dev git"
ARG DEV_PACKAGES="bash"
RUN apk add --update \
    $BUILD_PACKAGES \
    $DEV_PACKAGES

RUN npm install -g npm@7.6.3

COPY ./docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

COPY ./wait-for-it.sh /
RUN chmod +x /wait-for-it.sh

WORKDIR /app
