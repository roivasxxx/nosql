load("./data/scripts/auth.js");

console.debug(`DELETING ${process.env.DB_NAME} DATABASE`);
try {
  db.dropDatabase();
} catch (error) {
  console.error("ERROR OCCURRED WHILE DELETING DB: ", error);
}
console.debug("DELETING COMPLETE");
