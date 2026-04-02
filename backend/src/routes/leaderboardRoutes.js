const express = require("express");
const auth = require("../middleware/authMiddleware");
const { getLeaderboard } = require("../controllers/leaderboardController");

const router = express.Router();

router.get("/", auth, getLeaderboard);

module.exports = router;