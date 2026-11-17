
const express = require("express");
const router = express.Router();

const {
  getPropertyImage,
} = require("../controllers/imageController");

router.get("/:imageId", getPropertyImage);

module.exports = router;
