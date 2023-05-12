echo "CREATING COLLECTIONS"
mongosh --username root --password password --authenticationDatabase admin ./data/scripts/create-collections.js
echo "COLLECTIONS CREATED"