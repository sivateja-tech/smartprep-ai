const express = require("express");
const auth = require("../middleware/authMiddleware");
const { predictPlacement } = require("../controllers/mlController");

const router = express.Router();

router.get("/predict", auth, predictPlacement);

module.exports = router;