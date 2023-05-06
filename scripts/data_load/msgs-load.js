load("./data/scripts/auth.js");

const convJson = fs.readFileSync("./data/scripts/mock_data/msgs.json", "utf8");

const msgs = JSON.parse(convJson);

db.msgstest.insertMany(EJSON.deserialize(msgs));
