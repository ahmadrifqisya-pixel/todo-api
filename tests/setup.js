const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
  // Matikan log error driver yang tidak perlu
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  process.env.MONGODB_URI = uri;

  // 1. Connect Mongoose utama
  await mongoose.connect(uri);

  // 2. Connect categoryDb (jika dipanggil)
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