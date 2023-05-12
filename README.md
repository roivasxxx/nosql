# nosql school course

## run with

docker-compose up -d
docker exec -it mongodb bash
~~docker cp faculties.js mongodb:/tmp~~

## to use mongosh run:

mongosh --username root --password password --authenticationDatabase admin

## mongo-express

mongo-express available at http://localhost:8081

# LOADING JS SCRIPTS

mongosh --username root --password password --authenticationDatabase admin ./tmp/faculties.js

# VALIDATION

## bellow command needs to be run in mongosh -> docker restarted in order to get detailed validation errors

db.adminCommand( { setFeatureCompatibilityVersion: "5.0" } )

# DATA IMPORT

## to import data run:

bash ./data/scripts/import-data.sh

# BACKUP

## backup should be available in docker at ./BACKUP/

## to create a backup run:

sh ./data/scripts/create-backup.sh

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
