
const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserStats,
  updateUserStatus,
} = require("../controllers/adminUserController");

const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");

// All routes require admin authentication
router.use(protect, authorize("admin"));

router.get("/stats", getUserStats);
router.get("/", getAllUsers);
router.patch("/:id/status", updateUserStatus);

module.exports = router;
