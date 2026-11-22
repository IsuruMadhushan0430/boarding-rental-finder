const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Property = require("../models/Property");

dotenv.config();

const migratePropertyReviewFields = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const [adminNotes, reviewers, reviewedDates] = await Promise.all([
    Property.updateMany(
      { adminNote: { $exists: false } },
      { $set: { adminNote: "" } }
    ),
    Property.updateMany(
      { reviewedBy: { $exists: false } },
      { $set: { reviewedBy: null } }
    ),
    Property.updateMany(
      { reviewedAt: { $exists: false } },
      { $set: { reviewedAt: null } }
    ),
  ]);

  const modifiedCount =
    adminNotes.modifiedCount +
    reviewers.modifiedCount +
    reviewedDates.modifiedCount;

  console.log(
    `Property review fields applied: ${modifiedCount} field update(s) completed`
  );

  await mongoose.disconnect();
};

migratePropertyReviewFields().catch(async (error) => {
  console.error("Property review migration failed:", error.message);
  await mongoose.disconnect();
  process.exit(1);
});
