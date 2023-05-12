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

# COLLECTIONS

## to create collections run:

sh ./data/scripts/create-collections.sh

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

## ~~#1 - ER-DIAGRAM~~

## ~~#2 - docker file~~

## #3 - validation schema description

## ~~#4 - script that creates collections according to er-diagram~~

## ~~#5 - script that loads collection data~~

## #6 - ~~2 processes - adding new data, updating, deleting etc~~

## ~~#7 - 5 nontrivial queries~~

## #8 - script that tests out queries from #7

## ~~#9 - script that tests validation -> inserting invalid data~~

## ~~#10 - script that creates a database backup~~

## ~~#11 - script that deletes db~~

# misc

load script -> load("myjstest.js")
