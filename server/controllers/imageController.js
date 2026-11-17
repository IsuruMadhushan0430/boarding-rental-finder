
const Property = require("../models/Property");
const PropertyImage = require("../models/PropertyImage");

// Upload images for a landlord's property
const uploadPropertyImages = async (req, res) => {
  try {
    const property = await Property.findOne({
      _id: req.params.id,
      landlord: req.user._id,
    });

    if (!property) {
      return res.status(404).json({
        message: "Property not found or access denied.",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "Please select at least one image.",
      });
    }

    if (property.images.length + req.files.length > 5) {
      return res.status(400).json({
        message: "A property can have a maximum of 5 images.",
      });
    }

    const savedImages = await PropertyImage.insertMany(
      req.files.map((file) => ({
        property: property._id,
        uploadedBy: req.user._id,
        filename: file.originalname,
        contentType: file.mimetype,
        data: file.buffer,
        size: file.size,
      }))
    );

    property.images.push(...savedImages.map((image) => image._id));

    await property.save();

    res.status(201).json({
      message: "Property images uploaded successfully.",
      images: savedImages.map((image) => ({
        id: image._id,
        url: `/api/images/${image._id}`,
        filename: image.filename,
      })),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Image upload failed.",
    });
  }
};

// Display an image from MongoDB
const getPropertyImage = async (req, res) => {
  try {
    const image = await PropertyImage.findById(req.params.imageId);

    if (!image) {
      return res.status(404).json({
        message: "Image not found.",
      });
    }

    res.set("Content-Type", image.contentType);
    res.set("Content-Length", image.size);
    res.set("Cache-Control", "public, max-age=86400");

    res.send(image.data);
  } catch (error) {
    res.status(500).json({
      message: "Unable to retrieve image.",
    });
  }
};

const deletePropertyImage = async (req, res) => {
  try {
    const image = await PropertyImage.findById(req.params.imageId);

    if (!image) {
      return res.status(404).json({
        message: "Image not found.",
      });
    }

    const property = await Property.findOne({
      _id: image.property,
      landlord: req.user._id,
    });

    if (!property) {
      return res.status(403).json({
        message: "You cannot delete this image.",
      });
    }

    property.images = property.images.filter(
      (id) => id.toString() !== image._id.toString()
    );

    await property.save();
    await image.deleteOne();

    res.json({
      message: "Image deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  uploadPropertyImages,
  getPropertyImage,
  deletePropertyImage,
};
