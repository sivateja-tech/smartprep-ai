const { z } = require("zod");

const createCodingQuestionSchema = z.object({
  title: z.string().trim().min(3).max(200),

  description: z.string().trim().min(10),

  difficulty: z.enum([
    "easy",
    "medium",
    "hard"
  ]),

  testCases: z
    .array(
      z.object({
        input: z.string(),
        output: z.string()
      })
    )
    .min(1)
});

const submitCodeSchema = z.object({
  questionId: z.coerce.number().int().positive(),

  language: z.enum([
    "c",
    "cpp",
    "java",
    "javascript",
    "python"
  ]),

  code: z.string().trim().min(1).max(50000)
});

const idParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

const listQuestionsSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional()
});

module.exports = {
  createCodingQuestionSchema,
  submitCodeSchema,
  idParamSchema,
  listQuestionsSchema
};