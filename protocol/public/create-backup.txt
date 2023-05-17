# sh ./data/scripts/create-backup.sh
echo "STARTING BACKUP"
mongodump --db krajta-clone -o ./backup/
echo "FINISHED BACKING UP, BACKED UP DATA AVAILABLE IN DOCKER FILES AT ./BACKUP/"