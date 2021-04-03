# read.exchange

## 1. Docker guide

### 1.1 Prerequisites

- Install `docker`
- Install `docker-compose`

### 1.2 Local development

- Docker build

```bash
make init
```

- Start server

```bash
docker-compose up
# or
make dev
```

Then access localhost to check

- Backend: http://localhost:8081/
- Frontend: http://localhost:3000/
- ArangoDB: http://localhost:8529/

- Run command inside container

```bash
docker-compose exec backend bash
# or
docker-compose exec frontend bash
```

## 2. Deploy guide

Preparing...
