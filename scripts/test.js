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
        },
        notifications: {
          bsonType: "array",
          items: {
            bsonType: "objectId",
            description: "User objectId"
          },
          uniqueItems: true,
          description: "Array of user ids - notifications"
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
          bsonType: "date",
          description: "Date of post creation"
        },
        updated_at: {
          bsonType: "date",
          description: "Date of last update"
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
          description: "Date of user creation"
        },
        last_login: {
          bsonType: "date",
          description: "Date of last login"
        },
        available_login_attemps: {
          bsonType: "number",
          minimum: 0,
          maximum: 10,
          description: "Available login attemps"
        },
        allow_message_notifications: {
          bsonType: "bool",
          description:
            "Flag that says whether user wants to be notified about new messages"
        }
      }
    }
  }
});

db.createCollection("Conversations", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user1", "user2"],
      properties: {
        user1: {
          bsonType: ["null", "objectId"],
          description: "Id of first user"
        },
        user2: {
          bsonType: ["null", "objectId"],
          description: "Id of second user"
        }
      }
    }
  }
});

db.createCollection("ConversationMessages", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["conversation_id", "author", "message"],
      properties: {
        conversation_id: {
          bsonType: "objectId",
          description: "Id of conversation"
        },
        author: {
          bsonType: "objectId",
          description: "Id of author"
        },
        message: {
          bsonType: "string",
          minLength: 0,
          description: "Raw text"
        },
        sent_at: {
          bsonType: "date",
          description: "Date of creation"
        }
      }
    }
  }
});

db.createCollection("Notifications");

db.faculties.aggregate([
  {
    $lookup: {
      from: "courses",
      localField: "faculty_id",
      foreignField: "_id",
      as: "faculties_courses"
    }
  }
]);
