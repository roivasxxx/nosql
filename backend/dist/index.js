"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
const mongoUrl = `mongodb://${process.env.DB_USER}:${process.env.DB_PW}@${process.env.MONGO_PATH}:27017/krajta-clone?replicaSet=replSet&authSource=admin&directConnection=true`;
let mongo;
let db;
const initMongo = () => __awaiter(void 0, void 0, void 0, function* () {
    console.debug("CONNECTING TO MONGO");
    mongo = yield mongodb_1.MongoClient.connect(mongoUrl);
    db = mongo.db("krajta-clone");
});
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`[SERVER]: SERVER IS UP`);
    try {
        yield initMongo();
        console.debug("MONGO CONNECTION ESTABLISHED");
    }
    catch (error) {
        console.error("[SERVER]: AN ERROR HAS OCCURRED: ", error);
    }
}));
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const collectionsDocs = yield db.collections();
    const collections = collectionsDocs.map((col) => {
        return col.collectionName;
    });
    res.send(collections);
}));
/**
 * Endpoint returns user profile for provided userId
 * example endpoint request: http:localhost:8080/getUserProfile/64564a5ba8e6b2be1979f261
 */
app.get("/getUserProfile/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = req.params;
    if (!params.id) {
        res.status(400).send("NO ID WAS PROVIDED");
    }
    const userId = params.id.trim();
    try {
        const userObjectId = new mongodb_1.ObjectId(userId);
        console.debug("LOOKING FOR USER: ", userId);
        const userProfile = yield db
            .collection("users")
            .findOne({ _id: userObjectId }, {
            projection: {
                _id: 1,
                nickname: 1,
                created_at: 1,
                last_login: 1,
                email: 1
            }
        });
        if (userProfile === null) {
            throw new Error("USER WAS NOT FOUND");
        }
        console.debug(userProfile);
        res.status(200).send(userProfile);
    }
    catch (error) {
        res
            .status(500)
            .send({ message: "ERROR OCCURED WHILE GETTING USER", error });
    }
}));
/**
 * Endpoint returns all threads for provided courseId
 * example endpoint request: http:localhost:8080/getCourseThreads/64564484ed04ad823ebc9bf9
 */
app.get("/getCourseThreads/:courseId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = req.params;
    if (!params.courseId) {
        res.status(400).send("NO COURSE ID WAS PROVIDED");
    }
    const courseId = params.courseId;
    try {
        const threadQuery = db.collection("threads").find({
            course_id: new mongodb_1.ObjectId(courseId)
        }, {
            projection: {
                _id: 1,
                title: 1,
                author: 1
            }
        });
        if (threadQuery === null) {
            throw new Error("COURSE PROBABLY DOES NOT EXIST");
        }
        const threads = yield threadQuery.toArray();
        res.status(200).send(threads);
    }
    catch (error) {
        res
            .status(500)
            .send({ message: "ERROR OCCURED WHILE GETTING THREADS", error });
    }
}));
/**
 * Endpoint that returns non-read user notifications
 * example endpoint request: http://localhost:8080/getUserNotifications/64564a5ba8e6b2be1979f2ef/0
 */
app.get("/getUserNotifications/:userId/:pageNum", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            .find({ user: new mongodb_1.ObjectId(userId), read: false })
            .skip(pageNum * NOTIFICATION_LIMIT)
            .limit(NOTIFICATION_LIMIT);
        if (notificationQuery === null) {
            throw new Error("USER WAS PROBABLY NOT FOUND");
        }
        const notifications = yield notificationQuery.toArray();
        res.status(200).send(notifications);
    }
    catch (error) {
        res.status(500).send({
            message: "ERROR OCCURED WHILE GETTING USER NOTIFICATIONS",
            error
        });
    }
}));
app.put("/markNotificationAsRead/:notificationId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = req.params;
    if (!params.notificationId) {
        res.status(400).send("NOTIFICATION ID WAS NOT SUPPLIED");
    }
    const notificationId = params.notificationId;
    try {
        const notificationQuery = yield db.collection("notifications").updateOne({ _id: new mongodb_1.ObjectId(notificationId) }, {
            $set: {
                read: true
            }
        });
        if (notificationQuery === null) {
            throw new Error("NOTIFICATION WAS PROBABLY NOT FOUND");
        }
        res.status(200).send("OK");
    }
    catch (error) {
        res.status(500).send({
            message: "ERROR OCCURED WHEN MARKING NOTIFICATION AS READ",
            error
        });
    }
}));
app.post("/threads/newThread", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    let bodyErrorMessage = "";
    if (Object.keys(body).length === 0) {
        bodyErrorMessage = "REQUEST BODY DOES NOT CONTAIN ANY DATA";
    }
    else if (!body.courseId || !body.author || !body.title) {
        bodyErrorMessage =
            "BODY DOES NOT CONTAIN ONE OF THESE REQUIRED PARAMETERS: [courseId,author,title]";
    }
    if (bodyErrorMessage !== "") {
        res.status(400).send(bodyErrorMessage);
    }
    const threadData = {
        course_id: new mongodb_1.ObjectId(body.courseId),
        author: new mongodb_1.ObjectId(body.author),
        title: body.title,
        notifications: [new mongodb_1.ObjectId(body.author)]
    };
    try {
        const courseQuery = yield db
            .collection("courses")
            .findOne({ _id: threadData.course_id });
        if (courseQuery === null) {
            throw new Error("COURSE WITH PROVIDED ID WAS NOT FOUND");
        }
        const userQuery = yield db
            .collection("users")
            .findOne({ _id: threadData.author });
        if (userQuery === null) {
            throw new Error("USER WITH PROVIDED ID WAS NOT FOUND");
        }
        const threadInsert = yield db.collection("threads").insertOne(threadData);
        console.debug(threadInsert);
        res.status(200).send(threadInsert.insertedId.toString());
    }
    catch (error) {
        res.status(500).send({
            message: "ERROR OCCURED WHEN CREATING NEW POST",
            error
        });
    }
}));
