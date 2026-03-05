const prisma=require('../lib/prisma');
exports.createCodingQuestion=async (req,res)=>{
    try{
        const {title,description,difficulty,testCases}=req.body;
        if (!title || !description || !difficulty || !testCases) {
      return res.status(400).json({ message: "All fields required" });
    } 
    const question=await prisma.codingQuestion.create({
      data:{
        title, 
        description,
        difficulty,
        testCases
      }
    });
    res.status(201).json({
      message:"Coding question created",
      question
    });
    }
    catch(err){
      console.error(err);
      res.status(500).json({message:"server error"});
    }
};

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
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCodingQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await prisma.codingQuestion.findUnique({
      where: { id: parseInt(id) }
    });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(question);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.submitCode=async(req,res)=>{
  try{
    const userId=req.userId;
    const{questionId,language,code}=req.body;
    const question=await prisma.codingQuestion.findUnique({
      where:{id:parseInt(questionId)}
    });
    if(!question){
      return res.status(404).json({message:"Question not found"});
    }
    const testCases=question.testCases;
    let passed=0;
    const total=testCases.length;
    testCases.forEach(tc=>{
      if(code.includes(tc.output)){
        passed++;
      }
    });
    const percentage=(passed/total)*100;
    const score=passed;
    await prisma.submission.create({
      data: {
        userId,
        questionId: parseInt(questionId),
        language,
        code,
        passedCases: passed,
        totalCases: total,
        score,
        percentage
      }
    });
     res.json({
      passedCases: passed,
      totalCases: total,
      percentage
    });

  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCodingAnalytics = async (req, res) => {
  try {
    const userId = req.userId;

    const submissions = await prisma.submission.findMany({
      where: { userId },
      include: {
        question: true
      }
    });

    if (submissions.length === 0) {
      return res.json({ message: "No coding submissions yet" });
    }

    let totalSubmissions = submissions.length;
    let totalScore = 0;
    let totalPercentage = 0;

    const difficultyStats = {};

    submissions.forEach(sub => {
      totalScore += sub.score;
      totalPercentage += sub.percentage;

      const diff = sub.question.difficulty;

      if (!difficultyStats[diff]) {
        difficultyStats[diff] = {
          attempts: 0,
          score: 0
        };
      }

      difficultyStats[diff].attempts += 1;
      difficultyStats[diff].score += sub.score;
    });

    const averageScore = totalScore / totalSubmissions;
    const averagePercentage = totalPercentage / totalSubmissions;

    res.json({
      totalSubmissions,
      averageScore,
      averagePercentage,
      difficultyStats
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};