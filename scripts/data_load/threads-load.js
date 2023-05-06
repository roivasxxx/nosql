load("./data/scripts/auth.js");

const threadsJson = fs.readFileSync(
  "./data/scripts/mock_data/threads.json",
  "utf8"
);

let threads = JSON.parse(threadsJson);

threads = threads.map((thread) => {
  const { text, ...rest } = thread;
  return rest;
});

db.threadstest.insertMany(EJSON.deserialize(threads));
