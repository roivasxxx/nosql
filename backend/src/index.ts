import express, { Express, Request, Response } from "express";
import { Db, FindOptions, MongoClient, ObjectId } from "mongodb";
import * as dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());

const mongoUrl = `mongodb://${process.env.DB_USER}:${process.env.DB_PW}@${process.env.MONGO_PATH}:27017/krajta-clone?replicaSet=replSet&authSource=admin&directConnection=true`;

let mongo;
let db: Db;

const initMongo = async () => {
  console.debug("CONNECTING TO MONGO");
  mongo = await MongoClient.connect(mongoUrl);
  db = mongo.db("krajta-clone");
};

app.listen(port, async () => {
  console.log(`[SERVER]: SERVER IS UP`);
  try {
    await initMongo();
    console.debug("MONGO CONNECTION ESTABLISHED");
  } catch (error) {
    console.error("[SERVER]: AN ERROR HAS OCCURRED: ", error);
  }
});

app.get("/", async (req: Request, res: Response) => {
  const collectionsDocs = await db.collections();

  const collections = collectionsDocs.map((col) => {
    return col.collectionName;
  });

  res.send(collections);
});

/**
 * Endpoint returns user profile for provided userId
 * example endpoint request: http:localhost:8080/getUserProfile/64564a5ba8e6b2be1979f261
 */
app.get("/getUserProfile/:id", async (req: Request, res: Response) => {
  const params = req.params;
  if (!params.id) {
    res.status(400).send("NO ID WAS PROVIDED");
  }
  const userId = params.id.trim();
  try {
    const userObjectId = new ObjectId(userId);

    console.debug("LOOKING FOR USER: ", userId);

    const userProfile = await db
      .collection("users")
      .findOne({ _id: userObjectId }, {
        projection: {
          _id: 1,
          nickname: 1,
          created_at: 1,
          last_login: 1,
          email: 1
        }
      } as FindOptions);

    if (userProfile === null) {
      throw new Error("USER WAS NOT FOUND");
    }
    console.debug(userProfile);
    res.status(200).send(userProfile);
  } catch (error) {
    res
      .status(500)
      .send({ message: "ERROR OCCURED WHILE GETTING USER", error });
  }
});

/**
 * Endpoint returns all threads for provided courseId
 * example endpoint request: http:localhost:8080/getCourseThreads/64564484ed04ad823ebc9bf9
 */
app.get("/getCourseThreads/:courseId", async (req: Request, res: Response) => {
  const params = req.params;
  if (!params.courseId) {
    res.status(400).send("NO COURSE ID WAS PROVIDED");
  }
  const courseId = params.courseId;
  try {
    const threadQuery = db.collection("threads").find(
      {
        course_id: new ObjectId(courseId)
      },
      {
        projection: {
          _id: 1,
          title: 1,
          author: 1
        }
      }
    );
    if (threadQuery === null) {
      throw new Error("COURSE PROBABLY DOES NOT EXIST");
    }

    const threads = await threadQuery.toArray();
    res.status(200).send(threads);
  } catch (error) {
    res
      .status(500)
      .send({ message: "ERROR OCCURED WHILE GETTING THREADS", error });
  }
});

/**
 * Endpoint that returns non-read user notifications
 * example endpoint request: http://localhost:8080/getUserNotifications/64564a5ba8e6b2be1979f2ef/0
 */
app.get(
  "/getUserNotifications/:userId/:pageNum",
  async (req: Request, res: Response) => {
    const params = req.params;
    if (!params.userId || !params.pageNum) {
      res.status(400).send("PARAMS WERE NOT SPECIFIED");
    }

    const userId = params.userId;
    const pageNum = Number.parseInt(params.pageNum);
    // Limit is set this low because not enough notifications were generated for users
    const NOTIFICATION_LIMIT = 2;

    try {
      const notificationQuery = db
        .collection("notifications")
        .find({ user: new ObjectId(userId), read: false })
        .skip(pageNum * NOTIFICATION_LIMIT)
        .limit(NOTIFICATION_LIMIT);

      if (notificationQuery === null) {
        throw new Error("USER WAS PROBABLY NOT FOUND");
      }
      const notifications = await notificationQuery.toArray();

      res.status(200).send(notifications);
    } catch (error) {
      res.status(500).send({
        message: "ERROR OCCURED WHILE GETTING USER NOTIFICATIONS",
        error
      });
    }
  }
);

/**
 * Endpoint that marks a notification as read
 * example endpoint request: http://localhost:8080/markNotificationAsRead/645695df18c91e4a875e9e49
 */
app.put(
  "/markNotificationAsRead/:notificationId",
  async (req: Request, res: Response) => {
    const params = req.params;
    if (!params.notificationId) {
      res.status(400).send("NOTIFICATION ID WAS NOT SUPPLIED");
    }
    const notificationId = params.notificationId;
    try {
      const notificationQuery = await db.collection("notifications").updateOne(
        { _id: new ObjectId(notificationId) },
        {
          $set: {
            read: true
          }
        }
      );
      if (notificationQuery === null) {
        throw new Error("NOTIFICATION WAS PROBABLY NOT FOUND");
      }
      res.status(200).send("OK");
    } catch (error) {
      res.status(500).send({
        message: "ERROR OCCURED WHEN MARKING NOTIFICATION AS READ",
        error
      });
    }
  }
);

/**
 * Endpoint that creates a new thread
 * example endpoint request: http://localhost:8080/threads/newThread
 * example body:
 * {"courseId":"64564484ed04ad823ebc9aab","author":"64564a5ba8e6b2be1979f312","title":"Testing insert"}
 * on success -> returns id of newly created post
 */
app.post("/threads/newThread", async (req: Request, res: Response) => {
  const body = req.body;

  let bodyErrorMessage = "";
  if (Object.keys(body).length === 0) {
    bodyErrorMessage = "REQUEST BODY DOES NOT CONTAIN ANY DATA";
  } else if (!body.courseId || !body.author || !body.title) {
    bodyErrorMessage =
      "BODY DOES NOT CONTAIN ONE OF THESE REQUIRED PARAMETERS: [courseId,author,title]";
  }
  if (bodyErrorMessage !== "") {
    res.status(400).send(bodyErrorMessage);
  }

  const threadData = {
    course_id: new ObjectId(body.courseId),
    author: new ObjectId(body.author),
    title: body.title,
    notifications: [new ObjectId(body.author)]
  };

  try {
    const courseQuery = await db
      .collection("courses")
      .findOne({ _id: threadData.course_id });
    if (courseQuery === null) {
      throw new Error("COURSE WITH PROVIDED ID WAS NOT FOUND");
    }

    const userQuery = await db
      .collection("users")
      .findOne({ _id: threadData.author });
    if (userQuery === null) {
      throw new Error("USER WITH PROVIDED ID WAS NOT FOUND");
    }

    const threadInsert = await db.collection("threads").insertOne(threadData);
    console.debug(threadInsert);
    res.status(200).send(threadInsert.insertedId.toString());
  } catch (error) {
    res.status(500).send({
      message: "ERROR OCCURED WHEN CREATING NEW POST",
      error
    });
  }
});
