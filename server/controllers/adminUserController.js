
const mongoose = require("mongoose");
const User = require("../models/User");

// GET /api/admin/users
// View and search users
const getAllUsers = async (req, res) => {
  try {
    const {
      role = "All",
      search = "",
      page = 1,
      limit = 10,
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (
      !Number.isInteger(pageNumber) ||
      pageNumber < 1 ||
      !Number.isInteger(limitNumber) ||
      limitNumber < 1 ||
      limitNumber > 50
    ) {
      return res.status(400).json({
        message: "Invalid pagination values.",
      });
    }

    const filter = {};

    // Role filter
    if (role !== "All") {
      if (!["landlord", "seeker", "admin"].includes(role)) {
        return res.status(400).json({
          message: "Invalid user role.",
        });
      }

      filter.role = role;
    }

    // Search by name, email or phone
    if (search.trim()) {
      const escapedSearch = search.trim().replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const regex = new RegExp(escapedSearch, "i");

      filter.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
      ];
    }

    const [users, totalUsers] = await Promise.all([
      User.find(filter)
        .select("-password -__v")
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .lean(),

      User.countDocuments(filter),
    ]);

    res.status(200).json({
      users,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalUsers / limitNumber),
        totalUsers,
        limit: limitNumber,
      },
    });
  } catch (error) {
    console.error("Get all users error:", error);

    res.status(500).json({
      message: "Failed to retrieve users.",
    });
  }
};

// GET /api/admin/users/stats
// User statistics
const getUserStats = async (req, res) => {
  try {
    const [total, landlords, seekers, active, inactive] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: "landlord" }),
        User.countDocuments({ role: "seeker" }),
        User.countDocuments({ isActive: true }),
        User.countDocuments({ isActive: false }),
      ]);

    res.status(200).json({
      stats: {
        total,
        landlords,
        seekers,
        active,
        inactive,
      },
    });
  } catch (error) {
    console.error("Get user stats error:", error);

    res.status(500).json({
      message: "Failed to retrieve user statistics.",
    });
  }
};

// PATCH /api/admin/users/:id/status
// Activate or deactivate a user
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid user ID.",
      });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message: "isActive must be true or false.",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Prevent changing the current admin account
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot deactivate your own account.",
      });
    }

    // Admin accounts cannot be managed through this endpoint
    if (user.role === "admin") {
      return res.status(403).json({
        message: "Admin accounts cannot be modified here.",
      });
    }

    user.isActive = isActive;
    await user.save();

    res.status(200).json({
      message: isActive
        ? "User account activated successfully."
        : "User account deactivated successfully.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Update user status error:", error);

    res.status(500).json({
      message: "Failed to update user status.",
    });
  }
};

module.exports = {
  getAllUsers,
  getUserStats,
  updateUserStatus,
};
