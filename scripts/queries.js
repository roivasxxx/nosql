load("./data/scripts/auth.js")


// const result = db.faculties.aggregate([
//   {
//     $lookup: {
//       from: "courses",
//       localField: "_id",
//       foreignField: "faculty_id",
//       as: "faculties_courses"
//     }
//   },
//   {
//     $project: {
//       "faculties._id": 1,
//       name: 1,
//       course_ids: { $map: { input: "$faculties_courses", as: "t", in: "$$t._id" } }
//     }
//   }
// ]);

//Faculties + courses
const faculty_courses_join = db.faculties.aggregate([
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
      _id:0,
      shortcut:1,
      name: 1,
      course_shortcuts:{$sortArray:{sortBy:1,input:{$map: { input: "$faculties_courses", as: "t", in: "$$t.shortcut"}}}}, 
      all_threads_count:{$sum:"$faculties_courses.thread_count"},
      courses_count:{$size:"$faculties_courses"},
    }
  }
]);


console.debug(faculty_courses_join.toArray())
// console.debug(faculty_courses_join.explain("executionStats"))






// db.faculties
//   .explain("executionStats")
//   .aggregate([
//     {
//       $lookup: {
//         from: "courses",
//         localField: "_id",
//         foreignField: "faculty_id",
//         as: "faculties_courses"
//       }
//     },
//     {
//       $project: {
//         _id: 1,
//         name: 1,
//         doc_ids: {
//           $map: { input: "$faculties_courses", as: "t", in: "$$t._id" }
//         }
//       }
//     }
//   ]);
