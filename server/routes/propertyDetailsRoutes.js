
const express = require("express");
const router = express.Router();

const {
  getPublicPropertyDetails,
} = require("../controllers/propertyDetailsController");

router.get("/:id", getPublicPropertyDetails);

module.exports = router;
