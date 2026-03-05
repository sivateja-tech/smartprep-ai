const prisma = require("../lib/prisma");

// 1️⃣ Create Quiz (Admin)
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

    res.status(201).json({
      message: "Quiz created successfully",
      quiz: newQuiz,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// 2️⃣ Add Question to Quiz
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
exports.getAllQuizzes=async (req,res)=>{
  try{
    const quizzes=await prisma.quiz.findMany({
      select:{
        id:true,
        title:true,
        topic:true,
        difficulty:true,
        createdAt:true
      }
    });
    res.status(200).json(quizzes);
  }catch(error){
    console.log(error);
    res.status(500).json({message:"server errror"});
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
    const { quizId, answers } = req.body;
    const userId = req.userId;

    const questions = await prisma.quizQuestion.findMany({
      where: { quizId: parseInt(quizId) }
    });

    let score = 0;

    questions.forEach(q => {
      const userAnswer = answers.find(a => a.questionId === q.id);
      if (userAnswer && userAnswer.selectedAns === q.correctAns) {
        score++;
      }
    });

    const total = questions.length;
    const percentage = (score / total) * 100;

    await prisma.quizAttempt.create({
      data: {
        userId,
        quizId: parseInt(quizId),
        score,
        total,
        percentage
      }
    });

    res.json({ score, total, percentage });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
// 6️⃣ Student Quiz Analytics
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