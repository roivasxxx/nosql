load("./data/scripts/auth.js");

db.createCollection("faculties", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "shortcut"],
      properties: {
        name: {
          bsonType: "string",
          minLength: 0,
          description: "Faculty name"
        },
        shortcut: {
          bsonType: "string",
          minLength: 0,
          description: "Faculty name shorcut"
        }
      }
    }
  }
});
