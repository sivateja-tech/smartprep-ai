const express = require("express");
const auth = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const { getSystemAnalytics } = require("../controllers/adminController");

const router = express.Router();

router.get("/system-analytics", auth, authorize("admin"), getSystemAnalytics);

module.exports = router;