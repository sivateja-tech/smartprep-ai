const { Worker } = require("bullmq");
const prisma = require("../lib/prisma");
const sendEmail = require("../utils/sendEmail");

const worker = new Worker(
  "quizQueue",
  async (job) => {
    try {
      const { userId, quizId, answers } = job.data;

      console.log("Processing job:", job.id);

      // 1️⃣ Fetch questions
      const questions = await prisma.quizQuestion.findMany({
        where: { quizId }
      });

      let score = 0;

      // 2️⃣ Calculate score
      questions.forEach((q) => {
        const userAnswer = answers.find(
          (a) => a.questionId === q.id
        );

        if (userAnswer && userAnswer.selectedAns === q.correctAns) {
          score++;
        }
      });

      const total = questions.length;
      const percentage = total > 0 ? (score / total) * 100 : 0;

      // 3️⃣ Save attempt in DB
      await prisma.quizAttempt.create({
        data: {
          userId,
          quizId,
          score,
          total,
          percentage
        }
      });

      // 4️ Get user email
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      // 5️⃣ Send email
      if (user?.email) {
        await sendEmail(
          user.email,
          "Quiz Result - SmartPrep",
          `Hello ${user.name || "User"},\n\n` +
          `Your quiz result:\n` +
          `Score: ${score}/${total}\n` +
          `Percentage: ${percentage.toFixed(2)}%\n\n` +
          `Keep practicing!\n\n` +
          `- SmartPrep Team`
        );
      }

      console.log(` Job ${job.id} completed`);

      return { score, percentage };

    } catch (error) {
      console.error(" Worker error:", error.message);
      throw error;
    }
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379
    }
  }
);


worker.on("completed", (job) => {
  console.log(`🎯 Job ${job.id} completed successfully`);
});


worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err.message);
});