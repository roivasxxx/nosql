load("./data/scripts/auth.js");

const query = db.notifications.aggregate([
  {
    $group: {
      _id: "$user",
      notifications: { $push: "$$ROOT" }
    }
  }
]);

const queryResult = {
  result: query.toArray(),
  explain: query.explain()
};

const outputFile = "query_5_alt.json";
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
