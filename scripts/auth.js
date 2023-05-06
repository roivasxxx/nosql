console.debug("Starting auth");

const { MONGO_USER, MONGO_PW, DB_NAME } = process.env;

console.debug(process.env);

db = connect(
  `mongodb://${MONGO_USER}:${MONGO_PW}@127.0.0.1:27017/${DB_NAME}?replicaSet=replSet&authSource=admin&directConnection=true`
);
console.debug("Auth finished");
