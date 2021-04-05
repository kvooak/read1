init:
	- docker-compose build
	- docker-compose up --no-start
	- docker-compose start
	- ./docker/frontend/wait-for-it.sh localhost:8529
	- sleep 10
	- docker-compose exec arangodb sh -c "echo 'db._createDatabase(\"read1\");' | arangosh --server.authentication false"
	- docker-compose stop
dev:
	- docker-compose up
flush:
	- docker-compose down
