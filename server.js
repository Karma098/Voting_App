const express=require('express');
const app=express();
const db=require('./db');
require('dotenv').config();
const PORT=process.env.PORT;
const bodyParser=require('body-parser');
app.use(bodyParser.json());

const userRoutes=require("./Routes/userRoutes");
const candidateRoutes=require("./Routes/candidateRoutes");
app.use('/user',userRoutes);
app.use('/candidate',candidateRoutes);


app.listen(PORT,()=>{
  console.log("Listening on PORT: ",PORT);
})