const axios = require("axios");
const prisma = require("../lib/prisma");

// delay helper
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

exports.generateQuiz = async (req, res) => {
  try {
    const { topic, difficulty = "medium", numQuestions = 5 } = req.body;

    // ✅ Input validation
    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    const prompt = `
Generate ${numQuestions} multiple choice questions on ${topic} with ${difficulty} difficulty.

Return ONLY valid JSON array. No explanation, no markdown.

Format:
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "..."
  }
]
`;

    // 🔥 Gemini API call with retry
    let response;
    try {
      response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent",
        {
          contents: [{ parts: [{ text: prompt }] }]
        },
        {
          params: { key: process.env.GEMINI_API_KEY }
        }
      );
    } catch (err) {
      // ✅ Retry if rate limited
      if (err.response?.status === 429) {
        console.log("Rate limited. Retrying after 20s...");
        await delay(20000);

        response = await axios.post(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent",
          {
            contents: [{ parts: [{ text: prompt }] }]
          },
          {
            params: { key: process.env.GEMINI_API_KEY }
          }
        );
      } else {
        throw err;
      }
    }

    let content =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // 🟡 Clean response
    content = content
      .replace(/```json|```/g, "")
      .replace(/^[^\[]*/, "") // remove text before JSON
      .trim();

    let questions;
    try {
      questions = JSON.parse(content);
    } catch (err) {
      return res.status(500).json({
        message: "Failed to parse AI response",
        raw: content
      });
    }

    // 🟢 Save quiz
    const quiz = await prisma.quiz.create({
      data: {
        title: `${topic} Quiz`,
        topic,
        difficulty
      }
    });

    // 🚀 Faster DB insert (parallel)
    await Promise.all(
      questions.map((q) =>
        prisma.quizQuestion.create({
          data: {
            quizId: quiz.id,
            question: q.question,
            options: q.options,
            correctAns: q.correctAnswer
          }
        })
      )
    );

    res.json({
      message: "AI Quiz generated successfully",
      quizId: quiz.id,
      questions
    });

  } catch (error) {
    console.error("FULL ERROR:", JSON.stringify(error.response?.data, null, 2));
    console.error("MSG:", error.message);

    // ✅ Graceful fallback
    return res.status(500).json({
      message: "AI generation failed. Please try again later."
    });
  }
};