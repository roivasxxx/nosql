import express, { Express, Request, Response } from "express";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());

console.log("ENV:", process.env.PORT, process.env.DB_USER);
const mongoUrl = `mongodb://${process.env.DB_USER}:${process.env.DB_PW}@mongodb:27017/krajta-clone?replicaSet=replSet&authSource=admin&directConnection=true`;

let mongo;

const initMongo = async () => {
  console.debug("CONNECTING TO MONGO");
  mongo = await MongoClient.connect(mongoUrl);
  const db = mongo.db("krajta-clone");
  const collections = await db.collections();
  console.debug(
    "COLLECTIONS: ",
    collections.map((col) => {
      return col.collectionName;
    })
  );
};

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  await initMongo();
});
