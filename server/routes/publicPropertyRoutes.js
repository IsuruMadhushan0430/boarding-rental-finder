
const express = require("express");
const router = express.Router();

const {
  getPublicProperties,
} = require("../controllers/publicPropertyController");

router.get("/", getPublicProperties);

module.exports = router;
