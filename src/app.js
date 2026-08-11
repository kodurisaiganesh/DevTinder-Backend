const express=require('express');
const app=express();
const port =3000;

app.use('/user',(req,res,next)=>{
   // res.send("FirstLine");
   console.log("First Line");
   res.send("First Line")
    next();
},
(req,res)=>{
    res.send("First Line executed by using next fucntion")

})
app.use('/users',(req,res)=>{
    res.send("LastLine");
})

app.listen(port,()=>{
    console.log("Port is running");
})