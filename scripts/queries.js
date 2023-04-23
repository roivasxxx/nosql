db.faculties.aggregate([
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
      name: 1,
      doc_ids: { $map: { input: "$faculties_courses", as: "t", in: "$$t._id" } }
    }
  }
]);

db.faculties
  .explain("executionStats")
  .aggregate([
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
        name: 1,
        doc_ids: {
          $map: { input: "$faculties_courses", as: "t", in: "$$t._id" }
        }
      }
    }
  ]);
