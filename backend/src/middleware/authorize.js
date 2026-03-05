const authorize=(requiredRole)=>{
    return (req,res,next)=>{
        if(!req.userRole){
            return res.status(403).json({message:"Access denied"});
        }
    if(req.userRole!=requiredRole){
        return res.status(403).json({message:"You are not authorized"});
    }
    next();
    };
};
module.exports=authorize;