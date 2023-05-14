load("./data/scripts/auth.js");

/**
 * Function that adds a new thread
 * @param {*} _threadData - thread data => title, author
 * @param {string} courseName - name of course - TODO: replace with _id
 */
const addNewThread = (_threadData, _courseId, postData) => {
  console.debug("CREATING NEW THREAD", _courseId);
  try {
    // first we check whether course exists
    const coursesQuery = db.courses.find({ _id: _courseId }, { _id: 1 });

    const courses = coursesQuery.toArray();

    const courseId = courses.length > 0 ? courses[0]._id : null;
    // if course does not exist no thread is created
    if (!courseId) {
      console.error(
        `Can not add thread, because no course with courseName=${courseName} was found.`
      );
      return;
    }

    const threadData = { ..._threadData, course_id: courseId };

    const threadInsertResult = db.threads.insertOne(threadData);
    // we save the id of the newly created thread doc
    const threadId = threadInsertResult.insertedId;

    console.debug("INSERTED THREAD: ", threadId);

    // we use it to create a new post for the newly created thread
    const postInsertResult = db.posts.insertOne({
      ...postData,
      thread_id: threadId
    });

    console.debug("INSERTED POST: ", postInsertResult.insertedId);

    console.debug("THREAD CREATED");
  } catch (error) {
    console.error("ERROR HAS OCCURED WHILE CREATING NEW THREAD: ", error);
  }
};

addNewThread(
  { author: ObjectId("64564a5ba8e6b2be1979f261"), title: "Test title" },
  ObjectId("64564484ed04ad823ebc9a81"),
  {
    author_id: ObjectId("64564a5ba8e6b2be1979f261"),
    created_at: new Date(),
    text: "Testing new thread + post"
  }
);

// deletes user
// deletes userId out of notification array of all threads
// should probably delete existing notifications, conversations, conversation_messages ?
// maybe a soft delete (mark as deleted) should occur instead of deleting the document ?
const deleteUser = (userId) => {
  console.debug("DELETING USER: ", userId);

  const userQuery = db.users.find({ _id: userId });
  const user = userQuery.hasNext() ? userQuery.next() : null;

  if (!user) {
    console.error(
      `Can not delete user, no user with id:${userId} was not found`
    );
    return;
  }

  const deleteUserQuery = db.users.deleteOne({ _id: userId });

  console.debug("USER DELETE RESULT: ", deleteUserQuery);

  const threadUserNotificationQuery = db.threads.updateMany(
    {},
    { $pull: { notifications: userId } }
  );

  console.debug(
    "THREAD USER NOTIFICATION QUERY RESULT: ",
    threadUserNotificationQuery
  );

  console.debug("DELETE USER FINISHED");
};

deleteUser(ObjectId("64564a5ba8e6b2be1979f262"));

/**
 * helper function that creates conversations and returns newly created conversation id
 * @param {*} user1
 * @param {*} user2
 * @returns ObjectId
 */
const createConversation = (user1, user2) => {
  try {
    const conversationQuery = db.conversations.insertOne({ user1, user2 });
    console.debug("INSERT CONVERSATION RESULT: ", conversationQuery);

    return conversationQuery.insertedId;
  } catch (error) {
    console.error(
      "AN ERROR HAS OCCURRED WHILE CREATING NEW CONVERSATION: ",
      error
    );
    return null;
  }
};

/**
 * Checks whether both users exist
 * @param {*} user1
 * @param {*} user2
 * @returns {boolean}
 */
const areUsersValid = (user1, user2) => {
  const users = db.users
    .find({ $or: [{ _id: user1 }, { _id: user2 }] })
    .toArray();
  if (users.length === 2) {
    return true;
  }
  return false;
};

/**
 * Function that checks whether users are valid
 * checks whether conversation between users exist
 * creates new conversation_messages document
 * @param {*} authorId
 * @param {*} recipientId
 * @param {*} message
 */
const sendMessage = (authorId, recipientId, message) => {
  //check if users exist
  if (!areUsersValid) {
    console.error(
      "Can not send message, because one or both users do not exist"
    );
    return;
  }
  //get existing conversation id
  const existingConversation = db.conversations
    .find(
      {
        $or: [
          {
            $and: [{ user1: authorId }, { user2: recipientId }]
          },
          {
            $and: [{ user1: recipientId }, { user2: authorId }]
          }
        ]
      },
      { _id: 1 }
    )
    .toArray();

  console.debug("existing conversation:", existingConversation);

  //get conversationId - either use id of document found in previous step or create a new conversation
  let conversationId =
    existingConversation.length === 0
      ? createConversation(authorId, recipientId)
      : existingConversation[0]._id;
  if (!conversationId) {
    console.error("Can not create conversation");
    return;
  }

  //create message
  const messagesQuery = db.conversation_messages.insertOne({
    ...message,
    conversation_id: conversationId,
    created_at: new Date(),
    author: authorId
  });

  console.debug("MESSAGES QUERY RESULT: ", messagesQuery);

  console.debug("FINISHED sendMessage");
};

sendMessage(
  ObjectId("64564a5ba8e6b2be1979f261"),
  ObjectId("64564a5ba8e6b2be1979f264"),
  { message: "testing messages" }
);
