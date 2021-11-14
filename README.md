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

### 2.1 Setup ArangoDB

- Install `arangodb-cli`

For Windows:
```
https://www.arangodb.com/docs/stable/installation-windows.html
```

For Linux:
```
https://www.arangodb.com/docs/stable/installation-linux.html
```

Create database & collections
- Login to `http://localhost:8529` for ArangoDB web interface with credentials:
```
username: root
password:
```

- Select `Select DB:_system`
- Create a new database named `read1` then switch to this database
- Create two collections in `read1`:
```
blocks
documents
```

- In collection `documents` create the first document with the following information:
```
{
  _key: 'test_doc',
  type: 'document',
  properties: {
    title: 'First document',
  },
  content: [],
  parent: null,
}
```

