load("./data/scripts/auth.js");

console.debug("STARTING VALIDATION");

const shouldLog = false;

/**
 *
 * @param {string} logInfo - info to be logged before validation attempt
 * @param {string} collectionName - name of collection
 * @param {Object} data - data to be inserted
 */
const performValidationAttempt = (logInfo, collectionName, data) => {
  console.debug(logInfo);
  try {
    db[collectionName].insertOne(data);
  } catch (error) {
    if (shouldLog) {
      console.error(error.errInfo);
    }
    errorData.push(error.errInfo);
  }
};

const fakeObjectId = "not an object id";

const testData = [
  {
    logInfo: "TESTING USER VALIDATION",
    collectionName: "users",
    firstTest: {
      email: "testtest.cz",
      nickname: "test",
      salt: "salt",
      password: "supersecretpassword",
      created_at: new Date()
    },
    secondTest: {}
  },
  {
    logInfo: "TESTING NOTIFICATIONS VALIDATION",
    collectionName: "notifications",
    firstTest: {
      user: fakeObjectId,
      title: "Notification",
      message: "Notification message",
      created_at: new Date(),
      read: false
    },
    secondTest: {}
  },
  {
    logInfo: "TESTING NOTIFICATION MESSAGES VALIDATION",
    collectionName: "conversation_messages",
    firstTest: {
      conversation_id: fakeObjectId,
      sent_at: new Date(),
      author: fakeObjectId,
      message: 211212
    },
    secondTest: {}
  },
  {
    logInfo: "TESTING CONVERSATIONS VALIDATION",
    collectionName: "conversations",
    firstTest: {
      user1: fakeObjectId,
      user2: fakeObjectId
    },
    secondTest: {}
  },
  {
    logInfo: "TESTING POSTS VALIDATION",
    collectionName: "posts",
    firstTest: {
      thread_id: fakeObjectId,
      author_id: fakeObjectId,
      created_at: new Date(),
      updated_at: new Date(),
      text: "Post text",
      replying_to: 123
    },
    secondTest: {}
  },
  {
    logInfo: "TESTING THREADS VALIDATION",
    collectionName: "threads",
    firstTest: {
      course_id: fakeObjectId,
      title: "Testing title",
      author: fakeObjectId,
      notifications: []
    },
    secondTest: {}
  },
  {
    logInfo: "TESTING COURSES VALIDATION",
    collectionName: "courses",
    firstTest: {
      faculty_id: fakeObjectId,
      name: "Fake course",
      shortcut: 123
    },
    secondTest: {}
  },
  {
    logInfo: "TESTING FACULTIES VALIDATION",
    collectionName: "faculties",
    firstTest: {
      name: 123,
      shortcut: "SHORT"
    },
    secondTest: {}
  }
];

const errorData = [];

for (const validationTest of testData) {
  performValidationAttempt(
    validationTest.logInfo + " 1",
    validationTest.collectionName,
    validationTest.firstTest
  );
  performValidationAttempt(
    validationTest.logInfo + " 2",
    validationTest.collectionName,
    validationTest.secondTest
  );
}

const outputFile = "validation-output.json";
console.debug("WRITING VALIDATION ERROR LOGS TO FILE: " + outputFile);
try {
  fs.writeFileSync(
    "./data/scripts/" + outputFile,
    JSON.stringify(errorData),
    "utf-8"
  );
} catch (error) {
  console.error("ERROR OCCURED WHILE WRITING OUTPUT FILE");
}
