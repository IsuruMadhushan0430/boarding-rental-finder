
const Property = require("../models/Property");

const getPublicPropertyDetails = async (req, res) => {
  try {
    const property = await Property.findOne({
      _id: req.params.id,
      status: "Approved",
      isAvailable: true,
    })
      .populate("images", "_id filename contentType size")
      .populate("landlord", "name phone");

    if (!property) {
      return res.status(404).json({
        message: "Property not found or no longer available.",
      });
    }

    res.status(200).json({
      property,
    });
  } catch (error) {
    console.error("Property details error:", error);

    res.status(500).json({
      message: "Unable to retrieve property details.",
    });
  }
};

module.exports = {
  getPublicPropertyDetails,
};
