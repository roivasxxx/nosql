load("./data/scripts/auth.js");

console.debug("INSERTING FACULTIES");

// const test = [
//   {
//     _id: {
//       $oid: "643bfb389cb96cec44d89a29"
//     },
//     name: "Fakulta informatiky a managementu",
//     shortcut: "FIM"
//   },
//   {
//     _id: {
//       $oid: "643c06fff8041c69909c405d"
//     },
//     name: "Přírodovědecká fakulta",
//     shortcut: "PřF"
//   },
//   {
//     _id: {
//       $oid: "643c06fff8041c69909c405e"
//     },
//     name: "Filozofická fakulta a ÚSP",
//     shortcut: "FF"
//   },
//   {
//     _id: {
//       $oid: "643c06fff8041c69909c405f"
//     },
//     name: "Pedagogická fakulta",
//     shortcut: "PdF"
//   }
// ];

const facultiesIdArr = db.faculties.find({}, { _id: 1 }).toArray();

console.debug(facultiesIdArr);

const coursesJson = fs.readFileSync(
  "./data/scripts/mock_data/courses.json",
  "utf8"
);

let courses = JSON.parse(coursesJson);

courses = courses.map((course) => {
  const index = Math.floor(Math.random() * facultiesIdArr.length);
  return {
    ...course,
    faculty_id: facultiesIdArr[index]._id,
    shortcut: course.shortcut.toUpperCase()
  };
});

const shortcuts = new Set();
const names = new Set();

const uniqueCourses = [];
for (const course of courses) {
  if (shortcuts.has(course.shortcut) || names.has(course.name)) {
    continue;
  } else {
    shortcuts.add(course.shortcut);
    names.add(course.name);
    uniqueCourses.push(course);
  }
}
console.debug(courses.length, " VS ", uniqueCourses.length);

db.coursestest.insertMany(courses);

// console.debug(EJSON.deserialize(test));
// db.faculties.insertMany([
//   {
//     name: "Fakulta informatiky a managementu",
//     shortcut: "FIM"
//   },
//   {
//     name: "Přírodovědecká fakulta",
//     shortcut: "PřF"
//   },
//   {
//     name: "Filozofická fakulta a ÚSP",
//     shortcut: "FF"
//   },
//   {
//     name: "Pedagogická fakulta",
//     shortcut: "PdF"
//   }
// ]);

console.debug("INSERT FINISHED");
