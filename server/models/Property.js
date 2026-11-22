
const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    propertyType: {
      type: String,
      enum: [
        "Boarding House",
        "Annex",
        "House",
        "Apartment",
      ],
      required: true,
    },

    roomType: {
      type: String,
      enum: [
        "Single Room",
        "Shared Room",
        "Full House",
      ],
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 1,
    },

    facilities: {
      type: [String],
      default: [],
    },

    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PropertyImage",
      },
    ],

    location: {
      address: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      district: {
        type: String,
        required: true,
      },

      coordinates: {
        lat: Number,
        lng: Number,
      },
    },

    availableRooms: {
      type: Number,
      required: true,
      min: 0,
    },

    genderPreference: {
      type: String,
      enum: ["Any", "Male", "Female"],
      default: "Any",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected",
        "Rented",
      ],
      default: "Pending",
    },

    isAvailable: {
      type: Boolean,
      default: true,
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
      {
        timestamps: true,
      }
  );

module.exports = mongoose.model(
  "Property",
  propertySchema
);
