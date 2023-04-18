db = connect(
  "mongodb://root:password@127.0.0.1:27017/test?replicaSet=replSet&authSource=admin&directConnection=true"
);

// const faculties = db.faculties.find();

// let facultiesLen = 0;

// faculties.forEach(() => {
//   printjson;
//   facultiesLen++;
// });

// print(facultiesLen);

/**
 * Function that add a new thread and updates thread_count for given course
 * @param {*} _threadData - thread data => title, author
 * @param {string} courseName - name of course - TODO: replace with _id
 */
const addNewThread = (_threadData, courseName,postData) => {
  const courses = db.courses.find({ name: courseName }, { _id: 1 });

  const { _id: courseId } = courses.hasNext() ? courses.next() : null;

  if (!courseId) {
    console.error(
      `Can not add thread, because no course with courseName=${courseName} was found.`
    );
    return;
  }

  const threadData = { ..._threadData, course_id: courseId };

  console.log(`Course objectId: ${courseId}`);

  const threadsCount = db.threads.countDocuments({ course_id: courseId });

  console.log("Threads count: ", threadsCount);

  const threadInsertResult = db.threads.insertOne(threadData);

  console.debug("INSERTED THREAD", threadInsertResult.insertedId);


  const postInsertResult = db.posts.insertOne({...postData,thread_id:threadInsertResult.insertedId})

  console.debug("INSERTED POST",postInsertResult)

  const courseUpdateResult = db.courses.updateOne({ _id: courseId }, [
    { $set: { thread_count: threadsCount + 1 } }
  ]);

  console.debug("UPDATED COURSE COUNT", courseUpdateResult);
};
//testing user id ObjectId("643e670e2364bc4a4efda47f"
// addNewThread(
//   {
//     title: "New thread for ZMAT1 #2",
//     author: "ADMIN"
//   },
//   "Základy matematiky 1",
//   {
//     author_id:ObjectId("643e670e2364bc4a4efda47f"),
//     created_at:new Date(),
//     text:"Testing posts"
//   }
// );


const addNewPost = (threadId,_postData)=>{

  const threads = db.threads.find({_id:threadId})

  const threadObject = threads.hasNext() ? threads.next() : null;
  
  if(!threadObject){
    console.error(`Can not add post,bceause thread with provided threadId:${threadId} was not found. `)
    return
  }

  console.debug("CURRENT THREAD COUNT:",threadObject)

  const postInsertResult = db.posts.insertOne({..._postData,thread_id:threadId})

  console.debug("POST INSERT RESULT: ", postInsertResult)

  const postId = postInsertResult.insertedId

  const threadUpdateResult = db.threads.updateOne({_id:threadId},{$set:{
    "post_count":threadObject.post_count ? threadObject.post_count+1:1,"last_post":postId
  }})

console.debug("THREAD UPDATE RESULT: ",threadUpdateResult)

}


//db.courses.find({post_count:{$exists:false}}) checking if field exists
//test thread ObjectId("643e6a29adfd24a0268a4b25")
addNewPost(ObjectId("643e6a29adfd24a0268a4b25"),  {
    author_id:ObjectId("643e670e2364bc4a4efda47f"),
    created_at:new Date(),
    text:"Testing posts"
  })
