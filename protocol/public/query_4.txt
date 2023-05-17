load("./data/scripts/auth.js");

const query = db.conversations.aggregate([
  {
    $lookup: {
      from: "conversation_messages",
      localField: "_id",
      foreignField: "conversation_id",
      as: "messages"
    }
  },
  {
    $project: {
      _id: 1,
      messages: {
        $map: {
          input: "$messages",
          as: "msg",
          in: "$$msg._id"
        }
      }
    }
  }
]);

const queryResult = {
  result: query.toArray(),
  explain: query.explain()
};

const outputFile = "query_4.json";
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
