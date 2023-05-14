load("./data/scripts/auth.js");

const query = db.users.aggregate([
  {
    $lookup: {
      from: "conversations",
      let: { userId: "$_id" },
      pipeline: [
        {
          $match: {
            // $or: [
            //   // { $eq: ["$users._id", "$Conversations.user1"] },
            //   // { $eq: ["$users._id", "$Conversations.user2"] }
            // ]
            $expr: {
              $or: [
                { $eq: ["$$userId", "$user2"] },
                { $eq: ["$$userId", "$user1"] }
              ]
            }
          }
        }
      ],
      as: "conversations"
    }
  },
  {
    $project: {
      _id: 1,
      email: 1,
      nickname: 1,
      conversations: {
        $map: { input: "$conversations", as: "t", in: "$$t._id" }
      }
    }
  }
]);

const queryResult = {
  result: query.toArray(),
  explain: query.explain()
};

const outputFile = "query_3.json";
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
