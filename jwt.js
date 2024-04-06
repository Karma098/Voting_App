const jwt=require("jsonwebtoken");
require('dotenv').config();

const jwtAuthMiddleware=(req,res,next)=>{
  const auth=req.headers.authorization;
  if(!auth) return res.status(401).json({error:"Unauthorized"});
  try{
    const token=req.headers.authorization.split(" ")[1];
    if(!token) return res.status(401).json({error:"Unauthorized"});
    const response=jwt.verify(token,process.env.JWT_SECRET);
    req.user=response;
    next();
  }catch(err){
    res.status(404).json({error:"Invalid token"});
  }
}

const generateToken=(userData)=>{
  return jwt.sign(userData,process.env.JWT_SECRET,{expiresIn:30000});
}

module.exports={jwtAuthMiddleware,generateToken};