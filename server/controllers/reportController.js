const Report = require("../models/Report");
const Property = require("../models/Property");

// Seeker submits a report
exports.createReport = async (req, res) => {
  try {
    const { reason, description } = req.body;
    const { propertyId } = req.params;

    const allowedReasons = [
      "Fake Listing",
      "Incorrect Information",
      "Suspicious Landlord",
      "Inappropriate Content",
      "Already Rented",
      "Other",
    ];

    if (!allowedReasons.includes(reason)) {
      return res.status(400).json({
        message: "Please select a valid report reason",
      });
    }

    if (
      description !== undefined &&
      (typeof description !== "string" || description.length > 1000)
    ) {
      return res.status(400).json({
        message: "Description must be 1000 characters or fewer",
      });
    }

    const property = await Property.findOne({
      _id: propertyId,
      status: "Approved",
    });

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    if (
      property.landlord.toString() === req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You cannot report your own property",
      });
    }

    const report = await Report.create({
      property: property._id,
      reporter: req.user._id,
      reason,
      description: description?.trim() || "",
    });

    res.status(201).json({
      message: "Report submitted successfully",
      report,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "You have already reported this property",
      });
    }

    res.status(500).json({
      message: error.message,
    });
  }
};

// Admin views all reports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("property", "title price location landlord")
      .populate("reporter", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      reports,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Admin updates report status
exports.updateReportStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    const allowedStatuses = [
      "Reviewed",
      "Dismissed",
      "Action Taken",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid report status",
      });
    }

    if (
      adminNote !== undefined &&
      (typeof adminNote !== "string" || adminNote.length > 1000)
    ) {
      return res.status(400).json({
        message: "Admin note must be 1000 characters or fewer",
      });
    }

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    report.status = status;
    report.adminNote = adminNote?.trim() || "";
    report.reviewedBy = req.user._id;
    report.reviewedAt = new Date();

    await report.save();

    // If admin takes action, disable the property
    if (status === "Action Taken") {
      await Property.findByIdAndUpdate(report.property, {
        status: "Rejected",
        isAvailable: false,
      });
    }

    res.status(200).json({
      message: "Report updated successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};