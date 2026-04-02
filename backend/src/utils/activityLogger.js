const prisma=require("../lib/prisma");
const logActivity=async (userId,action,entity=null,entityId=null)=>{
    try{
        await prisma.ActivityLog.create({
             data:{
                userId,
                action,
                entity,
                entityId
             }
        });
    }catch(error){
        console.log("Activity logging failed:",error);
        
    }
};
module.exports=logActivity;