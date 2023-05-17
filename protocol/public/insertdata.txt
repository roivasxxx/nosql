echo "DATA IMPORT STARTED"

echo "IMPORTING FACULTIES"
mongoimport --db=$DB_NAME --collection='faculties' --file='./data/scripts/mock_data/faculties.json' --jsonArray
echo "FINISHED FACULTIES IMPORT"
echo "------------------------"

echo "IMPORTING USERS"
mongoimport --db=$DB_NAME --collection='users' --file='./data/scripts/mock_data/users.json' --jsonArray
echo "FINISHED USERS IMPORT"
echo "------------------------"

echo "IMPORTING NOTIFICATIONS"
mongoimport --db=$DB_NAME --collection='notifications' --file='./data/scripts/mock_data/notifications.json' --jsonArray
echo "FINISHED NOTIFICATIONS IMPORT"
echo "------------------------"

echo "IMPORTING CONVERSATIONS"
mongoimport --db=$DB_NAME --collection='conversations' --file='./data/scripts/mock_data/conversations.json' --jsonArray
echo "FINISHED CONVERSATIONS IMPORT"
echo "------------------------"

echo "IMPORTING CONVERSATION_MESSAGES"
mongoimport --db=$DB_NAME --collection='conversation_messages' --file='./data/scripts/mock_data/msgs.json' --jsonArray
echo "FINISHED CONVERSATION_MESSAGES IMPORT"
echo "------------------------"

echo "IMPORTING COURSES"
mongoimport --db=$DB_NAME --collection='courses' --file='./data/scripts/mock_data/courses.json' --jsonArray
echo "FINISHED COURSES IMPORT"
echo "------------------------"

echo "IMPORTING THREADS"
mongoimport --db=$DB_NAME --collection='threads' --file='./data/scripts/mock_data/threads.json' --jsonArray
echo "FINISHED THREADS IMPORT"
echo "------------------------"

echo "IMPORTING POSTS"
mongoimport --db=$DB_NAME --collection='posts' --file='./data/scripts/mock_data/posts.json' --jsonArray
echo "FINISHED POSTS IMPORT"
echo "------------------------"
