load("./data/scripts/auth.js");

const postsJson = fs.readFileSync(
  "./data/scripts/mock_data/posts.json",
  "utf8"
);

let posts = JSON.parse(postsJson);

posts = posts.map((post) => {
  return { ...post, created_at: { $date: post.created_at } };
});

db.postsstest.insertMany(EJSON.deserialize(posts));
