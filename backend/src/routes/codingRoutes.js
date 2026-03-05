const express = require("express");
const auth = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const { createCodingQuestion,getAllCodingQuestions ,getCodingQuestionById,submitCode,getCodingAnalytics } = require("../controllers/codingController");

const router = express.Router();

router.post("/create", auth, authorize("admin"), createCodingQuestion);
router.get("/analytics", auth, getCodingAnalytics);
router.get("/",auth,getAllCodingQuestions);
router.get("/:id",auth,getCodingQuestionById);
router.post("/submit",auth,submitCode);
module.exports = router;