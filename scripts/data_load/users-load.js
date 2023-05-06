load("./data/scripts/auth.js");

const usersJson = fs.readFileSync(
  "./data/scripts/mock_data/users.json",
  "utf8"
);

let users = JSON.parse(usersJson);

users = users.map((user) => {
  return {
    ...user,
    created_at: new Date(user.created_at),
    last_login: new Date(user.last_login)
  };
});

db.userstest.insertMany(users);

console.debug("finished");
