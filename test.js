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

db.createCollection("courses", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["faculty_id", "name", "shortcut", "thread_count"],
      properties: {
        faculty_id: {
          bsonType: "objectId",
          description: "ObjectId of an object from faculties collection"
        },
        name: {
          bsonType: "string",
          minLength: 0,
          description: "Name of course - ex. Základy matematiky 1"
        },
        shortcut: {
          bsonType: "string",
          minLength: 0,
          description: "Shortcut of course - ex. ZMAT1"
        },
        thread_count: {
          bsonType: "int",
          minimum: 0,
          description: "Count of all course threads"
        }
      }
    }
  }
});

db.createCollection("threads", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["course_id", "title"],
      properties: {
        faculty_id: {
          bsonType: "objectId",
          description: "ObjectId of an object from courses collection"
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

db.createCollection("posts", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["author_id", "thread_id", "created_at", "text"],
      properties: {
        author_id: {
          bsonType: "objectId",
          description: "ObjectId of post author - taken from users collection"
        },
        thread_id: {
          bsonType: "objectId",
          description: "ObjectId of thread"
        },
        text: {
          bsonType: "string",
          minLength: 0,
          description: "Post text data - the actual content of the post"
        },
        created_at: {
          bsonType: "timestamp",
          description: "Timestamp of post creation"
        },
        updated_at: {
          bsonType: "timestamp",
          description: "Timestamp of last update"
        },
        replying_to: {
          bsonType: "array",
          items: {
            bsonType: "objectId",
            description: "Post objectId"
          },
          uniqueItems: true,
          description: "Array of post ids - responses to previous posts"
        }
      }
    }
  }
});

db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "salt", "password", "nickname", "created_at"],
      properties: {
        email: {
          bsonType: "string",
          minLength: 0,
          maxLength: 96,
          pattern: "^.+@.+$",
          description: "User email"
        },
        salt: {
          bsonType: "string",
          minLength: 0,
          description: "Salt for password"
        },
        password: {
          bsonType: "string",
          minLength: 0,
          description: "User password - hashed"
        },
        created_at: {
          bsonType: "date",
          description: "Timestamp of user creation"
        },
        last_login: {
          bsonType: "date",
          description: "Timestamp of last login"
        },
        available_login_attemps: {
          bsonType: "number",
          minimum: 0,
          maximum: 10,
          description: "Available login attemps"
        }
      }
    }
  }
});
