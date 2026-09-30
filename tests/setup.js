const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  process.env.MONGODB_URI = uri;

  // Connect utama
  await mongoose.connect(uri);

  // Connect ke categoryDb
  const categoryDb = require('../src/config/category.DB');
  if (categoryDb.readyState === 0) {
    await categoryDb.openUri(uri, { dbName: 'category' });
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  const categoryDb = require('../src/config/category.DB');
  if (categoryDb) {
    await categoryDb.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});