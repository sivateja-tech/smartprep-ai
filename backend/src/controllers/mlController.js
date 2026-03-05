const axios=require("axios");
const prisma=require("../lib/prisma");
exports.predictPlacement=async(req ,res)=>{
    try{
        const userId=req.userId;
        //quizattempts
        const attempts=await prisma.quizAttempt.findMany({
            where:{userId}
        });
        //coding submissions
        const submissions=await prisma.submission.findMany({
            where:{userId}
        });
        const quizAvg=attempts.reduce((sum,a)=>sum+a.percentage,0)/(attempts.length || 1);
        const codingAvg=submissions.reduce((sum,s)=>sum+s.percentage,0)/(submissions.length || 1);
        //send data to ml service
        const response=await axios.post("http://localhost:8000/predict",{
            quizAvg,
            codingAvg
        });
        res.json({
            quizAverage:quizAvg,
            codingAverage:codingAvg,
            prediction:response.data.prediction
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"prediction error"});
    }
};