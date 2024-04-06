const mongoose=require('mongoose');
require('dotenv').config();

const mongoUrl=process.env.DB_URL;

mongoose.connect(mongoUrl);
const db=mongoose.connection;

db.on('connected',()=>{
  console.log('db connected');
  
});

db.on('error',(err)=>{
  console.error('MongoDB connection error: ',err);
});

db.on('disconnect',()=>{
  console.log('MongoDB disconnected');
});

module.exports=db;
