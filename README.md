# nosql school course

run with

docker-compose up -d

docker cp faculties.js mongodb:/tmp
docker exec -it mongodb bash

mongosh --username root --password password --authenticationDatabase admin

# to load file

mongosh --username root --password password --authenticationDatabase admin ./tmp/faculties.js

mongo-express available at http://localhost:8081

## ~~#1 - ER-DIAGRAM DONE~~

## ~~#2 - docker file DONE~~

## #3 - validation schema description

## #4 - 2 processes - adding new data, updating, deleting etc

## #5 - 5 nontrivial queries

## #6 - script to load schemas

## #7 - script to load dataset

## #8 - script that tests out queries from #5

## #9 - script that tests validation -> inserting invalid data

## #10 - replication?

## #11 - script that creates a database backup

## #12 - script that delete all data

# misc

load script -> load("myjstest.js")
