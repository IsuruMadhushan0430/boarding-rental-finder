
const Property = require("../models/Property");

// CREATE PROPERTY
const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      propertyType,
      roomType,
      price,
      facilities,
      location,
      availableRooms,
      genderPreference,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !propertyType ||
      !roomType ||
      price === undefined ||
      !location?.address ||
      !location?.city ||
      !location?.district ||
      availableRooms === undefined
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    if (
      !Number.isFinite(Number(price)) ||
      Number(price) <= 0 ||
      !Number.isInteger(Number(availableRooms)) ||
      Number(availableRooms) < 0
    ) {
      return res.status(400).json({
        message: "Invalid price or room count",
      });
    }

    // Create property
    const property = await Property.create({
      landlord: req.user._id,
      title,
      description,
      propertyType,
      roomType,
      price: Number(price),
      facilities: Array.isArray(facilities)
        ? facilities
        : [],
      location,
      availableRooms: Number(availableRooms),
      genderPreference,
    });

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      property,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create property",
      error: error.message,
    });
  }
};

// GET LANDLORD PROPERTIES
const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      landlord: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve properties",
      error: error.message,
    });
  }
};

// GET SINGLE PROPERTY
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findOne({
      _id: req.params.id,
      landlord: req.user._id,
    });

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    res.status(200).json({
      success: true,
      property,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve property",
    });
  }
};

// UPDATE PROPERTY
const updateProperty = async (req, res) => {
  try {
    const allowedFields = [
      "title",
      "description",
      "propertyType",
      "roomType",
      "price",
      "facilities",
      "location",
      "availableRooms",
      "genderPreference",
      "isAvailable",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const property = await Property.findOneAndUpdate(
      {
        _id: req.params.id,
        landlord: req.user._id,
      },
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      property,
    });

  } catch (error) {
    res.status(400).json({
      message: "Property update failed",
      error: error.message,
    });
  }
};

// DELETE PROPERTY
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findOneAndDelete({
      _id: req.params.id,
      landlord: req.user._id,
    });

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Property deletion failed",
    });
  }
};

// LANDLORD DASHBOARD STATISTICS
const getDashboardStats = async (req, res) => {
  try {
    const landlordId = req.user._id;

    const totalProperties = await Property.countDocuments({
      landlord: landlordId,
    });

    const availableProperties = await Property.countDocuments({
      landlord: landlordId,
      isAvailable: true,
      status: "Approved",
    });

    const pendingProperties = await Property.countDocuments({
      landlord: landlordId,
      status: "Pending",
    });

    const rentedProperties = await Property.countDocuments({
      landlord: landlordId,
      status: "Rented",
    });

    res.status(200).json({
      success: true,
      stats: {
        totalProperties,
        availableProperties,
        pendingProperties,
        rentedProperties,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve dashboard statistics",
    });
  }
};

module.exports = {
  createProperty,
  getMyProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getDashboardStats,
};