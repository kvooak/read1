# read.exchange

## 1. Docker guide

### 1.1 Prerequisites

- Install `docker`
- Install `docker-compose`

### 1.2 Local development

- Docker build

```bash
docker-compose build
```

- Start server

```bash
docker-compose up
```

Then access http://localhost:8081/ or http://localhost:3000/ to check backend and frontend

- Run command inside container

```bash
docker-compose exec backend bash
# or
docker-compose exec frontend bash
```

## 2. Deploy guide

Preparing...
