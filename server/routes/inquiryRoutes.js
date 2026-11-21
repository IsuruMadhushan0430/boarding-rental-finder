const express = require("express");
const router = express.Router();

const {
  createInquiry,
  getMyInquiries,
  getReceivedInquiries,
  updateInquiryStatus,
} = require("../controllers/inquiryController");

const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");

// Seeker routes
router.post(
  "/property/:propertyId",
  protect,
  authorize("seeker"),
  createInquiry
);

router.get(
  "/my-inquiries",
  protect,
  authorize("seeker"),
  getMyInquiries
);

// Landlord routes
router.get(
  "/received",
  protect,
  authorize("landlord"),
  getReceivedInquiries
);

router.put(
  "/:id/status",
  protect,
  authorize("landlord"),
  updateInquiryStatus
);

module.exports = router;