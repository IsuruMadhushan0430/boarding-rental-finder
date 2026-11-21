const Inquiry = require("../models/Inquiry");
const Property = require("../models/Property");

// Seeker sends an inquiry
exports.createInquiry = async (req, res) => {
  try {
    const { name, phone, message } = req.body;
    const { propertyId } = req.params;

    if (!name?.trim() || !phone?.trim() || !message?.trim()) {
      return res.status(400).json({
        message: "Please fill in all required fields",
      });
    }

    if (message.length > 1000) {
      return res.status(400).json({
        message: "Message cannot exceed 1000 characters",
      });
    }

    const property = await Property.findOne({
      _id: propertyId,
      status: "Approved",
      isAvailable: true,
    });

    if (!property) {
      return res.status(404).json({
        message: "Property not found or unavailable",
      });
    }

    if (property.landlord.toString() === req.user._id.toString()) {
      return res.status(403).json({
        message: "You cannot send an inquiry to your own property",
      });
    }

    const inquiry = await Inquiry.create({
      property: property._id,
      seeker: req.user._id,
      landlord: property.landlord,
      name: name.trim(),
      phone: phone.trim(),
      message: message.trim(),
    });

    res.status(201).json({
      message: "Inquiry sent successfully",
      inquiry,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Seeker views their inquiries
exports.getMyInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({
      seeker: req.user._id,
    })
      .populate("property", "title price location images")
      .sort({ createdAt: -1 });

    res.status(200).json({ inquiries });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Landlord views received inquiries
exports.getReceivedInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({
      landlord: req.user._id,
    })
      .populate("property", "title price location")
      .populate("seeker", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({ inquiries });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Landlord updates inquiry status
exports.updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["Pending", "Responded", "Closed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid inquiry status",
      });
    }

    const inquiry = await Inquiry.findOne({
      _id: req.params.id,
      landlord: req.user._id,
    });

    if (!inquiry) {
      return res.status(404).json({
        message: "Inquiry not found",
      });
    }

    inquiry.status = status;
    await inquiry.save();

    res.status(200).json({
      message: "Inquiry status updated",
      inquiry,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};