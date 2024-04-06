const express=require("express");
const router=express.Router();
const {jwtAuthMiddleware,generateToken}=require('../jwt');
const Candidate=require("../models/candidate");
const User = require("../models/user");

const checkAdminRole=async (userId)=>{
  try{
    const user=await User.findById(userId);
    return user.role==='admin';
  }catch(err){
    return false;
  }
}

router.post('/',jwtAuthMiddleware,async (req,res)=>{
  try{
    if(! await checkAdminRole(req.user.id)){
      return res.status(403).json({message:"User has not admin role"});
    }
    const data=req.body;
    const newCandidate=new Candidate(data);
    const response=await newCandidate.save();
    res.status(200).json({response:response});
  }catch(err){
    console.log(err);
    res.status(500).json({error:"Server error"});
  }
});

router.put('/:candidateID',jwtAuthMiddleware,async (req,res)=>{
  try{
    if(! await checkAdminRole(req.user.id)){
      return res.status(403).json({message:"User has not admin role"});
    }
    const candidateID=req.params.candidateID;
    const updatedCandidateData=req.body;
    const response=await Candidate.findByIdAndUpdate(candidateID,updatedCandidateData,{
      new:true,
      runValidators:true
    });
    if(!response){
      return res.status(404).json({error:"Candidate not found"});
    }
    res.status(200).json(response);
  }catch(err){
    console.log(err);
    res.status(500).json({error:"Server error"});
  }
});

router.delete('/:candidateID',jwtAuthMiddleware,async (req,res)=>{
  try{
    if(! await checkAdminRole(req.user.id)){
      return res.status(403).json({message:"User has not admin role"});
    }
    const candidateID=req.params.candidateID;
    const response=await Candidate.findByIdAndDelete(candidateID);
    if(!response){
      return res.status(404).json({error:"Candidate not found"});
    }
    res.status(200).json({message:"candidate removed successfully"});
  }catch(err){
    console.log(err);
    res.status(500).json({error:"Server error"});
  }
})

router.post('/vote/:candidateID',jwtAuthMiddleware,async (req,res)=>{
  const candidateID=req.params.candidateID;
  const userId=req.user.id;
  try{
    const candidate=await Candidate.findById(candidateID);
    if(!candidate){
      return res.status(404).json({message:'Candidate not found'});
    }
    const user=await User.findById(userId);
    if(!user){
      return res.status(404).json({message:'User not found'});
    }
    if(user.isVoted){
      return res.status(400).json({message:"You have already voted"});
    }
    if(user.role==='admin'){
      return res.status(403).json({message:"admin is not allowed to vote"});
    }
    candidate.votes.push({user:userId,votedAt:new Date().toLocaleString()});
    candidate.voteCount++;
    await candidate.save();
    user.isVoted=true;
    await user.save();
    res.status(200).json({message:"Vote recorded successfully"});
  }catch(err){
    console.log(err);
    res.status(500).json({error:"Server error"});
  }

})

router.get('/vote/count',async (req,res)=>{
  try{
    const candidate= await Candidate.find().sort({voteCount:'desc'});
    const voteRecord=candidate.map((data)=>{
      return {
        party:data.party,
        count:data.voteCount
      }
    });

    return res.status(200).json(voteRecord);
  }catch(err){
    console.log(err);
    res.status(500).json({error:"Server error"});
  }
})

module.exports=router;