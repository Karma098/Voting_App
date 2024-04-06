const express=require("express");
const router=express.Router();
const {jwtAuthMiddleware,generateToken}=require('../jwt');
const User=require("../models/user");


router.post('/signup',async (req,res)=>{
  try{
    const data=req.body;
    const newUser=new User(data);
    const response=await newUser.save();
    const payload={
      id:response.id
    }
    const token=generateToken(payload);
    res.status(200).json({response:response,token:token});
  }catch(err){
    console.log(err);
    res.status(500).json({error:"Server error"});
  }
})

router.post('/login',async (req,res)=>{
  try{
    const {aadharCardNumber,password}=req.body;
    const user=await User.findOne({aadharCardNumber:aadharCardNumber});
    if(!user || !(await user.comparePassword(password))){
      return res.status(401).json({error:"Invalid credential"});
    }
    const payload={
      id:user.id
    }
    const token=generateToken(payload);
    res.json({token});
  }catch(err){
    res.status(500).json({error:"Server error"});
  }
})

router.get('/profile',jwtAuthMiddleware,async (req,res)=>{
  try{
    const userData=req.user.id;
    const response=await User.findById(userData);
    res.status(200).json({response});
  }catch(err){
    res.status(500).json({error:"Server error"});
  }
})

router.put('/profile/password',jwtAuthMiddleware,async (req,res)=>{
  try{
    const userId=req.user.id;
    const {currentPassword,newPassword}=req.body;
    const user=await User.findById(userId);
    if(!(await user.comparePassword(currentPassword))){
      return res.status(401).json({error:"Invalid credential"});
    }
    user.password=newPassword;
    await user.save();
    res.status(200).json({message:"Password updated"});
  }catch(err){
    res.status(500).json({error:"Server error"});
  }

})



module.exports=router;