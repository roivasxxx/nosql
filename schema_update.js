// example cmd for updating existing collection schema

// db.runCommand({
//   collMod: "faculties",
//   validator: {
//     $jsonSchema: {
//       bsonType: "object",
//       required: ["name", "shortcut"],
//       properties: {
//         name: {
//           bsonType: "string",
//           minLength: 0,
//           description: "Faculty name"
//         },
//         shortcut: {
//           bsonType: "string",
//           minLength: 0,
//           description: "Faculty name shorcut"
//         }
//       }
//     }
//   }
// });

// db.runCommand({
//   collMod: "users",
//   validator: {
//     $jsonSchema: {
//       bsonType: "object",
//       required: ["email", "salt", "password", "nickname", "created_at"],
//       properties: {
//         email: {
//           bsonType: "string",
//           minLength: 0,
//           maxLength: 96,
//           pattern: "^.+@.+$",
//           description: "User email"
//         },
//         salt: {
//           bsonType: "string",
//           minLength: 0,
//           description: "Salt for password"
//         },
//         password: {
//           bsonType: "string",
//           minLength: 0,
//           description: "User password - hashed"
//         },
//         created_at: {
//           bsonType: "date",
//           description: "Timestamp of user creation"
//         },
//         last_login: {
//           bsonType: "date",
//           description: "Timestamp of last login"
//         },
//         available_login_attemps: {
//           bsonType: "number",
//           minimum: 0,
//           maximum: 10,
//           description: "Available login attemps"
//         }
//       }
//     }
//   }
// });

db.runCommand({
  collMod: "threads",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["course_id", "title", "author"],
      properties: {
        faculty_id: {
          bsonType: "objectId",
          description: "ObjectId of an object from courses collection"
        },
        author: {
          bsonType: ["string", "objectId"],
          description:
            "If typeof author is string -> made by admin, otherwise made by regular user"
        },
        title: {
          bsonType: "string",
          minLength: 0,
          description: "Thread title"
        },
        last_post: {
          bsonType: "objectId",
          description: "ObjectId of the most recent post in thread"
        },
        post_count: {
          bsonType: "int",
          minimum: 0,
          description: "Count of all thread posts"
        }
      }
    }
  }
});
