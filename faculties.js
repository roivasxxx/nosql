db = connect(
  "mongodb://root:password@127.0.0.1:27017/test?replicaSet=replSet&authSource=admin&directConnection=true"
);

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
