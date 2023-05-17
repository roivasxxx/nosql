load("./data/scripts/auth.js");

//Faculties + courses

// query 1: 1millis, 404 docs
// query 1 alt: 0millis, 400 docs

const query = db.faculties.aggregate([
  {
    $lookup: {
      from: "courses",
      localField: "_id",
      foreignField: "faculty_id",
      as: "faculties_courses"
    }
  },
  {
    $project: {
      _id: 1,
      shortcut: 1,
      name: 1,
      course_shortcuts: {
        $sortArray: {
          sortBy: 1,
          input: {
            $map: {
              input: "$faculties_courses",
              as: "t",
              in: "$$t.shortcut"
            }
          }
        }
      },
      courses_count: { $size: "$faculties_courses" }
    }
  }
]);

const queryResult = {
  result: query.toArray(),
  explain: query.explain()
};

const outputFile = "query_1.json";
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
