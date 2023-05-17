load("./data/scripts/auth.js");

const query = db.courses.aggregate([
  {
    $group: {
      _id: "$faculty_id",
      notifications: { $push: "$shortcut" }
    }
  },
  {
    $lookup: {
      from: "faculties",
      localField: "_id",
      foreignField: "_id",
      as: "faculty"
    }
  },
  {
    $project: {
      _id: 1,
      notifications: 1,
      faculty: {
        $arrayElemAt: ["$faculty", 0]
      }
    }
  },
  {
    $project: {
      _id: 1,
      notifications: 1,
      name: "$faculty.name",
      shortcut: "$faculty.shortcut"
    }
  }
]);

const queryResult = {
  result: query.toArray(),
  explain: query.explain()
};

const outputFile = "query_1_alt.json";
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
