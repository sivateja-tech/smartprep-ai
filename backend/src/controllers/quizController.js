const prisma = require("../lib/prisma");
const logActivity = require("../utils/activityLogger");
const redis = require("../lib/redis");
const quizQueue=require("../queues/quizQueue")
exports.createQuiz = async (req, res) => {
  try {
    const { title, topic, difficulty } = req.body;

    if (!title || !topic || !difficulty) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newQuiz = await prisma.quiz.create({
      data: {
        title,
        topic,
        difficulty,
      },
    });
     await redis.flushAll();

    res.status(201).json({
      message: "Quiz created successfully",
      quiz: newQuiz,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.addQuestionToQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { question, options, correctAns } = req.body;

    if (!question || !options || !correctAns) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: "Options must be an array" });
    }

    const newQuestion = await prisma.quizQuestion.create({
      data: {
        quizId: parseInt(quizId),
        question,
        options,
        correctAns,
      },
    });

    res.status(201).json({
      message: "Question added successfully",
      question: newQuestion,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getAllQuizzes = async (req, res) => {
try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    
    const cacheKey = `quizzes:page:${page}:limit:${limit}`;

    // 1️⃣ Check cache
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return res.json({
        source: "cache",
        ...JSON.parse(cachedData)
      });
    }

    // 2️⃣ Fetch from DB
    const quizzes = await prisma.quiz.findMany({
      skip: skip,
      take: limit,
      select: {
        id: true,
        title: true,
        topic: true,
        difficulty: true,
        createdAt: true
      }
    });

    const total = await prisma.quiz.count();

    const responseData = {
      page,
      limit,
      total,
      data: quizzes
    };

    // 3️⃣ Store in Redis (60 sec)
    await redis.set(cacheKey, JSON.stringify(responseData), {
      EX: 60
    });

    res.json({
      source: "db",
      ...responseData
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  
}
};
exports.getQuizById=async (req,res)=>{
 
    const quiz=await prisma.quiz.findUnique({
      where:{id:parseInt(req.params.quizId)},
      include:{questions:true}
    });
    const sanitizedQuestions=quiz.questions.map(q=>({
      id:q.id,
      question:q.question,
      options:q.options
    }));
    res.json({
    id: quiz.id,
    title: quiz.title,
    topic: quiz.topic,
    difficulty: quiz.difficulty,
    questions: sanitizedQuestions
  });
  
};
exports.submitQuiz = async (req, res) => {
  try {
    const userId = req.userId;
    const { quizId, answers } = req.body;

    await quizQueue.add("submitQuiz", {
      userId,
      quizId,
      answers
    });

    res.json({
      message: "Quiz submitted successfully. Processing in background."
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error submitting quiz" });
  }
};
exports.getQuizAnalytics = async (req, res) => {
  try {
    const userId = req.userId;

    const attempts = await prisma.quizAttempt.findMany({
      where: { userId },
      include: { quiz: true }
    });

    if (attempts.length === 0) {
      return res.json({ message: "No attempts yet" });
    }

    let totalQuizzes = attempts.length;
    let totalScore = 0;
    let totalQuestions = 0;

    const topicPerformance = {};

    attempts.forEach(a => {
      totalScore += a.score;
      totalQuestions += a.total;

      const topic = a.quiz.topic;

      if (!topicPerformance[topic]) {
        topicPerformance[topic] = { score: 0, total: 0 };
      }

      topicPerformance[topic].score += a.score;
      topicPerformance[topic].total += a.total;
    });

    const overallPercentage = totalQuestions
  ? (totalScore / totalQuestions) * 100
  : 0;

    res.json({
      totalQuizzes,
      overallPercentage,
      topicPerformance
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};