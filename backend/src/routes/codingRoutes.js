const express = require("express");

const auth = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const validate = require("../middleware/validate");
const { codeSubmitLimiter } = require("../middleware/rateLimiter");

const {
  createCodingQuestion,
  getAllCodingQuestions,
  getCodingQuestionById,
  submitCode,
  getCodingAnalytics
} = require("../controllers/codingController");

const {
  createCodingQuestionSchema,
  submitCodeSchema,
  idParamSchema,
  listQuestionsSchema
} = require("../validators/codingValidators");

const router = express.Router();

// Admin: Create coding question
router.post(
  "/create",
  auth,
  authorize("admin"),
  validate(createCodingQuestionSchema),
  createCodingQuestion
);

// Student: Coding analytics
router.get(
  "/analytics",
  auth,
  getCodingAnalytics
);

// Student: Get all coding questions
router.get(
  "/",
  auth,
  validate(listQuestionsSchema, "query"),
  getAllCodingQuestions
);

// Student: Get coding question by ID
router.get(
  "/:id",
  auth,
  validate(idParamSchema, "params"),
  getCodingQuestionById
);

// Student: Submit code
router.post(
  "/submit",
  auth,
  codeSubmitLimiter,
  validate(submitCodeSchema),
  submitCode
);

module.exports = router;