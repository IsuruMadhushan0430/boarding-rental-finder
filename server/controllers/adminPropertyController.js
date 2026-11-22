const Property = require("../models/Property");

// Admin: Get all properties
exports.getAllProperties = async (req, res) => {
  try {
    const {
      status,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (status && status !== "All") {
      const allowedStatuses = [
        "Pending",
        "Approved",
        "Rejected",
        "Rented",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid property status",
        });
      }

      filter.status = status;
    }

    if (search) {
      const escapedSearch = search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      filter.$or = [
        { title: { $regex: escapedSearch, $options: "i" } },
        { "location.city": { $regex: escapedSearch, $options: "i" } },
        { "location.district": { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const currentPage = Number(page);
    const pageSize = Number(limit);

    if (
      !Number.isInteger(currentPage) ||
      currentPage < 1 ||
      !Number.isInteger(pageSize) ||
      pageSize < 1 ||
      pageSize > 50
    ) {
      return res.status(400).json({
        message: "Invalid pagination values",
      });
    }

    const skip = (currentPage - 1) * pageSize;

    const [properties, total] = await Promise.all([
      Property.find(filter)
        .populate("landlord", "name email phone")
        .populate("images", "_id filename contentType size")
        .populate("reviewedBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize),

      Property.countDocuments(filter),
    ]);

    res.status(200).json({
      properties,
      pagination: {
        total,
        page: currentPage,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Admin: Get property statistics
exports.getPropertyStats = async (req, res) => {
  try {
    const [total, pending, approved, rejected, rented] =
      await Promise.all([
        Property.countDocuments(),
        Property.countDocuments({ status: "Pending" }),
        Property.countDocuments({ status: "Approved" }),
        Property.countDocuments({ status: "Rejected" }),
        Property.countDocuments({ status: "Rented" }),
      ]);

    res.status(200).json({
      total,
      pending,
      approved,
      rejected,
      rented,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Admin: Approve or reject property
exports.updatePropertyStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    const allowedStatuses = ["Approved", "Rejected"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Admin can only approve or reject properties",
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

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    if (property.status !== "Pending") {
      return res.status(400).json({
        message: "Only pending properties can be reviewed",
      });
    }

    property.status = status;
    property.isAvailable = status === "Approved";
    property.adminNote = adminNote?.trim() || "";
    property.reviewedBy = req.user._id;
    property.reviewedAt = new Date();

    await property.save();

    res.status(200).json({
      message: `Property ${status.toLowerCase()} successfully`,
      property,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};