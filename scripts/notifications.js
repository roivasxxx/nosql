load("./data/scripts/auth.js");

db.createCollection("notifications", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user", "title","message","created_at","read"],
      properties: {
        title: {
          bsonType: "string",
          minLength: 1,
          description: "Title of notification"
        },
        message: {
          bsonType: "string",
          minLength: 1,
          description: "Notification message - content of notification"
        },
        created_at:{
            bsonType:"date",
            description:"Date of notification creation"
        },
        user: {
            bsonType:"objectId",
            description:"Id of user whom should be notified",
        },
        read:{
            bsonType:"bool",
            description:"Boolean value that indicates whether notification has been read or not"
        }
      }
    }
  }
});