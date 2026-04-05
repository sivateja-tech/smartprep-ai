const {Queue }=require('bullmq');
const quizQueue=new Queue('quizQueue',{
    connection:{
        host:"127.0.0.1",
        port:6379
    }
});
module.exports=quizQueue;