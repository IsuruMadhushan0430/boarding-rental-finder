const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    const message = error.message || "Unknown database connection error";

    if (
      error.name === "MongoServerError" ||
      /authentication failed|bad auth/i.test(message)
    ) {
      console.error(
        "MongoDB authentication failed. Verify that MONGO_URI contains the current database username and password."
      );
    } else if (/IP that isn't whitelisted|whitelist/i.test(message)) {
      console.error(
        "MongoDB Atlas rejected the connection. Verify Network Access and cluster access in the same Atlas project."
      );
      console.error("Atlas error:", message);
    } else if (/timed out|server selection/i.test(message)) {
      console.error(
        "MongoDB connection timed out. Verify Atlas Network Access, cluster status, cluster hostname, and internet/DNS access."
      );
    } else {
      console.error("MongoDB Connection Failed:", message);
    }

    process.exit(1);
  }
};

module.exports = connectDB;