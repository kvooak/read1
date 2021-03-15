#!/bin/bash

# Exit on fail
set -e

# npm install
npm install

# Waiting for dependent containers
/wait-for-it.sh db:5432 -t 300

# Migrate

# Start services
npm start

# Finally call command issued to the docker service
exec "$@"
