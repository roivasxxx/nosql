load("./data/scripts/auth.js");

const notificationsJson = fs.readFileSync(
  "./data/scripts/mock_data/msgs.json",
  "utf8"
);

let notifs = JSON.parse(notificationsJson);

notifs = notifs.map((notif) => {
  return { ...notif, read: false, sent_at: { $date: notif.sent_at } };
});
// console.debug(new Date(notifs[0].created_at));
db.msgsss.insertMany(EJSON.deserialize(notifs));
// fs.writeFile("nffd.json", JSON.stringify(notifs), (err) => console.error(err));
