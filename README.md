# nosql school course

run with

docker-compose up -d

docker cp faculties.js mongodb:/tmp
docker exec -it mongodb bash

    mongosh --username root --password password --authenticationDatabase admin


# validation errors
bellow command needs to be run in mongosh -> docker restarted in order to get detailed validation errors
db.adminCommand( { setFeatureCompatibilityVersion: "5.0" } )


# to load file

mongosh --username root --password password --authenticationDatabase admin ./tmp/faculties.js

mongo-express available at http://localhost:8081

# to import data run:

bash ./data/scripts/import-data.sh

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
