const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },

    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reason: {
      type: String,
      enum: [
        "Fake Listing",
        "Incorrect Information",
        "Suspicious Landlord",
        "Inappropriate Content",
        "Already Rented",
        "Other",
      ],
      required: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Dismissed", "Action Taken"],
      default: "Pending",
    },

    adminNote: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// One report per user per property
reportSchema.index(
  { property: 1, reporter: 1 },
  { unique: true }
);

module.exports = mongoose.model("Report", reportSchema);