const mongoose = require("mongoose");

// Jika sedang running test (NODE_ENV=test), gunakan fungsi tiruan/koneksi async
const getUri = () => process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/todo-api";

// Buat connection
const categoryDb = mongoose.createConnection();

// Jika bukan sedang test, langsung connect. Jika sedang test, biarkan setup.js yang mengkoneksikannya.
if (process.env.NODE_ENV !== "test") {
  categoryDb.openUri(getUri(), { dbName: "category" });
}

module.exports = categoryDb;