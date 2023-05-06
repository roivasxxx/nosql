load("./data/scripts/auth.js");

const convJson = fs.readFileSync(
  "./data/scripts/mock_data/conversations.json",
  "utf8"
);

const conversations = JSON.parse(convJson);

db.conversationstest.insertMany(EJSON.deserialize(conversations));
