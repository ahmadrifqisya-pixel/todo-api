require("dotenv").config();

console.log(">>> SERVER.JS MULAI DIEKSEKUSI <<<");

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
     await connectDB();
     console.log("Database terhubung!");

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("Gagal terhubung ke Database:", error.message);
  }
}

startServer();