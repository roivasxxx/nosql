load("./data/scripts/auth.js");

// const faculties = db.faculties.find();

// let facultiesLen = 0;

// faculties.forEach(() => {
//   printjson;
//   facultiesLen++;
// });

// print(facultiesLen);

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

const addNewPost = (threadId, _postData) => {
  const threads = db.threads.find({ _id: threadId });

  const threadObject = threads.hasNext() ? threads.next() : null;

  if (!threadObject) {
    console.error(
      `Can not add post,bceause thread with provided threadId:${threadId} was not found. `
    );
    return;
  }

  console.debug("CURRENT THREAD COUNT:", threadObject);

  const postInsertResult = db.posts.insertOne({
    ..._postData,
    thread_id: threadId
  });

  console.debug("POST INSERT RESULT: ", postInsertResult);

  const postId = postInsertResult.insertedId;

  const threadUpdateResult = db.threads.updateOne(
    { _id: threadId },
    {
      $set: {
        post_count: threadObject.post_count ? threadObject.post_count + 1 : 1,
        last_post: postId
      }
    }
  );

  console.debug("THREAD UPDATE RESULT: ", threadUpdateResult);
};

//db.courses.find({post_count:{$exists:false}}) checking if field exists
//test thread ObjectId("643e6a29adfd24a0268a4b25")

// addNewPost(ObjectId("643e6a29adfd24a0268a4b25"), {
//   author_id: ObjectId("643e670e2364bc4a4efda47f"),
//   created_at: new Date(),
//   text: "Testing posts"
// });

//user - ObjectId("643c1780692fd0f1a8cc9ef3") , user2 - ObjectId("644427022dec6e9fd9e410ba")
//ObjectId("644427858f8e59687d507b27")
//ObjectId("6444277a8f8e59687d507b26")
//ObjectId("644427558f8e59687d507b25")
const deleteUser = (userId) => {
  //delete user

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

  //find conversations
  const conversations = db.Conversations.find({
    $or: [{ user1: userId }, { user2: userId }]
  }).toArray();

  //check which ones should be deleted/updated
  const conversationsToDelete = [];
  const conversationsToUpdate = [];
  conversations.forEach((item) => {
    if (!item.user1 || !item.user2) {
      conversationsToDelete.push(item._id);
    } else {
      conversationsToUpdate.push(item._id);
    }
  });
  //delete conversations where user1=user2=null
  const conversationsDeleteQuery = db.Conversations.deleteMany({
    _id: { $in: conversationsToDelete }
  });

  console.debug("CONVERSATIONS DELETE RESULT: ", conversationsDeleteQuery);

  //update conversations
  const conversationsUpdateQuery = db.Conversations.updateMany(
    { _id: { $in: conversationsToUpdate } },
    [
      {
        $set: {
          user1: {
            $cond: [{ $eq: ["$user1", userId] }, null, "$user1"]
          },
          user2: {
            $cond: [{ $eq: ["$user2", userId] }, null, "$user2"]
          }
        }
      }
    ]
  );

  console.debug("CONVERSATIONS UPDATE QUERY: ", conversationsUpdateQuery);

  const threadUserNotificationQuery = db.Threads.updateMany(
    {},
    { $pull: { users: userId } }
  );

  console.debug(
    "THREAD USER NOTIFICATION QUERY RESULT: ",
    threadUserNotificationQuery
  );

  console.debug("ENDING");
};

//db.Conversations.updateOne({_id:ObjectId("6444287781c35de3cc0406ba")},[{$set:{user1:"$user2"}}])
//deleteUser(ObjectId("643c1780692fd0f1a8cc9ef3"));

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

const areUsersValid = (user1, user2) => {
  const users = db.users
    .find({ $or: [{ _id: user1 }, { _id: user2 }] })
    .toArray();
  if (users.length === 2) {
    return true;
  }
  return false;
};

// ObjectId("644427022dec6e9fd9e410ba")
//ObjectId('6444277a8f8e59687d507b26')

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
