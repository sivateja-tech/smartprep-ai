const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

const BRANCHES = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'];
const TOPICS = ['Arrays', 'DBMS', 'OS', 'Networks', 'OOPs', 'DSA', 'System Design'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const LANGUAGES = ['JavaScript', 'Python', 'Java', 'C++'];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log('Seeding started...');

  // 1. Users (500 students)
  const hashedPassword = await bcrypt.hash('password123', 10);
  const users = [];
  for (let i = 0; i < 500; i++) {
    const user = await prisma.user.create({
      data: {
        name: `Students ${i}`,
        email: `students${i}@test.com`,
        password: hashedPassword,
        branch: randomFrom(BRANCHES),
        year: Math.floor(Math.random() * 4) + 1,
        role: 'student',
      },
    });
    users.push(user);
  }
  console.log(`Created ${users.length} users`);

  // 2. Quizzes with nested QuizQuestions (50 quizzes, 10 questions each)
  const quizzes = [];
  for (let i = 0; i < 50; i++) {
    const quiz = await prisma.quiz.create({
      data: {
        title: `Quiz ${i} - ${randomFrom(TOPICS)}`,
        topic: randomFrom(TOPICS),
        difficulty: randomFrom(DIFFICULTIES),
        questions: {
          create: Array.from({ length: 10 }, (_, j) => ({
            question: `Sample question ${j} for quiz ${i}?`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAns: 'Option A',
          })),
        },
      },
    });
    quizzes.push(quiz);
  }
  console.log(`Created ${quizzes.length} quizzes with 10 questions each`);

  // 3. QuizAttempts (each user attempts ~5 random quizzes)
  let attemptCount = 0;
  for (const user of users) {
    const attemptedQuizzes = [...quizzes].sort(() => 0.5 - Math.random()).slice(0, 5);
    for (const quiz of attemptedQuizzes) {
      const total = 10;
      const score = Math.floor(Math.random() * (total + 1));
      await prisma.quizAttempt.create({
        data: {
          userId: user.id,
          quizId: quiz.id,
          score,
          total,
          percentage: (score / total) * 100,
        },
      });
      attemptCount++;
    }
  }
  console.log(`Created ${attemptCount} quiz attempts`);

  // 4. CodingQuestions (30 questions)
  const codingQuestions = [];
  for (let i = 0; i < 30; i++) {
    const cq = await prisma.codingQuestion.create({
      data: {
        title: `Coding Problem ${i}`,
        description: `Solve problem ${i} involving ${randomFrom(TOPICS)}.`,
        difficulty: randomFrom(DIFFICULTIES),
        testCases: [
          { input: '1 2', output: '3' },
          { input: '5 5', output: '10' },
        ],
      },
    });
    codingQuestions.push(cq);
  }
  console.log(`Created ${codingQuestions.length} coding questions`);

  // 5. Submissions (each user submits ~3 random coding questions)
  let submissionCount = 0;
  for (const user of users) {
    const attemptedQuestions = [...codingQuestions].sort(() => 0.5 - Math.random()).slice(0, 3);
    for (const q of attemptedQuestions) {
      const totalCases = 2;
      const passedCases = Math.floor(Math.random() * (totalCases + 1));
      await prisma.submission.create({
        data: {
          userId: user.id,
          questionId: q.id,
          language: randomFrom(LANGUAGES),
          code: `// sample submitted code for question ${q.id}`,
          passedCases,
          totalCases,
          score: passedCases,
          percentage: (passedCases / totalCases) * 100,
        },
      });
      submissionCount++;
    }
  }
  console.log(`Created ${submissionCount} submissions`);

  // 6. InterviewSessions (each user has 0-2 sessions)
  let interviewCount = 0;
  for (const user of users) {
    const numSessions = Math.floor(Math.random() * 3); // 0, 1, or 2
    for (let i = 0; i < numSessions; i++) {
      await prisma.interviewSession.create({
        data: {
          userId: user.id,
          topic: randomFrom(TOPICS),
          feedback: 'Good understanding of core concepts, needs improvement on edge cases.',
          score: Math.floor(Math.random() * 10) + 1,
        },
      });
      interviewCount++;
    }
  }
  console.log(`Created ${interviewCount} interview sessions`);

  // 7. ActivityLog entries (optional, lightweight - one per quiz attempt / submission)
  await prisma.activityLog.create({
    data: {
      userId: users[0].id,
      action: 'SEED',
      entity: 'System',
      entityId: null,
    },
  });

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });