const prisma = require("../lib/prisma");
const logActivity = require("../utils/activityLogger");
const executeCode = require("../utils/codeExecutor");

// --------------------------------------------------
// CREATE CODING QUESTION - ADMIN
// --------------------------------------------------

exports.createCodingQuestion = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      testCases
    } = req.body;

    if (
      !title ||
      !description ||
      !difficulty ||
      !testCases
    ) {
      return res.status(400).json({
        message: "All fields required"
      });
    }

    if (!Array.isArray(testCases) || testCases.length === 0) {
      return res.status(400).json({
        message: "testCases must be a non-empty array"
      });
    }

    const question = await prisma.codingQuestion.create({
      data: {
        title,
        description,
        difficulty,
        testCases
      }
    });

    res.status(201).json({
      message: "Coding question created",
      question
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// --------------------------------------------------
// GET ALL CODING QUESTIONS
// --------------------------------------------------

exports.getAllCodingQuestions = async (req, res) => {
  try {

    const questions = await prisma.codingQuestion.findMany({
      select: {
        id: true,
        title: true,
        difficulty: true,
        createdAt: true
      }
    });

    res.json(questions);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// --------------------------------------------------
// GET CODING QUESTION BY ID
// --------------------------------------------------

exports.getCodingQuestionById = async (req, res) => {
  try {

    const { id } = req.params;

    const questionId = parseInt(id);

    if (Number.isNaN(questionId)) {
      return res.status(400).json({
        message: "Invalid question ID"
      });
    }

    const question = await prisma.codingQuestion.findUnique({
      where: {
        id: questionId
      }
    });

    if (!question) {
      return res.status(404).json({
        message: "Question not found"
      });
    }

    res.json(question);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// --------------------------------------------------
// SUBMIT CODE - REAL CODE EXECUTION
// --------------------------------------------------

exports.submitCode = async (req, res) => {
  try {

    const userId = req.userId;

    const {
      questionId,
      language,
      code
    } = req.body;

    // -----------------------------
    // Validate request
    // -----------------------------

    if (!questionId || !language || !code) {
      return res.status(400).json({
        message: "questionId, language and code are required"
      });
    }

    const parsedQuestionId = parseInt(questionId);

    if (Number.isNaN(parsedQuestionId)) {
      return res.status(400).json({
        message: "Invalid questionId"
      });
    }

    // -----------------------------
    // Find coding question
    // -----------------------------

    const question = await prisma.codingQuestion.findUnique({
      where: {
        id: parsedQuestionId
      }
    });

    if (!question) {
      return res.status(404).json({
        message: "Question not found"
      });
    }

    // -----------------------------
    // Validate test cases
    // -----------------------------

    const testCases = question.testCases;

    if (
      !Array.isArray(testCases) ||
      testCases.length === 0
    ) {
      return res.status(400).json({
        message: "No test cases available for this question"
      });
    }

    // -----------------------------
    // Execute code
    // -----------------------------

    let passedCases = 0;

    const results = [];

    for (const testCase of testCases) {

      if (
        testCase.input === undefined ||
        testCase.output === undefined
      ) {
        return res.status(400).json({
          message:
            "Invalid test case format. Each test case requires input and output."
        });
      }

      const result = await executeCode({
        language,
        code,
        input: String(testCase.input),
        expectedOutput: String(testCase.output)
      });

      if (result.passed) {
        passedCases++;
      }

      results.push({
        status: result.status,
        passed: result.passed,
        actualOutput: result.actualOutput,
        expectedOutput: result.expectedOutput,
        executionTime: result.executionTime,
        memory: result.memory,
        stderr: result.stderr,
        compileOutput: result.compileOutput
      });

    }

    // -----------------------------
    // Calculate score
    // -----------------------------

    const totalCases = testCases.length;

    const percentage =
      totalCases > 0
        ? Number(
            ((passedCases / totalCases) * 100).toFixed(2)
          )
        : 0;

    const score = passedCases;

    // -----------------------------
    // Save submission
    // -----------------------------

    const submission = await prisma.submission.create({
      data: {
        userId,
        questionId: parsedQuestionId,
        language,
        code,
        passedCases,
        totalCases,
        score,
        percentage
      }
    });

    // -----------------------------
    // Activity logging
    // -----------------------------

    try {
      await logActivity(
        userId,
        "CODE_SUBMISSION",
        "coding",
        parsedQuestionId
      );
    } catch (logError) {
      console.error(
        "Activity log failed:",
        logError
      );
    }

    // -----------------------------
    // Response
    // -----------------------------

    res.status(201).json({
      message: "Code evaluated successfully",

      submissionId: submission.id,

      passedCases,

      totalCases,

      percentage,

      results
    });

  } catch (error) {

    console.error(
      "Code submission error:",
      error
    );

    if (
      error.message &&
      error.message.startsWith("Unsupported language")
    ) {
      return res.status(400).json({
        message: error.message
      });
    }

    if (error.code === "ECONNABORTED") {
      return res.status(504).json({
        message: "Code execution service timed out"
      });
    }

    if (error.response) {
      console.error(
        "Judge0 response:",
        error.response.data
      );
    }

    res.status(500).json({
      message: "Code execution failed"
    });
  }
};


// --------------------------------------------------
// CODING ANALYTICS
// --------------------------------------------------

exports.getCodingAnalytics = async (req, res) => {
  try {

    const userId = req.userId;

    const submissions =
      await prisma.submission.findMany({
        where: {
          userId
        },
        include: {
          question: true
        }
      });

    if (submissions.length === 0) {
      return res.json({
        message: "No coding submissions yet"
      });
    }

    let totalSubmissions =
      submissions.length;

    let totalScore = 0;

    let totalPercentage = 0;

    const difficultyStats = {};

    submissions.forEach((sub) => {

      totalScore += sub.score;

      totalPercentage += sub.percentage;

      const difficulty =
        sub.question.difficulty;

      if (!difficultyStats[difficulty]) {

        difficultyStats[difficulty] = {
          attempts: 0,
          score: 0
        };

      }

      difficultyStats[difficulty].attempts += 1;

      difficultyStats[difficulty].score +=
        sub.score;

    });

    const averageScore =
      totalScore / totalSubmissions;

    const averagePercentage =
      totalPercentage / totalSubmissions;

    res.json({

      totalSubmissions,

      averageScore:
        Number(averageScore.toFixed(2)),

      averagePercentage:
        Number(
          averagePercentage.toFixed(2)
        ),

      difficultyStats

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};