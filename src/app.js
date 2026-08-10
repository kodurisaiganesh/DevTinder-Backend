const express=require('express');
const app=express();
const port =3000;

app.get('/',(req,res)=>{
    res.send('Hello world');
})
app.get('/hello',(req,res)=>{
    res.send("live server")
})
app.get('/hello1',(req,res)=>{
    res.send("live server")
})


app.listen(port,()=>{
    console.log(`Listening the portt ${port}`)
})