/*
  Warnings:

  - You are about to drop the column `expectedOutput` on the `CodingQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `isCorrect` on the `QuizAttempt` table. All the data in the column will be lost.
  - You are about to drop the column `questionId` on the `QuizAttempt` table. All the data in the column will be lost.
  - You are about to drop the column `selectedAns` on the `QuizAttempt` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `QuizQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `topic` on the `QuizQuestion` table. All the data in the column will be lost.
  - Added the required column `percentage` to the `QuizAttempt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quizId` to the `QuizAttempt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `QuizAttempt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `QuizAttempt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quizId` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `percentage` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "QuizAttempt" DROP CONSTRAINT "QuizAttempt_questionId_fkey";

-- AlterTable
ALTER TABLE "CodingQuestion" DROP COLUMN "expectedOutput";

-- AlterTable
ALTER TABLE "QuizAttempt" DROP COLUMN "isCorrect",
DROP COLUMN "questionId",
DROP COLUMN "selectedAns",
ADD COLUMN     "percentage" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "quizId" INTEGER NOT NULL,
ADD COLUMN     "score" INTEGER NOT NULL,
ADD COLUMN     "total" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "QuizQuestion" DROP COLUMN "difficulty",
DROP COLUMN "topic",
ADD COLUMN     "quizId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "percentage" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "Quiz" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewSession" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "topic" TEXT NOT NULL,
    "feedback" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterviewSession_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewSession" ADD CONSTRAINT "InterviewSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
