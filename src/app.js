const express=require('express');
const app=express();
const port =3000;

//https methods

app.get('/user',(req,res)=>{
    res.send({firstName:"SaiGanesh"
    })
})

app.post('/users',(req,res)=>{
    res.send("Sending the data Sccessfully")
})
// it will work for all https methods
app.use('/',(req,res)=>{
    res.send('Hello world');
})
// it will print hello world because of order matters
app.get('/hello',(req,res)=>{
    res.send("live server")
})
// if we use get  it will print the live server
app.get('/hello1',(req,res)=>{
    res.send("live server")
})

app.get('/abcd',(req,res)=>{
    res.send("Hiii");
})


app.listen(port,()=>{
    console.log(`Listening the portt ${port}`)
})