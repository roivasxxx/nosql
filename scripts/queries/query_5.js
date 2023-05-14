load("./data/scripts/auth.js");

// query 5: 6 millis, 2000 docs
//query 5 alt: 1 millis, 1000 docs

const query = db.users.aggregate([
  {
    $lookup: {
      from: "notifications",
      localField: "_id",
      foreignField: "user",
      as: "notifications"
    }
  },
  {
    $unset: [
      "password",
      "salt",
      "available_login_attempts",
      "allow_message_notifications",
      "created_at",
      "last_login",
      "nickname",
      "email"
    ]
  },
  {
    $match: {
      $expr: {
        $gt: [{ $size: "$notifications" }, 0]
      }
    }
  }
]);

const queryResult = {
  result: query.toArray(),
  explain: query.explain()
};

const outputFile = "query_5.json";
console.debug("WRITING RESULT: " + outputFile);
try {
  fs.writeFileSync(
    "./data/scripts/query_results/" + outputFile,
    JSON.stringify(queryResult),
    "utf-8"
  );
} catch (error) {
  console.error("ERROR OCCURED WHILE WRITING RESULT");
}
