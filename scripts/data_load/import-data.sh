echo "DATA IMPORT STARTED"
echo "IMPORTING FACULTIES"
mongoimport --collection='testfacultiesS' --file='./data/scripts/mock_data/faculties.json' --jsonArray
echo "FINISHED FACULTIES IMPORT"