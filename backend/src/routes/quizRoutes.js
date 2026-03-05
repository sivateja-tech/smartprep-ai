const express = require("express");
const auth = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const {
  createQuiz,
  addQuestionToQuiz,


} = require("../controllers/quizController");
const { getAllQuizzes}=require('../controllers/quizController');
const {getQuizById}=require('../controllers/quizController');
const {submitQuiz}=require('../controllers/quizController');
const { getQuizAnalytics } = require("../controllers/quizController");
const router = express.Router();

// Create Quiz (Admin)
router.post("/create", auth, authorize("admin"), createQuiz);

// Add Question to Specific Quiz
router.post(
  "/:quizId/add-question",
  auth,
  authorize("admin"),
  addQuestionToQuiz
);
router.get("/analytics", auth, getQuizAnalytics);
router.get("/",auth,getAllQuizzes);

router.get("/:quizId",auth,getQuizById);
router.post("/submit", auth, submitQuiz);

module.exports = router;