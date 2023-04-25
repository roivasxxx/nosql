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


// console.debug(faculty_courses_join.toArray())
// console.debug(faculty_courses_join.explain("executionStats"))

//course_shortcuts:{$sortArray:{sortBy:1,input:{$map: { input: "$faculties_courses", as: "t", in: {shortcut:"$$t.shortcut",name:"$$t.name"}}}}},

const usersQ=db.users.aggregate([{
  $lookup: {
      from: "threads",
      let:{id:"$_id"},
      pipeline:[{
        $match:{
          $expr:{

            $in:["$$id","$notifications"]}
          }
        
      }],
      as: "thread_notifications"
    }
},{
  $project:{
    _id:0,
    email:1,
    nickname:1,
    created_at:1,
    thread_notifications:{
      $map:
        { input: "$thread_notifications", as: "t", in: "$$t._id"}
    
    }
  }
}])

console.debug(usersQ.toArray())

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
