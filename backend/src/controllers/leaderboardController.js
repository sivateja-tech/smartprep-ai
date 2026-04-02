const prisma=require('../lib/prisma');
exports.getLeaderboard=async(req, res)=>{
    try{
    const quizData=await prisma.quizAttempt.groupBy({
        by:["userId"],
        _avg:{percentage:true}
    });
    const codingData=await prisma.submission.groupBy({
        by:['userId'],
        _avg:{percentage:true}
    });
    const quizMap={};
    quizData.forEach(q=>{
        quizMap[q.userId]=q._avg.percentage || 0;
    });
    const codingMap={};
    codingData.forEach(c=>{
        codingMap[c.userId]=c._avg.percentage || 0;
    });
    const users=await prisma.user.findMany({
        select:{id:true,name:true}
    });
    const leaderboard=users.map(user=>{
        const quizAvg=quizMap[user.id] || 0;
        const codingAvg=codingMap[user.id] || 0;
        const finalScore=(quizAvg+codingAvg)/2;
        return {
            userId:user.id,
            name:user.name,
            quizAvg,
            codingAvg,
            finalScore
        };
    });
    leaderboard.sort((a,b)=>b.finalScore-a.finalScore);
    const ranked=leaderboard.map((user,index)=>({
         rank:index+1,
         ...user
    }));
    res.json(ranked);

}
catch(err){
    console.error(err);
    res.status(500).json({message:"server error"});
}
};
