const express=require('express');
const app=express();
require('dotenv').config();
const PORT=process.env.PORT;
const bodyParser=require('body-parser');
app.use(bodyParser.json());


app.listen(PORT,()=>{
  console.log("Listening on PORT: ",PORT);
})