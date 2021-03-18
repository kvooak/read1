#!/bin/bash
docker build -f ./deployment/Dockerfile --pull -t dokku/read.exchange:latest .
docker save dokku/read.exchange:latest | ssh read.exchange "docker load | dokku tags:deploy read.exchange latest"
