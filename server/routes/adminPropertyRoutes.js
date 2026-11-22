const express = require("express");
const router = express.Router();

const {
  getAllProperties,
  getPropertyStats,
  updatePropertyStatus,
} = require("../controllers/adminPropertyController");

const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");

router.use(protect, authorize("admin"));

// Statistics
router.get("/stats", getPropertyStats);

// Get all properties
router.get("/", getAllProperties);

// Approve or reject a property
router.put("/:id/status", updatePropertyStatus);

module.exports = router;