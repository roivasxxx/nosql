load("./data/scripts/auth.js");

const query = db.users.aggregate([
  {
    $lookup: {
      from: "threads",
      let: { id: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $in: ["$$id", "$notifications"]
            }
          }
        }
      ],
      as: "thread_notifications"
    }
  },
  {
    $project: {
      _id: 0,
      email: 1,
      nickname: 1,
      created_at: 1,
      thread_notifications: {
        $map: { input: "$thread_notifications", as: "t", in: "$$t._id" }
      }
    }
  }
]);

const queryResult = {
  result: query.toArray(),
  explain: query.explain()
};

const outputFile = "query_2.json";
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
