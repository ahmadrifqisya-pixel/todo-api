const mongoose = require("mongoose");

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/todo-api";

const categoryDb = mongoose.createConnection(mongoUri, {
    dbName: "category",
});

module.exports = categoryDb;