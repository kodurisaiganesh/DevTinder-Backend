const express=require('express');
const app=express();
const port =3000;
const {UserAuth}=require('./middlewares/auth.js')
app.use('/admin',UserAuth)
app.get('/admin/getData',(req,res)=>{
    res.send("Data Retrived Succesfully");
    
})
app.use('/admin/UpdateData',(req,res,next)=>{
    res.send("Data Updated Succesfully");
    
})

app.listen(port,()=>{
    console.log("Port is running");
})