load("./data/scripts/auth.js");

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
      _id: 0,
      shortcut: 1,
      name: 1,
      course_shortcuts: {
        $sortArray: {
          sortBy: 1,
          input: {
            $map: { input: "$faculties_courses", as: "t", in: "$$t.shortcut" }
          }
        }
      },
      all_threads_count: { $sum: "$faculties_courses.thread_count" },
      courses_count: { $size: "$faculties_courses" }
    }
  }
]);

// console.debug(faculty_courses_join.toArray())
// console.debug(faculty_courses_join.explain("executionStats"))

//course_shortcuts:{$sortArray:{sortBy:1,input:{$map: { input: "$faculties_courses", as: "t", in: {shortcut:"$$t.shortcut",name:"$$t.name"}}}}},

const usersQuery = db.users.aggregate([
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

console.debug(usersQuery.toArray());

const userConversationQuery = db.users.aggregate([
  {
    $lookup: {
      from: "Conversations",
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

console.debug("CONVERSATIONS: ", userConversationQuery.toArray());

const conversationMessagesQuery=db.Conversations.aggregate([
  {
    $lookup:{
      from:"ConversationMessages",
      localField:"_id",
      foreignField:"conversation_id"
      ,as:"messages"
    }
  },{
    $project:{
      _id:1,
      messages:{
        $map:{
          input:"$messages",as:"msg",in:"$$msg._id"
        }
      }
    }
  }
])

console.debug("CONVERSATION MESSAGES:",conversationMessagesQuery.toArray())


const userNotificationsQuery= db.users.aggregate([
  {
    $lookup:{
      from:"notifications",
      localField:"_id",
      foreignField:"user",
      as:"notifications"
    }
  },
  {
    $unset:["password","salt","email","nickname","created_at"]
  },
  {
    $match:{
      $expr:{
        $gt:[
          {$size:"$notifications"},0
        ] 
      }
    }
  }
])

const userNotificationQueryAlt = db.notifications.aggregate([
{
    $group:{
      _id:"$user",notifications:{$push:"$$ROOT"}
    }
  }
])

console.debug("USER NOTIFICATIONS:",userNotificationsQuery.toArray())
console.debug("ALT NOTIFICATIONS:",userNotificationQueryAlt.toArray())

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
