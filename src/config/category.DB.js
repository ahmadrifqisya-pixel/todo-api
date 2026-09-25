const mongoose = require("mongoose");

const categoryDb = mongoose.createConnection(process.env.MONGODB_URI, {
    dbName: "categories",
});

categoryDb.on("connected", () => {
    console.log("Connected to Categories Database");
});

module.exports = categoryDb;