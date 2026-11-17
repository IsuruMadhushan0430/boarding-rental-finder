const express = require("express");

const router = express.Router();

const {
  createProperty,
  getMyProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getDashboardStats,
} = require("../controllers/propertyController");

const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const {
  uploadPropertyImages,
  deletePropertyImage,
} = require("../controllers/imageController");

// All routes require landlord authentication
router.use(protect, authorize("landlord"));

// Dashboard statistics
router.get("/dashboard/stats", getDashboardStats);

// Create property
router.post("/", createProperty);

// Get landlord properties
router.get("/my-properties", getMyProperties);

// Get single property
router.get("/:id", getPropertyById);

// Update property
router.put("/:id", updateProperty);

// Delete property
router.delete("/:id", deleteProperty);

router.post(
  "/:id/images",
  upload.array("images", 5),
  uploadPropertyImages
);

router.delete(
  "/images/:imageId",
  deletePropertyImage
);

module.exports = router;