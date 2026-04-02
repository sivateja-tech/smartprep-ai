const prisma = require("../lib/prisma");

exports.getSystemAnalytics = async (req, res) => {
  try {

    // counts
    const totalUsers = await prisma.user.count();
    const totalQuizzes = await prisma.quiz.count();
    const totalQuizAttempts = await prisma.quizAttempt.count();
    const totalCodingSubmissions = await prisma.submission.count();

    // averages
    const quizAvg = await prisma.quizAttempt.aggregate({
      _avg: { percentage: true }
    });

    const codingAvg = await prisma.submission.aggregate({
      _avg: { percentage: true }
    });

    res.json({
      totalUsers,
      totalQuizzes,
      totalQuizAttempts,
      totalCodingSubmissions,
      averageQuizScore: quizAvg._avg.percentage || 0,
      averageCodingScore: codingAvg._avg.percentage || 0
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};