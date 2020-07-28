const MongoClient = require('mongodb').MongoClient;
const config = require('../config');

async function resetDatabase() {
  const client = await MongoClient.connect(config.mongoUrl, { useUnifiedTopology: true })
  db = client.db();
  const collections = await db.listCollections().toArray();
  await Promise.all(
    collections
      .map(({ name }) => name)
      .map(collection => db.collection(collection).drop())
  );
  client.close();
}

module.exports = {
  resetDatabase
}