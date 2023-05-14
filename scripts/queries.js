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

/**
 * Query that returns: id, name, shortcut, all course shortcuts and course count for all faculties
 */
const getFacultyCourses = (option) => {
  //Faculties + courses
  if (option === 0) {
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

    console.debug(faculty_courses_join.toArray());
  } else {
    const faculty_courses_alt = db.courses.aggregate([
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
    console.debug(faculty_courses_alt.toArray());
  }
};

getFacultyCourses(2);
// console.debug(faculty_courses_join.explain("executionStats"))

//course_shortcuts:{$sortArray:{sortBy:1,input:{$map: { input: "$faculties_courses", as: "t", in: {shortcut:"$$t.shortcut",name:"$$t.name"}}}}},

const getUserThreadNotifications = () => {
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
};

const getUserConversations = () => {
  const userConversationQuery = db.users.aggregate([
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

  console.debug("CONVERSATIONS: ", userConversationQuery.toArray());
};

const getConversationMessages = () => {
  const conversationMessagesQuery = db.conversations.aggregate([
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

  console.debug("CONVERSATION MESSAGES:", conversationMessagesQuery.toArray());
};

const getUserNotifications = (option) => {
  if (option === 0) {
    const userNotificationsQuery = db.users.aggregate([
      {
        $lookup: {
          from: "notifications",
          localField: "_id",
          foreignField: "user",
          as: "notifications"
        }
      },
      {
        $unset: ["password", "salt", "email", "nickname", "created_at"]
      },
      {
        $match: {
          $expr: {
            $gt: [{ $size: "$notifications" }, 0]
          }
        }
      }
    ]);

    console.debug("USER NOTIFICATIONS:", userNotificationsQuery.toArray());
  } else if (option === 1) {
    const userNotificationQueryAlt = db.notifications.aggregate([
      {
        $group: {
          _id: "$user",
          notifications: { $push: "$$ROOT" }
        }
      }
    ]);

    console.debug("ALT NOTIFICATIONS:", userNotificationQueryAlt.toArray());
  }
};

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
