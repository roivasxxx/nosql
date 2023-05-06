load("./data/scripts/auth.js");

const usersJson = fs.readFileSync(
  "./data/scripts/mock_data/users.json",
  "utf8"
);

let users = JSON.parse(usersJson);

users = users.map((user) => {
  return {
    ...user,
    created_at: user.created_at,
    last_login: user.last_login
  };
});

db.userstest.insertMany(EJSON.deserialize(users));

console.debug("finished");
