const express = require("express");
const router = express.Router();

const {
  createReport,
  getAllReports,
  updateReportStatus,
} = require("../controllers/reportController");

const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");

// Seeker submits a report
router.post(
  "/property/:propertyId",
  protect,
  authorize("seeker"),
  createReport
);

// Admin routes
router.get(
  "/",
  protect,
  authorize("admin"),
  getAllReports
);

router.put(
  "/:id/status",
  protect,
  authorize("admin"),
  updateReportStatus
);

module.exports = router;