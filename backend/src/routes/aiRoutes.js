const express = require("express");
const auth = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const { generateQuiz } = require("../controllers/aiController");

const router = express.Router();

// Only admin can generate quiz
router.post("/generate-quiz", auth, authorize("admin"), generateQuiz);

module.exports = router;