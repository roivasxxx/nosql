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
 * @param {*} threadInput - thread data => title, author
 * @param {string} courseName - name of course - TODO: replace with _id
 */
const addNewThread = (threadInput, courseName) => {
  const courses = db.courses.find({ name: courseName }, { _id: 1 });

  const { _id: courseId } = courses.hasNext() ? courses.next() : null;

  if (!courseId) {
    console.error(
      `Can not add thread, because no course with courseName=${courseName} was found.`
    );
    return;
  }

  const threadData = { ...threadInput, course_id: courseId };

  console.log(`Course objectId: ${courseId}`);

  const threadsCount = db.threads.countDocuments({ course_id: courseId });

  console.log("Threads count: ", threadsCount);

  const threadInsertResult = db.threads.insertOne(threadData);

  console.debug("INSERTED THREAD", threadInsertResult);

  const courseUpdateResult = db.courses.updateOne({ _id: courseId }, [
    { $set: { thread_count: threadsCount + 1 } }
  ]);

  console.debug("UPDATED COURSE COUNT", courseUpdateResult);
};

addNewThread(
  {
    title: "New thread for ZMAT1 #2",
    author: "ADMIN"
  },
  "Základy matematiky 1"
);
