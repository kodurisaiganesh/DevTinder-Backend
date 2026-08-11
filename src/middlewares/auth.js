const UserAuth=((req,res,next)=>{
    const token='abcd';
    const isauthorized=token==='abcde';
    if(isauthorized)
    {
        console.log("Validation Succefull");
        next();
    }
    else{
        res.status(401).send("Login Failed");
    }
})
module.exports={UserAuth}