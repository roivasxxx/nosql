db = connect(
  "mongodb://root:password@127.0.0.1:27017/test?replicaSet=replSet&authSource=admin&directConnection=true"
);

db.faculties.insertMany([
  {
    name: "Fakulta informatiky a managementu",
    shortcut: "FIM"
  },
  {
    name: "Přírodovědecká fakulta",
    shortcut: "PřF"
  },
  {
    name: "Filozofická fakulta a ÚSP",
    shortcut: "FF"
  },
  {
    name: "Pedagogická fakulta",
    shortcut: "PdF"
  }
]);

db.users.insertOne({
  email: "test@test.cz",
  salt: "randomsalt",
  password: "hashedsaltedpassword",
  nickname: "testuser123",
  created_at: new Date()
});
